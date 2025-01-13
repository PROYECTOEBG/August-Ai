import { googleImage } from '@bochilteam/scraper';

const handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) throw `*🚩 Uso Correcto: ${usedPrefix + command} Avión*`;

  // Define otras variables necesarias
  const packname = global.packname; // Define tu packname
  const wm = '𝙎𝙄𝙎𝙆𝙀𝘿 - 𝙂𝙊𝙊𝘿'; // Define tu marca de agua
  const channel = global.canal; // Define el enlace del canal
  const textbot = global.textbot; // Define el texto que quieras usar
  const rcanal = 'https://i.ibb.co/WFcXVvr/file.jpg'; // Ajusta según lo que esperes usar

  conn.reply(m.chat, '🚩 *Descargando su imagen...*', m, {
    contextInfo: {
      externalAdReply: {
        mediaUrl: null,
        mediaType: 1,
        showAdAttribution: true,
        title: packname,
        body: textbot,
        previewType: 0,
        sourceUrl: canal,
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
handler.command = ['imagen', 'image'];

export default handler;