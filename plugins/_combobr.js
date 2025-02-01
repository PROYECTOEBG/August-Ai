
var handler = async (m, { conn, command, args, usedPrefix, DevMode }) => {
    let contactos = [
        { name: "k", number: "k@s.whatsapp.net" },
        { name: "luna", number: "luna@s.whatsapp.net" },
        { name: "nairi", number: "nairi@s.whatsapp.net" },
        { name: "Kelly", number: "kelly@s.whatsapp.net" }
    ];

    for (let contacto of contactos) {
        let fkontak = { 
            "key": { 
                "participants": contacto.number, 
                "remoteJid": "status@broadcast", 
                "fromMe": false, 
                "id": "Halo" 
            }, 
            "message": { 
                "contactMessage": { 
                    "vcard": `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:${contacto.name}\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD` 
                } 
            }, 
            "participant": contacto.number 
        };

        let pp = combobr.getRandom();
        const cat = 
        `» 𝘾𝙊𝙈𝘽𝙊 𝘿𝙀 𝙃𝘼𝘽𝙄𝙇𝙄𝘿𝘼𝘿𝙀𝙎
        𝘽𝙍-𝘾𝙇𝘼𝙎𝙄𝙁𝙄𝘾𝘼𝙏𝙊𝙍𝙄𝘼 🌍`;

        await conn.sendFile(m.chat, pp, 'img5.jpg', cat, fkontak);
    }
}

handler.help = ['owner', 'creator'];
handler.tags = ['info'];
handler.command = /^(combobr)$/i;

export default handler;