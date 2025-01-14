import fetch from 'node-fetch';
import yts from 'yt-search';

let handler = async (m, { conn, command, text, usedPrefix }) => {
  if (!text) {
    return conn.reply(m.chat, `❀ Ingresa el nombre o término de búsqueda de la canción`, m);
  }

  try {
    // Búsqueda en YouTube usando yt-search
    let searchResults = await yts(text);
    if (!searchResults || !searchResults.videos.length) {
      return conn.reply(m.chat, `❗ No se encontraron resultados para tu búsqueda: *${text}*`, m);
    }

    // Selecciona el primer resultado
    let video = searchResults.videos[0];
    let { title, author, image: img, timestamp: duration, url: videoUrl, views } = video;

    // Llamada a la API con el enlace del video encontrado
    let api = await fetch(`https://delirius-apiofc.vercel.app/download/ytmp3?url=${videoUrl}`);
    let json = await api.json();
    let { download } = json.data;

    let HS = `🎶 *Información del Audio* 🎶
- *Título:* ${title}
- *Autor:* ${author.name || author}
- *Duración:* ${duration}
- *Visitas:* ${Num(views)}

📂 *Detalles del Archivo*
- *Tamaño:* ${download.size}
- *Calidad:* ${download.quality}`;

    // Envía la información del video
    await conn.sendFile(m.chat, img, 'info.jpg', HS, m);

    // Envía el archivo de audio
    await conn.sendMessage(
      m.chat,
      { audio: { url: download.url }, mimetype: 'audio/mpeg' },
      { quoted: m }
    );
  } catch (error) {
    console.error(error);
    conn.reply(m.chat, `❌ Ocurrió un error al procesar tu solicitud: ${error.message}`, m);
  }
};

handler.command = /^(ytmp3|play)$/i;

export default handler;

// Función para dar formato a números grandes
function Num(number) {
  if (number >= 1000 && number < 1000000) {
    return (number / 1000).toFixed(1) + 'k';
  } else if (number >= 1000000) {
    return (number / 1000000).toFixed(1) + 'M';
  } else if (number <= -1000 && number > -1000000) {
    return (number / 1000).toFixed(1) + 'k';
  } else if (number <= -1000000) {
    return (number / 1000000).toFixed(1) + 'M';
  } else {
    return number.toString();
  }
}