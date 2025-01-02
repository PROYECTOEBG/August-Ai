import Scraper from "@SumiFX/Scraper";

let handler = async (m, { conn, args, usedPrefix, command }) => {
  if (!args[0]) {
    return conn.reply(m.chat,`🍭 Ingresa el enlace del vídeo de YouTube junto al comando.\n\n` + `Ejemplo:\n` + `*${usedPrefix + command}* https://youtu.be/QSvaCSt8ixs`,m,rcanal);
  }

  if (!args[0].match(/youtu/gi)) {
    return conn.reply(m.chat, 'Verifica que el enlace sea de YouTube.', m,rcanal);
  }

  let user = global.db.data.users[m.sender];
  try {
    let { title, size, quality, thumbnail, dl_url } = await Scraper.ytmp4(args[0]);

    if (size.includes('GB') || parseFloat(size.replace(' MB', '')) > 300) {
      return await m.reply('El archivo pesa más de 300 MB, se canceló la descarga.');
    }

    let txt = `╭─⬣「 *YouTube Download* 」⬣\n` +
              `│  ≡◦ *⭐ Título:* ${title}\n` +
              `│  ≡◦ *🪴 Calidad:* ${quality}\n` +
              `│  ≡◦ *⚖ Peso:* ${size}\n` +
              `╰─⬣`;

    await conn.sendFile(m.chat, thumbnail, 'thumbnail.jpg', txt, m,rcanal);


    await conn.sendFile(m.chat, dl_url,`${title}.mp4`, `*⭐ Título:* ${title}\n*🪴 Calidad:* ${quality}`, m, false, { asDocument: user.useDocument });
  } catch (error) {
    console.error(error);
    await m.reply('❌ Ocurrió un error al intentar descargar el video. Por favor, inténtalo de nuevo.');
  }
};

handler.help = ['ytmp4 <url>'];
handler.tags = ['downloader'];
handler.command = ['ytmp4', 'yt', 'ytv']; 
// handler.limit = 1

export default handler