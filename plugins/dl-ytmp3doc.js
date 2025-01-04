```javascript
const { Client, LocalAuth } = require('whatsapp-web.js');
const ytdl = require('ytdl-core');
const fs = require('fs');

const client = new Client({
    authStrategy: new LocalAuth()
});

client.on('qr', (qr) => {
    console.log('Escanea el código QR para iniciar sesión:', qr);
});

client.on('ready', () => {
    console.log('¡Bot de WhatsApp listo!');
});

client.on('message', async (message) => {
    if (message.body.startsWith('.ytmp3doc')) {
        const args = message.body.split(' ').slice(1);
        const url = args[0]; // URL del video de YouTube

        if (!ytdl.validateURL(url)) {
            return message.reply('¡URL de YouTube no válida! Asegúrate de que sea correcta.');
        }

        const info = await ytdl.getInfo(url);
        const title = info.videoDetails.title.replace(/[<>:"/\\|?*]/g, ''); // Limpiar el título para el nombre del archivo
        const filePath = `${title}.mp3`;

        // Descargar el audio
        ytdl(url, { filter: 'audioonly' })
            .pipe(fs.createWriteStream(filePath))
            .on('finish', async () => {
                await message.reply('¡Descarga completada! Aquí tienes tu MP3:', { 
                    caption: title, 
                    media: fs.createReadStream(filePath) 
                });
                fs.unlinkSync(filePath); // Eliminar el archivo después de enviar
            });
    }
});

client.initialize();
```