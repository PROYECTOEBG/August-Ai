let handler = async (m, { conn, participants, groupMetadata }) => {
    try {
        const groupAdmins = participants.filter(p => p.admin);
        const listAdmin = groupAdmins.map((v, i) => `${i + 1}. @${v.id.split('@')[0]}`).join('\n');
        const owner = groupMetadata.owner || groupAdmins.find(p => p.admin === 'superadmin')?.id || m.chat.split`-`[0] + '@s.whatsapp.net';

        let text = `
╭──────>⋆☽⋆ ⋆☾⋆<──────╮
   ㅤ   GUERRA DE CLANES
                 ${groupMetadata.subject}
╰──────>⋆☽⋆ ⋆☾⋆<──────╯
╭──────────────╮
│ㅤ⏱ 𝐇𝐎𝐑𝐀𝐑𝐈𝐎 
│➥ 
│➥ 𝐉𝐔𝐆𝐀𝐃𝐎𝐑𝐄𝐒:
│
│     𝗘𝗦𝗖𝗨𝗔𝗗𝗥𝗔 ➹𝟏
│
│👑 ➤ 
│⚜️ ➤ 
│⚜️ ➤ 
│⚜️ ➤ 
│     
│    𝗘𝗦𝗖𝗨𝗔𝗗𝗥𝗔 ➹𝟐
│
│👑 ➤ 
│⚜️ ➤ 
│⚜️ ➤ 
│⚜️ ➤ 
│
│    𝗘𝗦𝗖𝗨𝗔𝗗𝗥𝗔 ➹𝟑
│
│👑 ➤ 
│⚜️ ➤ 
│⚜️ ➤ 
│⚜️ ➤ 
│
│    𝗘𝗦𝗖𝗨𝗔𝗗𝗥𝗔 ➹𝟒
│
│👑 ➤ 
│⚜️ ➤ 
│⚜️ ➤ 
│⚜️ ➤ 
│
│    𝗘𝗦𝗖𝗨𝗔𝗗𝗥𝗔 ➹𝟓
│
│👑 ➤ 
│⚜️ ➤ 
│⚜️ ➤ 
│⚜️ ➤ 
│
│    𝗘𝗦𝗖𝗨𝗔𝗗𝗥𝗔 ➹𝟔
│
│👑 ➤ 
│⚜️ ➤ 
│⚜️ ➤ 
│⚜️ ➤ 
│
│ㅤʚ 𝐒𝐔𝐏𝐋𝐄𝐍𝐓𝐄𝐒:
│⚜️ ➤ 
│⚜️ ➤
│⚜️ ➤ 
│⚜️ ➤ 
│⚜️ ➤ 
│⚜️ ➤ 
╰─────────────╯
`.trim();

        await conn.reply(m.chat, text, m, { mentions: [...groupAdmins.map(v => v.id), owner] });
    } catch (e) {
        console.error(e);
        await conn.reply(m.chat, 'Ocurrió un error al procesar el comando.', m);
    }
};

handler.help = ['guerra'];
handler.tags = ['freefire'];
handler.command = /^(guerra|guerradeclanes)$/i;
handler.group = true;

export default handler;