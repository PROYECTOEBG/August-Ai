import fetch from "node-fetch";
import yts from "yt-search";

// Función para obtener datos de la API con reintentos
const fetchWithRetries = async (url, maxRetries = 2) => {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(url);
      const data = await response.json();
      if (data?.status === 200 && data.result?.download?.url) {
        return data.result;
      }
    } catch (error) {
      console.error(`Intento ${attempt + 1} fallido:`, error.message);
    }
  }
  throw new Error("No se pudo obtener la música después de varios intentos.");
};

// Handler principal
let handler = async (m, { conn, text }) => {
  if (!text) {
    return conn.sendMessage(m.chat, {
      text: "❗ *Ingresa un término de búsqueda para encontrar música.*\n\n*Ejemplo:* `.play No llores más`",
    });
  }

  try {
    // Buscar en YouTube
    const searchResults = await yts(text);
    const video = searchResults.videos[0];
    if (!video) throw new Error("No se encontraron resultados.");

    // Obtener datos de descarga
    const apiUrl = `https://api.vreden.web.id/api/ytmp3?url=${encodeURIComponent(video.url)}`;
    const apiData = await fetchWithRetries(apiUrl);

    // Enviar música como archivo
    await conn.sendMessage(m.chat, {
      document: { url: apiData.download.url },
      mimetype: "audio/mpeg",
      fileName: `${apiData.metadata.title}.mp3`,
      caption: `🎵 *Título:* ${apiData.metadata.title}\n👁️ *Vistas:* ${apiData.metadata.views}\n⏳ *Duración:* ${apiData.metadata.duration.timestamp}\n✍️ *Autor:* ${apiData.metadata.author.name}`,
    });
  } catch (error) {
    console.error("Error:", error);
    await conn.sendMessage(m.chat, {
      text: `❌ *Error al procesar tu solicitud:*\n${error.message || "Error desconocido"}`,
    });
  }
};

handler.command = /^play $/i;

export default handler;