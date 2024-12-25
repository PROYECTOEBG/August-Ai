import fs from 'fs';
const handler = (m) => m;
handler.all = async function(m) {

const chat = global.db.data.chats[m.chat];
if (chat.isBaneed) return
if (/^bot$/i.test(m.text)) {
conn.reply(m.chat, `☃️ ¡Hola! Soy BotBarboza-Ai, en que puedo ayudarte hoy?\n\n✰ Usa *.menu* para ver mis comandos.`, m, rcanal, )
}
if (/^que|q$/i.test(m.text)) {
conn.reply(m.chat, `*so*`, m, rcanal, )
}

if (/^.ah/i.test(m.text)) {
conn.reply(m.chat, `*sua*`, m, rcanal, )
}

if (/^.bermuda/i.test(m.text)) {
conn.reply(m.chat, `*Mapa Eligido Bermuda ☃️*`, m, rcanal, )
}

if (/^.alpes/i.test(m.text)) {
conn.reply(m.chat, `*Mapa Eligido Alpes ☃️*`, m, rcanal, )
}

if (/^.purgatorio/i.test(m.text)) {
conn.reply(m.chat, `*Mapa Eligido Purgatorio ☃️*`, m, rcanal, )
}

if (/^.kalahari$/i.test(m.text)) {
conn.reply(m.chat, `*Mapa Eligido Kalahari ☃️*`, m, rcanal, )
}

if (/^.nexterra$/i.test(m.text)) {
conn.reply(m.chat, `*Mapa Eligido NexTerra ☃️*`, m, rcanal, )
}

if (/^.menuff$/i.test(m.text)) {
conn.reply(m.chat, `★ 𝙈𝙀𝙉𝙐 𝘿𝙀 𝙁𝙍𝙀𝙀 𝙁𝙄𝙍𝙀 ★`, m, rcanal, )
}
return !0;
};
export default handler;