import fetch from "node-fetch";

// Función para decodificar Base64
const decodeBase64 = (encoded) => Buffer.from(encoded, "base64").toString("utf-8");

// Función para manejar solicitudes con reintentos
const fetchWithRetries = async (url, maxRetries = 2) => {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(url);
      const data = await response.json();
      if (data?.status === 200 && data?.data?.download?.url) return data.data;
    } catch (error) {
      console.error(`Error en intento ${attempt + 1}:`, error.message);
    }
  }
  throw new Error("No se pudo obtener una respuesta válida después de varios intentos.");
};

// Handler principal para ytmp4doc
let handler = async (m, { conn, text, usedPrefix }) => {
  if (!text || !/^https:\/\/(www\.)?youtube\.com\/watch\?v=/.test(text)) {
    return conn.sendMessage(m.chat, {
      text: `⚠️ *¡Error! Enlace de YouTube inválido.*\n\n🔗 *Por favor, ingresa un enlace válido de YouTube para descargar el video usando el comando de Barboza Bot AI.*\n\n💡 *Ejemplo:* ${usedPrefix}ytmp4doc https://www.youtube.com/watch?v=dQw4w9WgXcQ`,
    });
  }

  try {
    // Mensaje inicial de procesamiento con diseño llamativo
    const initialMessage = `
╭━━━━━━━━━━━━━━━🌐📡━━━━━━━━━━━━━━━╮
   🔍 *Procesando tu solicitud...*  
   ⏳ *Por favor, espera unos momentos.*  
   📥 *Descargando el video usando Barboza Bot AI...*  
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯
    `;
    const key = await conn.sendMessage(m.chat, { text: initialMessage });

    // URL de la API en Base64
    const encodedApiUrl = "aHR0cHM6Ly9yZXN0YXBpLmFwaWJvdHdhLmJpei5pZC9hcGkveXRtcDQ=";
    const apiUrl = `${decodeBase64(encodedApiUrl)}?url=${encodeURIComponent(text)}`;
    const apiData = await fetchWithRetries(apiUrl);

    // Datos del video
    const { metadata, download } = apiData;
    const { title, duration, description } = metadata;
    const { url: downloadUrl, filename } = download;

    // Calcular el tamaño del archivo
    const fileResponse = await fetch(downloadUrl, { method: "HEAD" });
    const fileSize = parseInt(fileResponse.headers.get("content-length") || 0);
    const fileSizeInMB = fileSize / (1024 * 1024);

    // Mensaje con información detallada del video
    const videoInfo = `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔵 **Barboza Bot AI - Video Encontrado:**
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎵 **Título:** ${title}
⏱️ **Duración:** ${duration.timestamp || "No disponible"}
📦 **Tamaño:** ${fileSizeInMB.toFixed(2)} MB
📝 **Descripción:**
${description || "Sin descripción disponible"}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📤 *Enviando el archivo en formato documento con Barboza Bot AI...*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    `;
    await conn.sendMessage(m.chat, { text: videoInfo, edit: key });

    // Enviar el archivo como documento (.mp4)
    await conn.sendMessage(
      m.chat,
      {
        document: { url: downloadUrl },
        mimetype: "video/mp4",
        fileName: filename || `${title}.mp4`,
        caption: `📂 *Video descargado en formato documento por Barboza Bot AI:*\n🎵 *Título:* ${title}\n📦 *Tamaño:* ${fileSizeInMB.toFixed(2)} MB`,
      },
      { quoted: m }
    );
  } catch (error) {
    console.error("Error al procesar la solicitud:", error);
    await conn.sendMessage(m.chat, {
      text: `❌ *Error al procesar tu solicitud con Barboza Bot AI:* ${error.message || "Error desconocido"}\nPor favor intenta de nuevo más tarde.`,
    });
  }
};

handler.command = /^playdoc$/i; // Solo responde al comando .playdoc
export default handler;