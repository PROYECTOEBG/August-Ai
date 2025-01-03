/* creado por TECNO */

import axios from 'axios';

let handler = async (m, { conn, command, text }) => {
  if (!text) {
    return await conn.sendMessage(
      m.chat,
      { text: '⚠️ *Ingrese el nombre de una canción de SoundCloud.*' },
      { quoted: m }
    );
  }

  await conn.sendMessage(m.chat, { react: { text: '🕒', key: m.key } });

  try {
    // Buscar la canción en SoundCloud
    let { data: searchResults } = await axios.get(
      `https://apis-starlights-team.koyeb.app/starlight/soundcloud-search?text=${encodeURIComponent(text)}`
    );

    if (!searchResults.length) {
      throw new Error('No se encontraron resultados.');
    }

    let songData = searchResults[0];
    let { url, title } = songData;

    // Obtener los datos de descarga
    let { data: downloadData } = await axios.get(
      `https://apis-starlights-team.koyeb.app/starlight/soundcloud?url=${url}`
    );

    let { link: dl_url, quality, image } = downloadData;

    // Descargar el audio
    let { data: audioBuffer } = await axios.get(dl_url, { responseType: 'arraybuffer' });

    // Formatear el mensaje
    let txt = `*🎶 SoundCloud Music 🎶*\n\n`;
    txt += `🎵 *Título:* ${title}\n`;
    txt += `📶 *Calidad:* ${quality}\n`;
    txt += `🔗 *URL:* ${url}\n\n`;
    txt += `🚀 _Powered by Starlights Team_`;

    // Enviar la imagen y el audio
    await conn.sendMessage(m.chat, { image: { url: image }, caption: txt }, { quoted: m });
    await conn.sendMessage(
      m.chat,
      { audio: audioBuffer, mimetype: 'audio/mpeg', fileName: `${title}.mp3` },
      { quoted: m }
    );

    await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });
  } catch (e) {
    console.error(e);
    await conn.sendMessage(
      m.chat,
      { text: '❌ *Hubo un error al procesar tu solicitud. Intenta nuevamente.*' },
      { quoted: m }
    );
    await conn.sendMessage(m.chat, { react: { text: '✖️', key: m.key } });
  }
};

handler.help = ['soundcloud <búsqueda>'];
handler.tags = ['downloader'];
handler.command = ['soundcloud', 'sound', 'play'];

export default handler;