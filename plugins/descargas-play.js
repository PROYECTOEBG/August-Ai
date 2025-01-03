import fg from 'api-dylux'
import { youtubedl, youtubedlv2 } from '@bochilteam/scraper'
import yts from 'yt-search'
import fetch from 'node-fetch'

let handler = async (m, { conn, args, usedPrefix, text, command }) => {
    let formatosDisponibles = ["mp3", "mp4", "mp3doc", "mp4doc"]

    let [formato, ...busqueda] = text.split(" ")
    if (!formatosDisponibles.includes(formato)) {
        return conn.reply(
            m.chat,
            `🤖 *𝐓𝐞𝐜𝐧𝐨-𝐁𝐨𝐭 | Formatos disponibles para descargar:*\n\n` +
            `🎵 Audio (mp3):\n- ${usedPrefix + command} mp3 [búsqueda]\n- ${usedPrefix + command} mp3doc [búsqueda]\n\n` +
            `🎥 Video (mp4):\n- ${usedPrefix + command} mp4 [búsqueda]\n- ${usedPrefix + command} mp4doc [búsqueda]`,
            m
        )
    }

    if (!busqueda.length) {
        return conn.reply(m.chat, `❌ *Por favor, ingresa el título o URL del contenido que deseas descargar.*\n\nEjemplo: ${usedPrefix + command} mp3 Enemy`, m)
    }

    let consulta = busqueda.join(" ")
    let resultados = await yts(consulta)
    let video = resultados.videos[0]
    if (!video) {
        return conn.reply(m.chat, `❌ *No se encontraron resultados para:* ${consulta}`, m)
    }

    let mensajeInfo = `🔰 *𝐓𝐞𝐜𝐧𝐨-𝐁𝐨𝐭 | Información del Video*\n\n` +
        `📌 *Título:* ${video.title}\n` +
        `📆 *Publicado hace:* ${video.ago}\n` +
        `⏳ *Duración:* ${video.timestamp}\n` +
        `👁️ *Vistas:* ${video.views}\n` +
        `🔗 *Enlace:* ${video.url}\n\n` +
        `⚙️ *Procesando su descarga...* Espere un momento.`

    await conn.sendFile(m.chat, video.thumbnail, 'thumbnail.jpg', mensajeInfo, m)

    try {
        if (formato === "mp3" || formato === "mp3doc") {
            let q = '128kbps'
            let descarga = await fg.yta(video.url, q)
            let { dl_link, title, filesizeF } = descarga

            if (formato === "mp3doc") {
                await conn.sendMessage(m.chat, {
                    document: { url: dl_link },
                    mimetype: 'audio/mpeg',
                    fileName: `${title}.mp3`
                }, { quoted: m })
            } else {
                await conn.sendMessage(m.chat, {
                    audio: { url: dl_link },
                    mimetype: 'audio/mp4',
                    fileName: `${title}.mp3`
                }, { quoted: m })
            }
        }

        if (formato === "mp4" || formato === "mp4doc") {
            let q = '360p'
            let descarga = await fg.ytv(video.url, q)
            let { dl_link, title, filesizeF } = descarga

            if (formato === "mp4doc") {
                await conn.sendMessage(m.chat, {
                    document: { url: dl_link },
                    mimetype: 'video/mp4',
                    fileName: `${title}.mp4`
                }, { quoted: m })
            } else {
                await conn.sendMessage(m.chat, {
                    video: { url: dl_link },
                    mimetype: 'video/mp4',
                    caption: `${title}`
                }, { quoted: m })
            }
        }

        await m.react('✅')
    } catch (e) {
        console.error(e)
        await conn.reply(m.chat, `❌ *Ocurrió un error al procesar tu descarga.*`, m)
        await m.react('❌')
    }
}

handler.help = ['play2'].map(v => v + " <formato> <búsqueda>")
handler.tags = ['descargas']
handler.command = ['play', 'play2', 'yt', 'yta', 'ytv']
handler.register = true

export default handler