if (i < 0) return console.log(await creloadHandler(true).catch(console.error))
      delete global.conns[i]
      global.conns.splice(i, 1)

          if (code !== DisconnectReason.connectionClosed) {
          parent.sendMessage(m.chat, { text: "Conexión perdida.." }, { quoted: m })
        } else {
        }
      }

    if (global.db.data == null) loadDatabase()

    if (connection == 'open') {
    conn.isInit = true
    global.conns.push(conn)
    await parent.reply(m.chat, args[0] ? 'Conectado con exito' : '*\`[ Conectado Exitosamente 🤍 ]\`*\n\n> _Se intentara reconectar en caso de desconexion de sesion_\n> _Si quieres eliminr el subbot borra la sesion en dispositivos vinculados_\n> _El número del bot puede cambiar, guarda este enlace :_\n\nhttps://whatsapp.com/channel/0029VaJxgcB0bIdvuOwKTM2Y', m)
    await sleep(5000)
    if (args[0]) return

                await parent.reply(conn.user.jid, `La siguiente vez que se conecte envía el siguiente mensaje para iniciar sesión sin utilizar otro código `, m, rcanal)

                await parent.sendMessage(conn.user.jid, {text : usedPrefix + command + " " + Buffer.from(fs.readFileSync("./serbot/" + authFolderB + "/creds.json"), "utf-8").toString("base64")}, { quoted: m })
          }

  }

  setInterval(async () => {
    if (!conn.user) {
      try { conn.ws.close() } catch { }
      conn.ev.removeAllListeners()
      let i = global.conns.indexOf(conn)
      if (i < 0) return
      delete global.conns[i]
      global.conns.splice(i, 1)
    }}, 60000)

let handler = await import('../handler.js')
let creloadHandler = async function (restatConn) {
try {
const Handler = await import(`../handler.js?update=${Date.now()}`).catch(console.error)
if (Object.keys(Handler || {}).length) handler = Handler
} catch (e) {
console.error(e)
}
if (restatConn) {
try { conn.ws.close() } catch { }
conn.ev.removeAllListeners()
conn = makeWASocket(connectionOptions)
isInit = true
}

if (!isInit) {
conn.ev.off('messages.upsert', conn.handler)
conn.ev.off('connection.update', conn.connectionUpdate)
conn.ev.off('creds.update', conn.credsUpdate)
}

conn.handler = handler.handler.bind(conn)
conn.connectionUpdate = connectionUpdate.bind(conn)
conn.credsUpdate = saveCreds.bind(conn, true)

conn.ev.on('messages.upsert', conn.handler)
conn.ev.on('connection.update', conn.connectionUpdate)
conn.ev.on('creds.update', conn.credsUpdate)
isInit = false
return true
}
creloadHandler(false)
}
serbot()

}
handler.help = ['code']
handler.tags = ['serbot']
handler.command = ['code', 'serbotcode']
handler.rowner = false

export default handler

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
    }
