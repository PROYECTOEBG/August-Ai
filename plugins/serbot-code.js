import { 
    useMultiFileAuthState, 
    DisconnectReason, 
    fetchLatestBaileysVersion, 
    MessageRetryMap, 
    makeCacheableSignalKeyStore, 
    jidNormalizedUser 
} from '@whiskeysockets/baileys';

import moment from 'moment-timezone';
import NodeCache from 'node-cache';
import readline from 'readline';
import qrcode from 'qrcode';
import crypto from 'crypto';
import fs from 'fs';
import pino from 'pino';
import * as ws from 'ws';
const { CONNECTING } = ws;
import { Boom } from '@hapi/boom';
import { makeWASocket } from '../lib/simple.js';

if (!Array.isArray(global.conns)) global.conns = []; // Asegura que `global.conns` sea un array

let handler = async (m, { conn: _conn, args, usedPrefix, command, isOwner }) => {
    // Valida si el comando puede ser ejecutado
    let parent = args[0] && args[0] === 'plz' ? _conn : await global.conn;
    if (!(args[0] === 'plz' || (await global.conn).user.jid === _conn.user.jid)) {
        return m.reply(
            `Este comando solo puede ser usado en el bot principal. Link: wa.me/${global.conn.user.jid.split`@`[0]}?text=${usedPrefix}code`
        );
    }

    let isProcessing = false;

    async function serbot() {
        if (isProcessing) {
            return parent.reply(m.chat, 'Por favor espera, ya se está procesando una solicitud.', m);
        }

        isProcessing = true;

        try {
            let authFolderB = m.sender.split('@')[0];
            let sessionPath = `./Sesion Subbots/${authFolderB}`;

            // Crea la carpeta de sesión si no existe
            if (!fs.existsSync(sessionPath)) {
                fs.mkdirSync(sessionPath, { recursive: true });
            }

            // Escribe credenciales si están en los argumentos
            if (args[0]) {
                fs.writeFileSync(
                    `${sessionPath}/creds.json`,
                    JSON.stringify(JSON.parse(Buffer.from(args[0], 'base64').toString('utf-8')), null, '\t')
                );
            }

            const { state, saveState, saveCreds } = await useMultiFileAuthState(sessionPath);
            const msgRetryCounterMap = (MessageRetryMap) => {};
            const msgRetryCounterCache = new NodeCache();
            const { version } = await fetchLatestBaileysVersion();
            const phoneNumber = m.sender.split('@')[0];

            const connectionOptions = {
                logger: pino({ level: 'silent' }),
                auth: {
                    creds: state.creds,
                    keys: makeCacheableSignalKeyStore(state.keys, pino({ level: 'fatal' })),
                },
                markOnlineOnConnect: true,
                version,
                msgRetryCounterCache,
                msgRetryCounterMap,
                getMessage: async (key) => {
                    let jid = jidNormalizedUser(key.remoteJid);
                    let msg = await store.loadMessage(jid, key.id);
                    return msg?.message || '';
                },
            };

            let conn = makeWASocket(connectionOptions);

            // Generación de código de vinculación si es necesario
            if (phoneNumber && !conn.authState.creds.registered) {
                try {
                    let codeBot = await conn.requestPairingCode(phoneNumber);
                    codeBot = codeBot?.match(/.{1,4}/g)?.join('-') || codeBot;
                    let instructions = `*\`「🔱」 Serbot - Code 「🔱」\`*\n\n*\`[ Pasos : ]\`*\n\`1 ❥\` _Click en los 3 puntos_\n\`2 ❥\` _Toca en dispositivos vinculados_\n\`3 ❥\` _Selecciona Vincular con código_\n\`4 ❥\` _Escribe el código_\n\n> *Nota:* Este código solo funciona con quien lo solicitó.`;

                    await parent.reply(m.chat, instructions, m);
                    await parent.reply(m.chat, codeBot, m);
                } catch (error) {
                    console.error('Error al generar el código:', error);
                    await parent.reply(m.chat, 'Hubo un error al generar el código. Intenta nuevamente.', m);
                }
            }

            // Manejo de eventos de conexión
            conn.ev.on('connection.update', async (update) => {
                const { connection, lastDisconnect } = update;

                if (connection === 'open') {
                    global.conns.push(conn);
                    await parent.reply(m.chat, 'Conectado exitosamente. Se intentará reconectar si la sesión se desconecta.', m);
                } else if (connection === 'close') {
                    const reason = lastDisconnect?.error?.output?.statusCode;
                    if (reason !== DisconnectReason.loggedOut) {
                        console.log('Intentando reconectar...');
                    } else {
                        console.log('Sesión cerrada.');
                    }
                }
            });

        } catch (error) {
            console.error('Error en serbot:', error);
            parent.reply(m.chat, 'Ocurrió un error. Por favor, revisa los logs para más detalles.', m);
        } finally {
            isProcessing = false;
        }
    }

    await serbot();
};

handler.help = ['code'];
handler.tags = ['serbot'];
handler.command = ['code', 'serbotcode'];
handler.rowner = false;

export default handler;

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}