import fetch from 'node-fetch';

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) {
    return conn.reply(m.chat, '❀ Ingresa el link de una cancion de spotify', m, rcanal);
  }

  try {
    let api = await fetch(`https://api.giftedtech.my.id/api/download/spotifydl?apikey=gifted&url=${text}`);
    let json = await api.json();
    let { quality, title, duration, thumbnail, download_url: dl_url } = json.result;
   
    let HS = `- Titulo : ${title}
- Calidad : ${quality}
- Duracion : ${duration}`;

    await conn.sendFile(m.chat, thumbnail, 'defoult.jpg', HS, m,rcanal);
    await conn.sendFile(m.chat, dl_url, 'defoult.mp3', null, m);
  } catch (error) {
    console.error(error);
  }
};

handler.command = /^(spotify)$/i;

export default handler;