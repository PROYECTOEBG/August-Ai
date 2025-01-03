/**
© ZENITH
ᘎ https://whatsapp.com/channel/0029Vai9MMj5vKABWrYzIJ2Z
*/
import fetch from "node-fetch"
import yts from "yt-search"

let handler = async (m, { conn, args }) => {
  const text = args.join(" ") || m.quoted?.text || m.quoted?.caption || m.quoted?.description || ""
  if (!text.trim()) return m.reply("[🚨] 𝐒𝐨𝐥𝐢𝐜𝐢𝐭𝐮𝐝 𝐢𝐧𝐜𝐨𝐦𝐩𝐥𝐞𝐭𝐚. 𝐈𝐧𝐭𝐞𝐧𝐭𝐞 𝐧𝐮𝐞𝐯𝐚𝐦𝐞𝐧𝐭𝐞, 𝐞𝐬𝐭𝐚 𝐯𝐞𝐳 𝐩𝐫𝐨𝐩𝐨𝐫𝐜𝐢𝐨𝐧𝐚𝐧𝐝𝐨 𝐮𝐧 𝐭í𝐭𝐮𝐥𝐨 𝐝𝐞 𝐯𝐢𝐝𝐞𝐨 𝐝𝐞 𝐘𝐨𝐮𝐓𝐮𝐛𝐞.\n\n[✅] 𝐄𝐣𝐞𝐦𝐩𝐥𝐨: */play* 𝐔𝐧 𝐚𝐦𝐨𝐫 𝐝𝐞𝐥 𝐚𝐲𝐞𝐫")
  await m.reply("*[🚨] 𝐒𝐨𝐥𝐢𝐜𝐢𝐭𝐮𝐝 𝐞𝐧 𝐩𝐫𝐨𝐜𝐞𝐬𝐨...*")

  const res = await yts(text)
  const vid = res.videos[0]
  if (!vid) return m.reply("🌸 Soy un poco lenta espera para un ratito ")

  const { title, thumbnail, timestamp, views, ago, url } = vid
  const formattedViews = parseInt(views).toLocaleString("id-ID") + " el link esta mal "
  const captvid = `★¸.•☆•.¸★ 𝐃𝐄𝐒𝐂𝐀𝐑𝐆𝐀𝐒 | 𝐏𝐋𝐀𝐘 ★⡀.•☆•.★\n\n[🍿] *𝐓Í𝐓𝐔𝐋𝐎:*\n*»* ${title}\n\n[⌛] *𝐃𝐔𝐑𝐀𝐂𝐈Ó𝐍:*\n*»* ${timestamp}\n\n[📆] *𝐏𝐔𝐁𝐋𝐈𝐂𝐀𝐃𝐎:*\n*»* ${ago}\n`

  const ytthumb = (await conn.getFile(thumbnail))?.data

  const infoReply = {
    contextInfo: {
      externalAdReply: {
        body: "🌸 𝐌𝐈𝐙𝐔𝐊𝐈 𝐀𝐈 🌸",
        mediaType: 1,
        mediaUrl: url,
        previewType: 0,
        renderLargerThumbnail: true,
        sourceUrl: url,
        thumbnail: ytthumb,
        title: "Y O U T U B E - P L A Y"
      }
    }
  }

  await conn.reply(m.chat, captvid, m, infoReply, rcanal)

  const apiRes = await fetch(`https://api.zenkey.my.id/api/download/ytmp3?apikey=zenkey&url=${url}`)
  const json = await apiRes.json()

  if (json.status) {
    const { result } = json
    const { download } = result
    await conn.sendMessage(m.chat, {
      audio: { url: download.url },
      caption: `*Judul:* ${title}\n*Ukuran File:* ${download.size}\n*Kualitas:* ${download.quality}`,
      mimetype: "audio/mpeg",
      contextInfo: infoReply.contextInfo
    }, { quoted: m })
  } else {
    await m.reply("Tiene un error en el código ")
  }
}

handler.help = ['play', 'play2', 'play3', 'play4', 'playdoc'];
handler.tags = ['descargas'];
handler.command = ['play', 'play2', 'play3', 'play4', 'mp3', 'mp4', 'playdoc', 'playdoc2']
handler.limit = true

export default handler