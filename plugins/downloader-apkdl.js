let handler = async (m, { conn, args, usedPrefix, command, isOwner }) => {
if (!args[0]) throw `\`\`\`[ 🌟 ] Ingresa el nombre de la aplicación que quieres descargar. Ejemplo:\n${usedPrefix + command} Clash Royale\`\`\``
let res = await fetch(`https://api.dorratz.com/v2/apk-dl?text=${args[0]}`);
let result = await res.json();
let { name, size, lastUpdate, icon } = result;
let URL = result.dllink
let packe = result.package
let texto = ` \`\`\`
   ❯───「 𝗔𝗣𝗞 𝗗𝗢𝗪𝗡𝗟𝗢𝗔𝗗 」───❮
    ✦ 𝐍𝐨𝐦𝐛𝐫𝐞 : ⇢ ${name} 📛
    ✦ 𝐓𝐚𝐦𝐚𝐧̃𝐨 : ⇢ ${size} ⚖️
    ✦ 𝐏𝐚𝐜𝐤𝐚𝐠𝐞 : ⇢ ${packe} 📦
    ✦ 𝐀𝐜𝐭𝐮𝐚𝐥𝐢𝐳𝐚𝐝𝐨 : ⇢ ${lastUpdate} 🗓️
    ✦ 𝐂𝐫𝐞𝐚𝐝𝐨𝐫 :⇢  WillZek
\`\`\`
> https://whatsapp.com/channel/0029VakfOZfHFxP7rNrUQk2d

## Su aplicación se enviará en un momento . . .

${botname}              
`
await conn.sendFile(m.chat, icon, name + '.jpg', texto, m)

await conn.sendMessage(m.chat, { document: { url: URL }, mimetype: 'application/vnd.android.package-archive', fileName: name + '.apk', caption: ''}, { quoted: m });
}
handler.command = ['apk', 'apkdl', 'modapk']
handler.help = ['apkdl']
handler.tags = ['downloader']
export default handle