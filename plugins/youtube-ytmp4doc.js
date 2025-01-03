import fetch from "node-fetch";

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) {
    return conn.sendMessage(m.chat, {
      text: `❗ *Por favor ingresa un término de búsqueda para encontrar el video.*\n\n*Ejemplo:* ${usedPrefix}${command} Never Gonna Give You Up`,
    });
  }

  try {
    await conn.sendMessage(m.chat, {
      text: `⏳✨ trabajando en tu video...\n\n📥 Por favor, espera mientras preparamos tu descarga. 🚀`,
    });

    // Decodificar la URL de la API
    const encodedApiUrl = "aHR0cHM6Ly9hcGkudnJlZGVuLm15LmlkL2FwaS95dHBsYXltcDQ="; // Codificado en Base64
    const apiUrl = https://restapi.apibotwa.biz.id/api/ytmp4?url=$

    const response = await fetch(apiUrl);
    const data = await response.json();

    if (!data || data.status !== 200 || !data.result || !data.result.download) {
      throw new Error("La API no devolvió datos válidos.");
    }

    const {
      result: {
        metadata: { title, author, timestamp, image, views, url: videoUrl },
        download: { url: rawDownloadUrl },
      },
    } = data;

    const downloadUrl = rawDownloadUrl.replace(/\s+/g, "%20");

    // Obtener el tamaño del archivo
    const fileResponse = await fetch(downloadUrl, { method: "HEAD" });
    const fileSize = parseInt(fileResponse.headers.get("content-length") || 0);
    const fileSizeInMB = fileSize / (1024 * 1024); // Convertir bytes a MB

    await conn.sendMessage(m.chat, {
      image: { url: image },
      caption: `🎥 *Video Encontrado:*\n\n📌 *Título:* ${title}\n👤 *Autor:* ${author.name}\n⏱️ *Duración:* ${timestamp}\n👁️ *Vistas:* ${views}\n📦 *Tamaño:* ${fileSizeInMB.toFixed(2)} MB\n\n🔗 *Enlace del Video:* ${videoUrl}\n\n📥 *Preparando tu descarga...*`,
    });

    // Enviar siempre el video en formato documento
    await conn.sendMessage(
      m.chat,
      {
        document: { url: downloadUrl },
        mimetype: "video/mp4",
        fileName: `${title}.mp4`,
        caption: `📂 *Video en Formato Documento:* \n📌 *Título:* ${title}\n👤 *Autor:* ${author.name}\n⏱️ *Duración:* ${timestamp}\n📦 *Tamaño:* ${fileSizeInMB.toFixed(2)} MB`,
      },
      { quoted: m }
    );
  } catch (error) {
    console.error("Error al descargar el video:", error);
    await conn.sendMessage(m.chat, {
      text: `❌ *Ocurrió un error al intentar procesar tu solicitud:*\n${error.message || "Error desconocido"}`,
    });
  }
};

handler.command = /^ytmp4doc$/i;

export default handler;