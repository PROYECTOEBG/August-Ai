import fetch from "node-fetch";

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) {
    return conn.sendMessage(m.chat, {
      text: `❗ *Por favor ingresa una URL de YouTube para descargar el video.*\n\n📌 *Ejemplo de uso:*\n\`${usedPrefix}${command} https://www.youtube.com/watch?v=dQw4w9WgXcQ\``,
    });
  }

  try {
    // Mensaje mientras se procesa la solicitud
    await conn.sendMessage(m.chat, {
      text: `⏳ *Procesando tu solicitud...*\n\nPor favor, espera mientras preparamos tu descarga. 🚀`,
    });

    // Decodificar la URL de la API (Base64)
    const base64Api = "aHR0cHM6Ly9hcGkudnJlZGVuLm15LmlkL2FwaS95dG1wNA==";
    const apiUrl = `${Buffer.from(base64Api, "base64").toString("utf-8")}?url=${encodeURIComponent(text)}`;

    // Llamar a la API y parsear los datos
    const response = await fetch(apiUrl);
    const data = await response.json();

    // Comprobar si los datos son válidos
    if (!data || data.status !== 200 || !data.result || !data.result.download || !data.result.download.url) {
      throw new Error("No se encontraron datos válidos para tu solicitud.");
    }

    const {
      result: {
        download: { url: rawDownloadUrl, filename },
      },
    } = data;

    // Corregir la URL de descarga (reemplazar espacios con %20)
    const downloadUrl = rawDownloadUrl.replace(/\s+/g, "%20");

    // Enviar el video como documento (MP4)
    await conn.sendMessage(
      m.chat,
      {
        document: { url: downloadUrl },  // Enviar la URL del video como documento
        mimetype: "video/mp4",            // Especificar que es un video en formato MP4
        fileName: filename || "video.mp4",  // El nombre del archivo
        caption: `🎥 *Tu video está listo para descargar.*`,  // Caption del archivo
      },
      { quoted: m }  // Responder a la solicitud inicial
    );
  } catch (error) {
    console.error("Error al procesar el video:", error);
    await conn.sendMessage(m.chat, {
      text: `❌ *Ocurrió un error al procesar tu solicitud:*\n${error.message || "Error desconocido"}`,
    });
  }
};

handler.command = /^ytv$/i;

export default handler