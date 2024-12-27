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
import NodeCache from 'node-cache'
import fs from "fs"
import { fileURLToPath } from 'url'
import path from 'path'

// Inicializar arreglo de conexiones si no existe
if (!global.conns) global.conns = [];

// Función para retrasar la ejecución
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

// Función para verificar número válido
const isValidNumber = (number) => {
    const cleaned = number.replace(/[^0-9]/g, '');
    return cleaned.length >= 10 && cleaned.length <= 15;
};

let handler = async (m, { conn: _conn, args, usedPrefix, command, isOwner }) => {
    try {
        // Verificar que sea el bot principal
        let parent = args[0] && args[0] == 'plz' ? _conn : await global.conn;
        if (!((args[0] && args[0] == 'plz') || (await global.conn).user.jid == _conn.user.jid)) {
            return m.reply(`*⚠️ ESTE COMANDO SOLO PUEDE SER USADO EN EL BOT PRINCIPAL*\n\nwa.me/${global.conn.user.jid.split`@`[0]}?text=${usedPrefix}code`);
        }

        // Verificar número del solicitante
        const userNumber = m.sender.split('@')[0];
        if (!isValidNumber(userNumber)) {
            return m.reply('*⚠️ NÚMERO INVÁLIDO*\n\nPor favor, verifica que tu número esté en formato internacional.');
        }

        // Enviar mensaje de espera
        await m.reply('*⏳ GENERANDO CÓDIGO...*\nPor favor espere un momento.');

        // Sistema de generación de código con reintentos
        const generateCode = async (retries = 3) => {
            for (let i = 0; i < retries; i++) {
                try {
                    const authFolder = `./Sesion Subbots/${userNumber}`;
                    if (!fs.existsSync(authFolder)) {
                        fs.mkdirSync(authFolder, { recursive: true });
                    }

                    // Configuración de estado
                    const { state, saveState, saveCreds } = await useMultiFileAuthState(authFolder);
                    const msgRetryCounterCache = new NodeCache();
                    const { version } = await fetchLatestBaileysVersion();

                    // Opciones de conexión mejoradas
                    const connectionOptions = {
                        logger: pino({ level: 'silent' }),
                        printQRInTerminal: false,
                        browser: ['Chrome (Linux)', 'Chrome', '108.0.5359.125'],
                        auth: {
                            creds: state.creds,
                            keys: makeCacheableSignalKeyStore(state.keys, pino({ level: 'fatal' }).child({ level: 'fatal' })),
                        },
                        markOnlineOnConnect: false,
                        generateHighQualityLinkPreview: true,
                        getMessage: async (key) => {
                            let jid = jidNormalizedUser(key.remoteJid);
                            let msg = await store.loadMessage(jid, key.id);
                            return msg?.message || '';
                        },
                        msgRetryCounterCache,
                        defaultQueryTimeoutMs: 60000,
                        version,
                        connectTimeoutMs: 60000,
                        receivedPendingNotifications: true
                    };

                    // Crear conexión
                    let conn = makeWASocket(connectionOptions);
                    
                    // Esperar a que la conexión esté lista
                    await delay(3000);

                    // Solicitar código
                    if (!conn.authState.creds.registered) {
                        const cleanNumber = userNumber.replace(/[^0-9]/g, '');
                        const codeRequest = await conn.requestPairingCode(cleanNumber);
                        
                        if (!codeRequest) {
                            throw new Error('No se pudo generar el código');
                        }

                        const formattedCode = codeRequest.match(/.{1,4}/g)?.join('-') || codeRequest;
                        
                        // Mensaje con instrucciones detalladas
                        const instructions = `*╭━━━[ CÓDIGO DE VINCULACIÓN ]━━━━⬣*
*┃*
*┃* 🔐 *CÓDIGO:* ${formattedCode}
*┃*
*┃* 📱 *PASOS PARA VINCULAR:*
*┃*
*┃* 1️⃣ Abre WhatsApp
*┃* 2️⃣ Toca los 3 puntos ⋮
*┃* 3️⃣ Selecciona *Dispositivos Vinculados*
*┃* 4️⃣ Toca en *Vincular Dispositivo*
*┃* 5️⃣ Ingresa el código
*┃*
*┃* ⏰ *TIEMPO:* 45 segundos
*┃* ⚠️ *NO COMPARTAS ESTE CÓDIGO*
*╰━━━━━━━━━━━━━━━━━━━⬣*`;

                        await parent.sendMessage(m.chat, { text: instructions }, { quoted: m });
                        
                        // Configurar manejadores de eventos
                        conn.ev.on('connection.update', async (update) => {
                            const { connection, lastDisconnect } = update;
                            
                            if (connection === 'close') {
                                const shouldReconnect = (lastDisconnect?.error as Boom)?.output?.statusCode !== DisconnectReason.loggedOut;
                                
                                if (shouldReconnect) {
                                    let idx = global.conns.indexOf(conn);
                                    if (idx !== -1) global.conns.splice(idx, 1);
                                }
                            } else if (connection === 'open') {
                                global.conns.push(conn);
                                await parent.sendMessage(m.chat, {
                                    text: '*✅ CONEXIÓN EXITOSA*\n\n_El bot se reconectará automáticamente._\n_Para desvincular, elimina la sesión en WhatsApp._'
                                });
                            }
                        });

                        conn.ev.on('creds.update', saveCreds);
                        
                        return true;
                    }
                } catch (e) {
                    console.error(`Intento ${i + 1} fallido:`, e);
                    if (i === retries - 1) throw e;
                    await delay(2000);
                }
            }
            throw new Error('No se pudo generar el código después de varios intentos');
        };

        await generateCode();

    } catch (error) {
        console.error('Error en handler:', error);
        await m.reply(`*⚠️ OCURRIÓ UN ERROR*\n\n${error.message}\n\nIntente nuevamente en unos minutos.`);
    }
};

handler.help = ['code'];
handler.tags = ['jadibot'];
handler.command = ['code', 'serbot', 'jadibot'];
handler.private = true;
handler.limit = false;

export default handler;