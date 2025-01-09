import axios from 'axios';
import cheerio from 'cheerio';
import qs from 'qs';

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) {
    return m.reply(`Ejemplo de uso: *${usedPrefix + command} Joji - Ew*`);
  }

  const appleMusic = {
    search: async (query) => {
      const url = `https://music.apple.com/us/search?term=${query}`;
      try {
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);
        const results = [];
        $('.desktop-search-page .section[data-testid="section-container"] .grid-item').each((index, element) => {
          const title = $(element).find('.top-search-lockup__primary__title').text().trim();
          const subtitle = $(element).find('.top-search-lockup__secondary').text().trim();
          const link = $(element).find('.click-action').attr('href');
          results.push({ title, subtitle, link });
        });
        return results;
      } catch (error) {
        console.error("Error en búsqueda de Apple Music:", error.message);
        return { success: false, message: error.message };
      }
    }
  };

  const appledown = {
    download: async (urls) => {
      const musicData = await axios.get(urls).then((response) => response.data);
      if (!musicData) {
        return { success: false, message: "No se encontraron datos de música." };
      }

      const { name, albumname, artist, duration, releaseDate, thumb, url } = musicData;
      const downloadLink = musicData.download_url;

      return {
        success: true,
        name,
        albumname,
        artist,
        duration,
        releaseDate,
        thumb,
        download: downloadLink
      };
    }
  };

  conn.sendMessage(m.chat, { react: { text: "🕒", key: m.key } });

  const searchResults = await appleMusic.search(text);
  if (!searchResults.length) {
    return m.reply("No se encontraron resultados para tu búsqueda.");
  }

  const musicData = await appledown.download(searchResults[0].link);
  if (!musicData.success) {
    return m.reply(`Error: ${musicData.message}`);
  }

  const { name, albumname, artist, duration, releaseDate, thumb, download } = musicData;

  const infoMessage = `*Autor:* ${artist}\n*Nombre:* ${name}\n*Duración:* ${duration}\n*Publicada:* ${releaseDate}`;
  await conn.sendMessage(m.chat, { text: infoMessage });

  const doc = {
    audio: { url: download },
    mimetype: 'audio/mp4',
    fileName: `${name}.mp3`,
    contextInfo: {
      externalAdReply: {
        showAdAttribution: true,
        mediaType: 2,
        mediaUrl: searchResults[0].link,
        title: name,
        sourceUrl: searchResults[0].link,
        thumbnail: await (await conn.getFile(thumb)).data
      }
    }
  };

  await conn.sendMessage(m.chat, doc, { quoted: m });
  await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });
};

handler.help = ['play'];
handler.tags = ['downloader'];

handler.command = 'play', /^(applemusicplay|play|song)$/i;

export default handler;