import fetch from 'node-fetch';

var handler = async (m, { conn, args, usedPrefix, command }) => {
    if (!args[0]) {
        throw m.reply(`*🦅 Ejemplo: ${usedPrefix + command}* https://vm.tiktok.com/ZMhAk8tLx/`);
    }

    try {
        await conn.reply(m.chat, "🌷 *Espere un momento, estoy descargando su audio...*", m);

        const tiktokData = await tiktokdl(args[0]);

        if (!tiktokData || !tiktokData.data.music) {
            throw m.reply("❌ *Error:* No se pudo obtener el audio.");
        }

        const audioURL = tiktokData.data.music;
        const infonya_gan = `*📖 Descripción:* ${tiktokData.data.title}\n*🚀 Publicado:* ${tiktokData.data.create_time}\n\n*⚜️ Estado:*\n=====================\nLikes = ${tiktokData.data.digg_count}\nComentarios = ${tiktokData.data.comment_count}\nCompartidas = ${tiktokData.data.share_count}\nVistas = ${tiktokData.data.play_count}\nDescargas = ${tiktokData.data.download_count}\n=====================\n\nUploader: ${tiktokData.data.author.nickname || "No info"}\n(${tiktokData.data.author.unique_id} - https://www.tiktok.com/@${tiktokData.data.author.unique_id})\n*🔊 Sonido:* ${tiktokData.data.music}\n`;

        // Enviar el audio como archivo en lugar de nota de voz
        await conn.sendMessage(
            m.chat,
            {
                audio: { url: audioURL },
                mimetype: "audio/mp3", // Especificar que es un archivo de audio
                fileName: "tiktok_audio.mp3",
                ptt: false // Esto evita que WhatsApp lo detecte como nota de voz
            },
            { quoted: m }
        );

        await conn.reply(m.chat, "`🎶 AUDIO DESCARGADO DE TIKTOK`" + `\n\n${infonya_gan}`, m);
    } catch (error) {
        conn.reply(m.chat, `❌ *Error:* ${error.message || error}`, m);
    }
};

handler.help = ['ttmp3', 'tiktokmp3'];
handler.tags = ['descargas'];
handler.command = /^ttmp3|tiktokmp3$/i;

handler.disable = false;
handler.register = true;
handler.limit = true;

export default handler;

async function tiktokdl(url) {
    let apiUrl = `https://www.tikwm.com/api/?url=${url}&hd=1`;
    let response = await fetch(apiUrl);
    let json = await response.json();
    return json;
}