let handler = async (m, { conn, text, command }) => {
let id = text ? text : m.chat  
let pp = 'https://i.ibb.co/s9N9QhG/file.jpg'
await conn.sendMessage(m.chat, { video: { url: pp }, gifPlayback: true, caption: '*ADIOS, BOTBARBOZA SE DESPIDE!🌠👋*', mentions: [m.sender] }, { quoted: estilo })
await conn.groupLeave(id)}
handler.help = ['salir']
handler.tags = ['owner']
handler.command = /^(salir|out|leavegc|leave|salirdelgrupo)$/i
handler.group = true
handler.rowner = true

export default handler