import fetch from 'node-fetch';
import { Buffer } from 'buffer';

const getChat = (context, fields) => fields.chat;
const toMegabytes = (bytes) => parseInt(bytes) / (1024 * 1024);
const isLargeFile = (size) => size > 70;
const isPasavid = (command) => command === 'pasavid';

const handleCommand = async (_context, { conn, text, usedPrefix, command }) => {
 if (!text) {
        let promptMessage = isPasavid(command)
            ? `${usedPrefix} Dices que te Vas`
            : `${usedPrefix} Amorfoda`;

        return conn.sendMessage(getChat(_context, { chat: _context.chat }), {
            text: `🍁 *Por favor ingresa una búsqueda.*\n\n*Ejemplo:* ${usedPrefix}${command} ${promptMessage}`,
        });
    }

    try {
         await conn.sendMessage(_context.chat, {
            text: `🎥 Descargando video...\n\n⏳ *Por favor, espera.*`,
        });

        const apiUrl = `https://api.vreden.my.id/api/ytplaymp4?query=${encodeURIComponent(text)}`;
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (!data || data.status !== 200 || !data.result || !data.result.download) {
            throw new Error('La API no devolvió datos válidos.');
        }

        const {
            result: {
                metadata: { title, author, timestamp, image, views, url },
                download: { url: downloadUrl },
            },
        } = data;

        if (!downloadUrl) {
            throw new Error('La URL de descarga no está disponible.');
        }

        const cleanDownloadUrl = downloadUrl.replace(/\s+/g, '%20');

        const headResponse = await fetch(cleanDownloadUrl, { method: 'HEAD' });
        const fileSize = parseInt(headResponse.headers.get('content-length') || 0);
        const sizeInMB = toMegabytes(fileSize);

        await conn.sendMessage(_context.chat, {
            image: { url: image },
            caption:
                `🎥 *Título:* ${title}\n` +
                `👤 *Autor:* ${author.name}\n` +
                `⏳ *Duración:* ${timestamp}\n` +
                `📥 *Tamaño:* ${sizeInMB.toFixed(2)} MB\n\n` +
                `🔗 *Enlace:* ${url}\n\n` +
                `🎬 *Enviando Video.*`,
        });

        if (isPasavid(command)) {
            await conn.sendMessage(_context.chat, {
                video: { url: cleanDownloadUrl },
                mimetype: 'video/mp4',
                fileName: `${title}.mp4`,
                caption: `🎬 *Video Reproducible:*`,
                quoted: _context,
            });
        } else if (isLargeFile(sizeInMB)) {
            await conn.sendMessage(_context.chat, {
                document: { url: cleanDownloadUrl },
                mimetype: 'video/mp4',
                fileName: `${title}.mp4`,
                caption: `📄 *Video en Formato Documento:*`,
                quoted: _context,
            });
        } else {
            await conn.sendMessage(_context.chat, {
                video: { url: cleanDownloadUrl },
                mimetype: 'video/mp4',
                fileName: `${title}.mp4`,
                caption: `🎬 *Video Reproducible:*`,
                quoted: _context,
            });
        }
    } catch (error) {
        console.error('Error al descargar el video:', error);
        await conn.sendMessage(_context.chat, {
            text: `⚠️ *Ocurrió un error al intentar procesar tu solicitud:*\n\n${error.message || 'Error desconocido'}`,
        });
    }
};

handleCommand.command = /^vid|play2$/i;

export default handleCommand;

