import ws from 'ws';

async function handler(m, { conn: stars, usedPrefix }) {
  let uniqueUsers = new Map();

  global.conns.forEach((conn) => {
    if (conn && conn.user && conn.ws && conn.ws.socket && conn.ws.socket.readyState !== ws.CLOSED) {
      uniqueUsers.set(conn.user.jid, conn);
    }
  });

  let users = [...uniqueUsers.values()];

  let message = users
    .map((v, index) => {
      let jid = v.user?.jid || '-';
      let name = v.user?.name || '-';
      return `*${index + 1}.-* @${jid.replace(/[^0-9]/g, '')}\n*Link:* https://wa.me/${jid.replace(/[^0-9]/g, '')}\n*Nombre:* ${name}`;
    })
    .join('\n\n');

  let replyMessage = message.length === 0 ? '' : message;
  let totalUsers = users.length;
  let responseMessage = `*Total de Bots* : ${totalUsers || '0'}\n\n${replyMessage.trim()}`.trim();

  await stars.sendMessage(
    m.chat,
    { text: responseMessage, mentions: stars.parseMention(responseMessage) },
    { quoted: m }
  );
}

handler.command = ['listjadibot', 'bots'];
handler.help = ['bots'];
handler.tags = ['serbot'];
export default handler;
