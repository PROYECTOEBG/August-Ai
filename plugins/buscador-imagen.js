import fetch from 'node-fetch';

const handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) throw `*🚩 Uso Correcto: ${usedPrefix + command} gatos*`;

  // API ofuscada con Base64
  const encodedApiUrl = 'aHR0cHM6Ly9hcGkudnJlZGVuLm15LmlkL2FwaS9naW1hZ2U/cXVlcnk9';
  const decodeApiUrl = (base64) => Buffer.from(base64, 'base64').toString('utf-8');

  const apiUrl = decodeApiUrl(encodedApiUrl) + encodeURIComponent(text);

  conn.reply(m.chat, '🚩 *Buscando imágenes, espere un momento...*', m);

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (data.status !== 200 || !data.result || data.result.length === 0) {
      throw '🚩 *No se encontraron imágenes para tu búsqueda.*';
    }

    // Obtener una URL aleatoria de la lista de resultados
    const imageUrl = data.result[Math.floor(Math.random() * data.result.length)];

    // Enviar la imagen al chat
    conn.sendFile(m.chat, imageUrl, 'image.jpg', `*🔎 Resultado para: ${text}*`, m);
  } catch (error) {
    console.error(error);
    conn.reply(m.chat, '🚩 *Hubo un problema al obtener las imágenes.*', m);
  }
};

handler.help = ['imagen <query>'];
handler.tags = ['buscador', 'tools', 'descargas'];
handler.command = /^(image|imagen)$/i;
handler.register = true;

export default handler;