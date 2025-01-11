import fetch from 'node-fetch';

const handler = async (m, { conn }) => {
  const apiUrl = 'aHR0cHM6Ly9kZWxpcml1c3NhcGktb2ZpY2lhbC52ZXJjZWwuYXBwL25zZncvZ2lybHM='; // Ofuscado en Base64

  const decodeApiUrl = (base64) => Buffer.from(base64, 'base64').toString('utf-8');
  const finalUrl = decodeApiUrl(apiUrl);

  conn.reply(m.chat, '🚩 *Buscando imágenes, espere un momento...*', m);

  try {
    const response = await fetch(finalUrl);
    if (!response.ok) throw '🚩 *Error al obtener la imagen.*';

    const buffer = await response.buffer();

    // Enviar la imagen al usuario
    await conn.sendFile(m.chat, buffer, 'image.jpg', '*🔞 Aquí tienes tu pack*', m);
  } catch (error) {
    console.error(error);
    conn.reply(m.chat, '🚩 *Hubo un problema al obtener la imagen.*', m);
  }
};

handler.help = ['pack'];
handler.tags = ['nsfw'];
handler.command = /^pack$/i;
handler.register = true;

export default handler;