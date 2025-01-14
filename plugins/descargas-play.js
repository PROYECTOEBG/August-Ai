import fetch from "node-fetch";
import yts from "yt-search";

// Función para manejar la decodificación Base64
const decodeBase64 = (encoded) => Buffer.from(encoded, "base64").toString("utf-8");

let handler = async (m, { conn, text, usedPrefix }) => {
  if (!text) return conn.reply(m.chat, `❀ Ingresa un término de búsqueda o enlace de YouTube✌🏻`, m);

  try {
    // Realizar búsqueda en YouTube utilizando yts
    const searchResults = await yts(text);
    if (!searchResults || !searchResults.videos.length) {
      return conn.reply(m.chat, "❌ *No se encontraron resultados en YouTube*.", m);
    }

    // Obtener el primer resultado
    const video = searchResults.videos[0];
    const { title, url: videoUrl, thumbnail } = video;

    // URL de la API en Base64 (ofuscada)
    const encodedApiUrl = "aHR0cHM6Ly9hcGktcmluLXRvaHNrYS52ZXJjZWwuYXBwL2Rvd25sb2FkL3l0bXAzP3VybD0=";
    
    // Decodificar la URL de la API
    const apiUrl = decodeBase64(encodedApiUrl) + encodeURIComponent(videoUrl);

    // Realizar la solicitud a la API
    const apiResponse = await fetch(apiUrl);
    const json = await apiResponse.json();

    if (!json.status || !json.data || !json.data.download) {
      throw new Error("No se pudo obtener la URL de descarga.");
    }

    const {
      data: {
        title: videoTitle,
        description,
        uploaded,
        duration,
        views,
        author: { name: authorName, url: authorUrl },
        download: downloadUrl,
      },
    } = json;

    // Descripción personalizada
    const descriptionText = `🔎 *Resultado Encontrado*\n
- 🎵 *Título:* ${videoTitle}
- ⏱️ *Duración:* ${duration}
- 👀 *Vistas:* ${views.toLocaleString()}
- ✍️ *Autor:* [${authorName}](${authorUrl})
- 📅 *Subido:* ${uploaded}\n
- 🎶 *Descripción:* ${description}\n\n> _*Barboza Bot está enviando tu archivo, por favor espera..._*`;

    // Enviar mensaje con la miniatura
    await conn.sendFile(m.chat, thumbnail, "thumbnail.jpg", descriptionText, m);

    // Enviar el archivo de audio
    await conn.sendMessage(
      m.chat,
      {
        audio: { url: downloadUrl },
        mimetype: "audio/mpeg",
        fileName: `${videoTitle}.mp3`,
        caption: "🎶 Música obtenida desde Barboza Bot Ai",
      },
      { quoted: m }
    );
  } catch (error) {
    console.error(error);
    await conn.reply(
      m.chat,
      `❌ *Ocurrió un error al procesar tu solicitud:*\n${error.message || "Error desconocido"}`,
      m
    );
  }
};

handler.command = /^(ytmp3|play)$/i;

export default handler;