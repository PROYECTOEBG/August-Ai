import fetch from 'node-fetch';

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) {
    return conn.reply(m.chat,`❗ *Por favor ingresa un término de búsqueda o URL para encontrar el video.*\n\n*Ejemplo:* ${usedPrefix}${command} https://youtu.be/dQw4w9WgXcQ`,m);
  }

  await m.react('🕓');

  try {
    const apiUrl = `https://api.giftedtech.my.id/api/download/dlmp4?apikey=gifted&url=${encodeURIComponent(text)}`;
    const response = await fetch(apiUrl);
    const data = await response.json();

    const { title, quality, thumbail, download_url } = data.result;

    await conn.sendMessage(
      m.chat,
      {
        document: { url: download_url },
        mimetype: 'video/mp4',
        fileName: `${title}.mp4`,
        caption: `📂 *Video Descargado:*\n\n📌 *Título:* ${title}\n🎥 *Calidad:* ${quality}\n🖼️ [Vista previa](${thumbail})`,
      },
      { quoted: m }
    );

    await m.react('✅'); 
  } catch (error) {
    console.error('Error al procesar el video:', error);
    await conn.reply(m.chat, `❌ *Ocurrió un error al intentar procesar tu solicitud:*\n${error.message || 'Error desconocido'}`, m);
    await m.react('❌');
  }
};

handler.help = ['ytmp4 <url>'];
handler.tags = ['dl'];
handler.command = /^ytmp4$/i;
handler.register = true;

export default handler;