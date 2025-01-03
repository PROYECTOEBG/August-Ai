import fetch from 'node-fetch';

let handler = async (m, { conn, text }) => {
  if (!text) {
    return conn.reply(
      m.chat,
      `❗ *Por favor ingresa una URL de YouTube para descargar el video.*\n\n*Ejemplo:* !ytmp4 https://youtu.be/XMZWmVxJ3rk`,
      m
    );
  }

  try {
    await conn.reply(
      m.chat,
      `⏳ *Procesando tu solicitud...*\n\n📥 *Preparando la descarga del video, espera un momento...*`,
      m
    );

    let apiUrl = `https://api.giftedtech.my.id/api/download/dlmp4?apikey=gifted&url=${encodeURIComponent(text)}`;
    let apiResponse = await fetch(apiUrl);
    let json = await apiResponse.json();

    let { title, quality, download_url, thumbail } = json.result;

    // Enviar como documento
    await conn.sendMessage(
      m.chat,
      {
        document: { url: download_url },
        mimetype: 'video/mp4',
        fileName: `${title}.mp4`,
        caption: `📂 *Video Descargado:*\n\n🎥 *Título:* ${title}\n📦 *Calidad:* ${quality}\n\n✅ ¡Disfrútalo!`,
      },
      { quoted: m }
    );
  } catch (error) {
    console.error("Error:", error.message);
    await conn.reply(
      m.chat,
      `❌ *Ocurrió un error al procesar tu solicitud:*\n\n${error.message}`,
      m
    );
  }
};


handler.help = ['ytmp4 <url>'];
handler.tags = ['download'];
handler.command = /^ytmp4$/i;

export default handler;