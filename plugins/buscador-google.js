import { googleImage } from '@bochilteam/scraper';

const handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) throw `*🚩 Uso Correcto: ${usedPrefix + command} Inosuke*`;

  // Define otras variables necesarias
  const packname = 'Nombre del paquete'; // Define tu packname
  const wm = 'Watermark'; // Define tu marca de agua
  const channel = 'https://example.com/your-channel'; // Define el enlace del canal
  const textbot = 'Texto del bot'; // Define el texto que quieras usar
  const rcanal = null; // Ajusta según lo que esperes usar

  conn.reply(m.chat, '🚩 *Descargando su imagen...*', m, {
    contextInfo: {
      externalAdReply: {
        mediaUrl: null,
        mediaType: 1,
        showAdAttribution: true,
        title: packname,
        body: wm,
        previewType: 0,
        sourceUrl: channel,
      },
    },
  });

  const res = await googleImage(text);
  const image = await res.getRandom();
  const link = image;

  conn.sendFile(m.chat, link, 'error.jpg', `*🔎 Resultado De: ${text}*\n> ${textbot}`, m, null, rcanal);
};

handler.help = ['imagen <query>'];
handler.tags = ['buscador', 'tools', 'descargas'];
handler.command = /^(image|imagen)$/i;
handler.register = true;

export default handler;