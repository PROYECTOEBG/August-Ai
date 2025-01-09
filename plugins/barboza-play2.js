import fetch from "node-fetch";
import yts from "yt-search"; // Asegúrate de tener instalado yt-search

const fetchWithRetries = async (url, maxRetries = 2) => {
  let attempt = 0;
  while (attempt <= maxRetries) {
    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data && data.status === 200 && data.data && data.data.download && data.data.download.url) {
        return data.data; // Retorna el resultado si es válido
      }
    } catch (error) {
      console.error(`Error en el intento ${attempt + 1}:`, error.message);
    }
    attempt++;
  }
  throw new Error("No se pudo obtener una respuesta válida después de varios intentos.");
};

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) {
    return conn.sendMessage(m.chat, {
      text: `⚠️ *¡Atención!*\n\n💡 *Por favor ingresa un término de búsqueda para encontrar el video.*\n\n📌 *Ejemplo para ${usedPrefix}play2:* ${usedPrefix}play2 Never Gonna Give You Up`,
    });
  }

  try {
    await conn.sendMessage(m.chat, {
      text: `
╭━━━🌐📡━━━╮  
   🔍 **Buscando en ☆Bot Barboza Ai☆** 🔍  
╰━━━🌐📡━━━╯  

✨ *Estamos localizando tu video...*  
📥 *Por favor espera unos instantes mientras procesamos tu solicitud.*  

⏳ *Esto puede tardar unos segundos.*  
      `,
    });

    // Búsqueda en YouTube
    const searchResults = await yts(text);
    const video = searchResults.videos[0]; // Tomamos el primer resultado

    if (!video) {
      return conn.sendMessage(m.chat, {
        text: `❌ *No se encontraron resultados para:* ${text}`,
      });
    }

    const { title, url: videoUrl, timestamp, views, author, image, ago } = video;

    // Llamar a la API de descarga con reintentos
    const apiUrl = `https://***********/api/ytmp4?url=${encodeURIComponent(videoUrl)}`; // API ofuscada
    const apiData = await fetchWithRetries(apiUrl);

    const { metadata, download } = apiData;
    const { duration } = metadata;
    const { url: downloadUrl, quality, filename } = download;

    // Obtener el tamaño del archivo
    const fileResponse = await fetch(downloadUrl, { method: "HEAD" });
    const fileSize = parseInt(fileResponse.headers.get("content-length") || 0);
    const fileSizeInMB = fileSize / (1024 * 1024); // Convertir bytes a MB

    // Formato del mensaje de información
    const videoInfo = `
╭━━━☆☆☆━━━╮  
 *★ Bot Barboza Ai ★*
╰━━━☆☆☆━━━╯  
🎵 **Título:**  ${title}  

📅 **Subido hace:**  ${ago}  

⏱️ **Duración:**  ${timestamp}  

👀 **Vistas:**  ${views.toLocaleString()}  

👤 **Autor:**  ${author.name}  

🔗 **Enlace del video:**  ${videoUrl}  
╭━━━━━━☆☆☆━━━━━━━╮    
 > Por favor espera 🔄 ....  
╰━━━━━━☆☆☆━━━━━━━╯  
    `;

    await conn.sendMessage(m.chat, { image: { url: image }, caption: videoInfo });

    // Descargar como documento o video según el tamaño
    if (fileSizeInMB > 70) {
      await conn.sendMessage(
        m.chat,
        {
          document: { url: downloadUrl },
          mimetype: "video/mp4",
          fileName: filename || `${title}.mp4`,
          caption: `📂 *Video en Formato Documento:* \n🎵 *Título:* ${title}\n👤 *Autor:* ${author.name}\n⏱️ *Duración:* ${duration.timestamp || timestamp}\n📦 *Tamaño:* ${fileSizeInMB.toFixed(2)} MB`,
        },
        { quoted: m }
      );
    } else {
      await conn.sendMessage(
        m.chat,
        {
          video: { url: downloadUrl },
          mimetype: "video/mp4",
          fileName: filename || `${title}.mp4`,
          caption: `🎥 *Video Reproducible:* \n🎵 *Título:* ${title}\n👤 *Autor:* ${author.name}\n⏱️ *Duración:* ${duration.timestamp || timestamp}\n📦 *Tamaño:* ${fileSizeInMB.toFixed(2)} MB`,
        },
        { quoted: m }
      );
    }
  } catch (error) {
    console.error("Error al descargar el video:", error);
    await conn.sendMessage(m.chat, {
      text: `❌ *Ocurrió un error al intentar procesar tu solicitud:*\n${error.message || "Error desconocido"}`,
    });
  }
};

handler.command = /^play2$/i;

export default handler;