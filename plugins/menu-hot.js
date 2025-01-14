
import fs from 'fs';
import fetch from 'node-fetch';

let handler = async (m, { conn, usedPrefix, command }) => {
    if (!db.data.chats[m.chat].nsfw && m.isGroup) {
        throw '⚠ Los comandos +18 están desactivados en este grupo. Si eres admin y deseas activarlos, usa el comando .on nsfw';
    }

    try {
        let d = new Date();
        let locale = 'es';
        let week = d.toLocaleDateString(locale, { weekday: 'long' });
        let date = d.toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' });
        let _uptime = process.uptime() * 1000;
        let uptime = clockString(_uptime);
        let taguser = conn.getName(m.sender);

        let menu = `
¡Hola! 👋🏻 @${m.sender.split("@")[0]}
\`\`\`${week}, ${date}\`\`\`

╭──𝗠𝗘𝗡𝗨 𝗛𝗢𝗧──────
│ 𝘉𝘪𝘦𝘯𝘷𝘦𝘯𝘪𝘥𝘰 ...
│ Dale cariño a tu ganzo 
│ con el menú hot.
╰────────────────

» 𝗗𝗘𝗦𝗖𝗔𝗥𝗚𝗔𝗦 𝗛𝗢𝗧 
│🔥➺ .tetas
│🔥➺ .xvideos
│🔥➺ .xnxx link
│🔥➺ .xnxxsearch texto
│🔥➺ .pornhubsearch texto
╰━━━━━━⋆★⋆━━━━━━⬣

» 𝗧𝗥𝗜𝗣𝗘 𝗫
│🔞➺ .nsfwoli
│🔞➺ .nsfwfoot
│🔞➺ .nsfwass
│🔞➺ .nsfwbdsm
│🔞➺ .nsfwcum
│🔞➺ .nsfwero
│🔞➺ .nsfwfemdom
│🔞➺ .nsfwglass
│🔞➺ .nsfworgy
│🔞➺ .yuri
│🔞➺ .yaoi
│🔞➺ .booty
│🔞➺ .ecchi
│🔞➺ .furro
│🔞➺ .hentai
│🔞➺ .trapito
╰━━━━━━⋆★⋆━━━━━━⬣
`.trim();

        // URLs de medios (video o imagen)
        const videoUrl = 'https://d.uguu.se/sOFHhFFQ.mp4';
        const imageUrl = 'https://via.placeholder.com/500x500'; // Cambia por una URL válida

        // Envío del mensaje
        try {
            await conn.sendMessage(m.chat, {
                video: { url: videoUrl },
                gifPlayback: true,
                caption: menu,
                mentions: [m.sender]
            });
        } catch {
            await conn.sendMessage(m.chat, {
                image: { url: imageUrl },
                caption: menu,
                mentions: [m.sender]
            });
        }
    } catch (e) {
        await m.reply(`⚠ Error al ejecutar el comando. Intenta nuevamente o reporta este problema usando el comando:\n*${usedPrefix}reporte ${command}*\n\nDetalles del error:\n${e.message}`);
        console.error(e);
    }
};

handler.command = /^(menuhot)$/i;
handler.register = false;
export default handler;

// Función para convertir tiempo en formato HH:MM:SS
function clockString(ms) {
    let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000);
    let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60;
    let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60;
    return [h, m, s].map(v => v.toString().padStart(2, 0)).join(':');
}