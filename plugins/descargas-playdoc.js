import fetch from "node-fetch";

// URL de la API ofuscada en Base64
const encodedApiUrl = "aHR0cHM6Ly9hcGkudnJlZGVuLm15LmlkL2FwaS95dHBsYXltcDM=";

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) {
    return conn.sendMessage(m.chat, {
      text: `❗ *Por favor ingresa un término de búsqueda para encontrar la música.*\n\n📌 *Ejemplo:* ${usedPrefix}playdoc No llores más\n\n🤖 *Procesado por BarbozaBot-Ai*`,
    });
  }

  try {
    // Decodificar la URL de la API
    const apiUrl = Buffer.from(encodedApiUrl, "base64").toString("utf-8");
    const finalUrl = `${apiUrl}?query=${encodeURIComponent(text)}`;

    // Llamar a la API y parsear los datos
    const response = await fetch(finalUrl);
    const data = await response.json();

    // Comprobaciones para la respuesta
    if (!data || data.status !== 200 || !data.result || !data.result.download) {
      throw new Error("La API no devolvió datos válidos.");
    }

    const {
      result: {
        metadata: { title, author, timestamp, image, description, views, url: videoUrl },
        download: { url: rawDownloadUrl },
      },
    } = data;

    // Corregir la URL de descarga si hay espacios
    const downloadUrl = rawDownloadUrl.replace(/\s+/g, "%20");

    // Enviar información del video al usuario
    await conn.sendMessage(m.chat, {
      image: { url: image },
      caption: `🎵 *Música Encontrada:*\n\n📌 *Título:* ${title}\n👤 *Autor:* ${author.name}\n⏱️ *Duración:* ${timestamp}\n👁️ *Vistas:* ${views}\n\n🔗 *Enlace del Video:* ${videoUrl}\n\n🤖 *Procesado por BarbozaBot-Ai*`,
    });

    // Enviar música como documento .mp3
    await conn.sendMessage(
      m.chat,
      {
        document: { url: downloadUrl },
        mimetype: "audio/mpeg",
        fileName: `${title}.mp3`,
        caption: `🎵 *Música descargada:*\n📌 *Título:* ${title}\n👤 *Autor:* ${author.name}\n⏱️ *Duración:* ${timestamp}\n\n🤖 *BarbozaBot-Ai al servicio!*`,
      },
      { quoted: m }
    );
  } catch (error) {
    console.error("Error al descargar la música:", error);
    await conn.sendMessage(m.chat, {
      text: `❌ *Ocurrió un error al intentar procesar tu solicitud:*\n${error.message || "Error desconocido"}\n\n🤖 *BarbozaBot-Ai trabajando para ti.*`,
    });
  }
};

// Definir el comando
handler.command = /^playdoc$/i;

export default handler;