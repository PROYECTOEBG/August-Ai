import fetch from "node-fetch";

let handler = async (m, { conn, text, usedPrefix, command }) => {
  // Comprobamos si el texto es un enlace de YouTube válido
  const youtubeRegex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^/]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  if (!youtubeRegex.test(text)) {
    return conn.sendMessage(m.chat, {
      text: `❗ *Por favor ingresa un enlace de YouTube válido.*\n\n*Ejemplo para .ytmp3:* ${usedPrefix}ytmp3 https://youtube.com/watch?v=0QBzssNFRQE\n\n🤖 *Generado por Barbosa Bot IA*`,
    });
  }

  try {
    // Enviar el mensaje inicial de carga
    const { key } = await conn.sendMessage(m.chat, { 
      text: `⌛ *Barbosa Bot IA* está procesando tu solicitud...`
    });

    // Simular progreso con delay
    const delay = time => new Promise(res => setTimeout(res, time));
    const stages = ['⬢', '⬣', '⬠', '⬡'];
    let index = 0;

    for (let i = 1; i <= 10; i++) { 
      const progress = `${stages[index]} ${stages[(index + 1) % 4]} ${stages[(index + 2) % 4]} ${stages[(index + 3) % 4]}`;
      const percentage = i * 10; 
      index = (index + 1) % 4; 
      await delay(500); 
      await conn.sendMessage(m.chat, { 
        text: `⌛ Cargando...\n${progress}\n${percentage}%`, 
        edit: key 
      });
    }

    // URL de la API codificada en Base64
    const encodedApiUrl = "aHR0cHM6Ly9hcGkudnJlZGVuLm15LmlkL2FwaS95dG1wMw=="; 
    const apiUrl = `${Buffer.from(encodedApiUrl, "base64").toString("utf-8")}?url=${encodeURIComponent(text)}`;

    // Llamar a la API y parsear los datos
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (!data || data.status !== 200 || !data.result || !data.result.download) {
      throw new Error("La API no devolvió datos válidos.");
    }

    const {
      result: {
        metadata: { title, image },
        download: { url: rawDownloadUrl },
      },
    } = data;

    const downloadUrl = rawDownloadUrl.replace(/\s+/g, "%20");

    // Enviar imagen y título del archivo
    await conn.sendMessage(m.chat, {
      image: { url: image },
      caption: `🎶 *Barbosa Bot IA encontró este archivo:*\n\n📌 *Título:* ${title}\n\n🤖 *Generado por Barbosa Bot IA*`,
    });

    // Lógica para enviar el archivo como documento .mp3
    if (command === "ytmp3") {
      await conn.sendMessage(
        m.chat,
        {
          document: { url: downloadUrl },  
          mimetype: "audio/mpeg",          
          fileName: `${title}.mp3`,        
          caption: `🎶 *Archivo procesado por Barbosa Bot IA*\n\n📌 *Título:* ${title}`,  
        },
        { quoted: m }
      );
    }

    // Enviar mensaje final de éxito
    await delay(500); 
    await conn.sendMessage(m.chat, { 
      text: `✅ *Barbosa Bot IA completó tu descarga con éxito.*`, 
      edit: key 
    });
  } catch (error) {
    console.error("Error al descargar la música:", error);
    await conn.sendMessage(m.chat, {
      text: `❌ *Ocurrió un error al procesar tu solicitud.*\n\n🤖 *Barbosa Bot IA está trabajando para mejorar.*\n\n*Error:* ${error.message || "Desconocido"}`,
    });
  }
};

handler.command = /^ytmp3$/i;

export default handler;