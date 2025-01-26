
import fetch from 'node-fetch';

let handler = async (m, { text, usedPrefix, command }) => {
    if (!text) throw `*[❗] EPAAA TE FALTO INGRESAR EL NOMBRE DE UN PAIS, EJEMPLO ${usedPrefix + command} Paraguay*`;

    let res = await fetch(global.API('https://covid19.mathdro.id', '/api/countries/' + text));
    if (!res.ok) throw await res.text();

    let json = await res.json();
    if (!json.confirmed) throw 'País no encontrado o sin datos disponibles.';

    m.reply(`
🌏 País : ${text}
✅ Confirmados : ${json.confirmed.value}
📉 Curados : ${json.recovered ? json.recovered.value : 'No disponible'}
☠️ Muertes : ${json.deaths ? json.deaths.value : 'No disponible'}
💌 Info Actualizada : ${new Date(json.lastUpdate).toLocaleString()}
`.trim());
}

handler.help = ['covid'].map(v => v + ' <país>');
handler.tags = ['info'];
handler.command = /^(corona|covid|covid19)$/i;

export default handler;