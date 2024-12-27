import { 
  useMultiFileAuthState,
  DisconnectReason,
  fetchLatestBaileysVersion,
  MessageRetryMap,
  makeCacheableSignalKeyStore,
  jidNormalizedUser
} from '@whiskeysockets/baileys'
import { makeWASocket } from '../lib/simple.js'
import { Boom } from '@hapi/boom'
import pino from 'pino'
import * as ws from 'ws'
import NodeCache from 'node-cache'
import moment from 'moment-timezone'
import readline from 'readline'
import qrcode from "qrcode"
import fs from "fs"
import { fileURLToPath } from 'url'
import path from 'path'

// Inicializar arreglo de conexiones si no existe
if (!global.conns) global.conns = [];

let handler = async (m, { conn: _conn, args, usedPrefix, command, isOwner }) => {
  // Verificar que sea el bot principal
  let parent = args[0] && args[0] == 'plz' ? _conn : await global.conn;
  if (!((args[0] && args[0] == 'plz') || (await global.conn).user.jid == _conn.user.jid)) {
    return m.reply(`*⚠️ Este comando solo puede ser usado en el bot principal*\nwa.me/${global.conn.user.jid.split`@`[0]}?text=${usedPrefix}code`);
  }

  async function serbot() {
    try {
      // Crear directorio para la sesión
      const authFolder = `./Sesion Subbots/${m.sender.split('@')[0]}`;
      if (!fs.existsSync(authFolder)) {
        fs.mkdirSync(authFolder, { recursive: true });
      }

      // Guardar credenciales si se proporcionan en args[0]
      if (args[0]) {
        try {
          const decodedCreds = Buffer.from(args[0], "base64").toString("utf-8");
          fs.writeFileSync(
            path.join(authFolder, "creds.json"), 
            JSON.stringify(JSON.parse(decodedCreds), null, 2)
          );
        } catch (e) {
          console.error("Error al guardar credenciales:", e);
          return m.reply("*⚠️ Error al procesar las credenciales proporcionadas*");
        }
      }

      // Configurar estado y autenticación
      const { state, saveState, saveCreds } = await useMultiFileAuthState(authFolder);
      const msgRetryCounterCache = new NodeCache();
      const { version } = await fetchLatestBaileysVersion();

      // Opciones de conexión
      const connectionOptions = {
        logger: pino({ level: 'silent' }),
        printQRInTerminal: false,
        browser: ["Ubuntu", "Chrome", "20.0.04"],
        auth: {
          creds: state.creds,
          keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "fatal" }).child({ level: "fatal" })),
        },
        markOnlineOnConnect: true,
        generateHighQualityLinkPreview: true,
        getMessage: async (key) => {
          let jid = jidNormalizedUser(key.remoteJid);
          let msg = await store.loadMessage(jid, key.id);
          return msg?.message || "";
        },
        msgRetryCounterCache,
        defaultQueryTimeoutMs: undefined,
        version
      };

      // Crear conexión
      let conn = makeWASocket(connectionOptions);

      // Solicitar código de vinculación
      if (!conn.authState.creds.registered) {
        try {
          let phoneNumber = m.sender.split('@')[0];
          let cleanNumber = phoneNumber.replace(/[^0-9]/g, '');
          
          setTimeout(async () => {
            try {
              const codeBot = await conn.requestPairingCode(cleanNumber);
              const formattedCode = codeBot?.match(/.{1,4}/g)?.join("-") || codeBot;
              
              const instructions = `*╭━━━[ CÓDIGO DE VINCULACIÓN ]━━━━⬣*
*┃*
*┃* 📲 *PASOS PARA VINCULAR:*
*┃*
*┃* \`1\` Abre WhatsApp
*┃* \`2\` Toca los 3 puntos ⋮
*┃* \`3\` Selecciona Dispositivos Vinculados
*┃* \`4\` Toca Vincular un Dispositivo
*┃* \`5\` Ingresa el siguiente código:
*┃*
*┃* \`\`\`${formattedCode}\`\`\`
*┃*
*┃* ⚠️ *CÓDIGO VÁLIDO POR 45 SEGUNDOS*
*┃* 
*╰━━━━━━━━━━━━━━━━━━━━━⬣*`;

              await parent.sendMessage(m.chat, { text: instructions }, { quoted: m });
            } catch (e) {
              console.error("Error al generar código:", e);
              return m.reply("*⚠️ Error al generar el código de vinculación*");
            }
          }, 3000);
        } catch (e) {
          console.error("Error en proceso de vinculación:", e);
          return m.reply("*⚠️ Error en el proceso de vinculación*");
        }
      }

      // Manejar actualizaciones de conexión
      async function connectionUpdate(update) {
        const { connection, lastDisconnect, isNewLogin } = update;
        
        if (isNewLogin) conn.isInit = true;
        
        const shouldReconnect = (lastDisconnect?.error as Boom)?.output?.statusCode !== DisconnectReason.loggedOut;
        
        if (connection === 'close' && shouldReconnect) {
          let idx = global.conns.indexOf(conn);
          if (idx !== -1) {
            global.conns.splice(idx, 1);
            await parent.sendMessage(m.chat, { text: "*⚠️ Conexión perdida, reintentando...*" }, { quoted: m });
          }
        }
        
        if (connection === 'open') {
          global.conns.push(conn);
          await parent.sendMessage(m.chat, { 
            text: "*✅ CONEXIÓN EXITOSA*\n\n" +
                  "• El bot se reconectará automáticamente\n" +
                  "• Para desvincularlo, elimine la sesión desde WhatsApp\n" +
                  "• Puede guardar su código de acceso para futuras conexiones"
          }, { quoted: m });
          
          // Guardar código de acceso
          if (!args[0]) {
            const credentialData = fs.readFileSync(path.join(authFolder, "creds.json"), "utf-8");
            const base64Creds = Buffer.from(credentialData).toString("base64");
            await parent.sendMessage(conn.user.jid, { 
              text: `*🔐 GUARDA ESTE CÓDIGO PARA RECONECTAR:*\n\n${usedPrefix}${command} ${base64Creds}`
            });
          }
        }
      }

      // Configurar handlers
      conn.connectionUpdate = connectionUpdate.bind(conn);
      conn.credsUpdate = saveCreds.bind(conn);
      
      // Registrar eventos
      conn.ev.on('connection.update', conn.connectionUpdate);
      conn.ev.on('creds.update', conn.credsUpdate);
      
      // Limpiar conexiones inactivas
      setInterval(() => {
        let i = global.conns.indexOf(conn);
        if (conn.user == null && i !== -1) {
          global.conns.splice(i, 1);
          conn.ev.removeAllListeners();
          conn.ws.close();
        }
      }, 60000);

    } catch (e) {
      console.error("Error general en serbot:", e);
      return m.reply("*⚠️ Ocurrió un error al iniciar el bot*");
    }
  }

  await serbot();
};

handler.help = ['code'];
handler.tags = ['jadibot'];
handler.command = ['serbot', 'jadibot', 'code'];
handler.private = true;

export default handler;