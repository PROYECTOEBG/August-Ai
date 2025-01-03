import fetch from 'node-fetch';

let handler = async (m, { conn, text }) => {
  if (!text) {
    return conn.reply(
      m.chat,
      '❗ *Por favor ingresa un enlace válido de YouTube para descargar el video.*',
      m
    );
  }

  try {
    await conn.reply(
      m.chat,
      '⏳✨ *Procesando tu solicitud...* Por favor, espera mientras preparamos tu descarga.',
      m
    );

    const apiUrl = `https://api.giftedtech.my.id/api/download/dlmp4?apikey=gifted&url=${encodeURIComponent(text)}`;
    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error('No se pudo obtener una respuesta válida de la API.');
    }

    const {
      success,
      result: { title, download_url: downloadUrl, quality, thumbail },
    } = await response.json();

    if (!success || !downloadUrl) {
      throw new Error('No se encontró un enlace de descarga válido en la respuesta de la API.');
    }

    const fileResponse = await fetch(downloadUrl, { method: 'HEAD' });
    const fileSize = parseInt(fileResponse.headers.get('content-length') || 0);
    const fileSizeMB = (fileSize / (1024 * 1024)).toFixed(2);

    await conn.sendMessage(
      m.chat,
      {
        document: { url: downloadUrl },
        mimetype: 'video/mp4',
        fileName: `${title}.mp4`,
        caption: `🎥 *Título:* ${title}\n📁 *Calidad:* ${quality}\n📦 *Tamaño:* ${fileSizeMB} MB`,
      },
      { quoted: m }
    );
  } catch (error) {
    console.error('Error al procesar la descarga de video:', error);
    await conn.reply(
      m.chat,
      `❌ *Error al descargar el video:*
${error.message || 'Error desconocido'}`,
      m
    );
  }
};

handler.help = ['ytmp4doc <url>'];
handler.tags = ['downloader'];
handler.command = /^ytmp4doc$/i;
handler.register = true;

export default handler;