import fetch from "node-fetch";
import fs from "fs";
import yts from "yt-search";

// FunciÃ³n para manejar reintentos de solicitudes
const fetchWithRetries = async (url, maxRetries = 2) => {
  let attempt = 0;
  while (attempt <= maxRetries) {
    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data && data.status === 200 && data.result && data.result.download && data.result.download.url) {
        return data.result;
      }
    } catch (error) {
      console.error(`Error en el intento ${attempt + 1}:`, error.message);
    }
    attempt++;
  }
  throw new Error("No se pudo obtener una respuesta vÃ¡lida despuÃ©s de varios intentos.");
};

// Handler principal
let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) {
    return conn.sendMessage(m.chat, {
      text: `â— *Por favor ingresa un tÃ©rmino de bÃºsqueda para encontrar la mÃºsica.*\n\n*Ejemplo para .pasar:* ${usedPrefix}pasar No llores mÃ¡s\n*Ejemplo para .play:* ${usedPrefix}play No llores mÃ¡s`,
    });
  }

  // Mensaje inicial indicando que MediaHub estÃ¡ buscando la mÃºsica
  const key = await conn.sendMessage(m.chat, {
    text: `âŒ˜â”â”€â”â”€â‰ª *MEDIAHUB* â‰«â”€â”â”€â”âŒ˜\n\nðŸ”Ž *Buscando la mÃºsica, por favor espera...*`,
  });

  try {
    // Realizar bÃºsqueda en YouTube
    const searchResults = await yts(text);
    if (!searchResults || !searchResults.videos.length) {
      throw new Error("No se encontraron resultados en YouTube.");
    }

    // Seleccionar el primer resultado
    const video = searchResults.videos[0];
    const { title, timestamp: duration, views, author, ago, url: videoUrl } = video;

    // URL de la API secundaria
    const apiUrl = `https://api.vreden.web.id/api/ytmp3?url=${encodeURIComponent(videoUrl)}`;

    // Intentar obtener datos con reintentos
    const apiData = await fetchWithRetries(apiUrl);

    const { metadata, download } = apiData;
    const { url: downloadUrl } = download;

    if (command === "pasar") {
      // DescripciÃ³n personalizada para el comando .pasar
      const descriptionVideoPasar = `âŒ˜â”â”€â”â”€â‰ª *MEDIAHUB* â‰«â”€â”â”€â”âŒ˜\nâ˜… *TÃ­tulo:* ${metadata.title}\nâ˜… *Subido:* ${metadata.ago || "Desconocido"}\nâ˜… *DuraciÃ³n:* ${metadata.duration.timestamp}\nâ˜… *Vistas:* ${metadata.views.toLocaleString()}\nâ˜… *Autor:* ${metadata.author.name}\nâ˜… *URL:* ${metadata.url}\nâŒ˜â”â”â”€â‰ª Power By MediaHub â‰«â”€â”â”âŒ˜\n\n> _*MediaHub estÃ¡ enviando su archivo, por favor espere..._*`;

      // Actualizar mensaje inicial con la informaciÃ³n especÃ­fica de .pasar
      await conn.sendMessage(m.chat, { text: descriptionVideoPasar, edit: key });

      // Enviar archivo como documento
      await conn.sendMessage(
        m.chat,
        {
          document: { url: downloadUrl },
          mimetype: "audio/mpeg",
          fileName: `${metadata.title}.mp3`,
          caption: "> MÃºsica obtenida desde MediaHub",
          contextInfo: {
            externalAdReply: {
              title: metadata.title,
              body: "MÃºsica desde MediaHub",
              previewType: "PHOTO",
              thumbnail: fs.readFileSync("./media/menu.jpg"),
              mediaUrl: metadata.url,
            },
          },
        },
        { quoted: m }
      );
    }

    if (command === "play") {
      // DescripciÃ³n personalizada para el comando .play
      const descriptionVideoPlay = `âŒ˜â”â”€â”â”€â‰ª *MEDIAHUB* â‰«â”€â”â”€â”âŒ˜\n\nðŸŽ¶ *Disfruta la mÃºsica que encontramos para ti:*\n\nðŸŽµ *TÃ­tulo:* ${metadata.title}\nâ³ *DuraciÃ³n:* ${metadata.duration.timestamp}\nðŸ‘ï¸ *Vistas:* ${metadata.views.toLocaleString()}\nâœï¸ *Autor:* ${metadata.author.name}\nðŸ”— *URL:* ${metadata.url}\n\nðŸŒŸ *Listo para escuchar en alta calidad.*\n\nâŒ˜â”â”â”€â‰ª Power By MediaHub â‰«â”€â”â”âŒ˜`;

      // Actualizar mensaje inicial con la informaciÃ³n especÃ­fica de .play
      await conn.sendMessage(m.chat, { text: descriptionVideoPlay, edit: key });

      // Enviar archivo como audio
      await conn.sendMessage(
        m.chat,
        {
          audio: { url: downloadUrl },
          mimetype: "audio/mpeg",
          fileName: `${metadata.title}.mp3`,
          caption: "ðŸŽ¶ MÃºsica desde MediaHub",
        },
        { quoted: m }
      );
    }
  } catch (error) {
    console.error("Error al procesar la solicitud:", error);
    await conn.sendMessage(m.chat, {
      text: `âŒ *OcurriÃ³ un error al intentar procesar tu solicitud:*\n${error.message || "Error desconocido"}`,
      edit: key,
    });
  }
};

handler.command = /^pasar|play$/i;

export default handler;