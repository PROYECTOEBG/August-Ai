import fs from 'fs'

let timeout = 15000
let poin = 1000

let handler = async (m, { conn, usedPrefix }) => {
    conn.tekateki = conn.tekateki ? conn.tekateki : {}
    let id = m.chat
    if (id in conn.tekateki) {
        conn.reply(m.chat, 'Todavía hay un juego sin terminar!', conn.tekateki[id][0])
        throw false
    }

    // Lista extensa de países y capitales
    const capitals = [
        { pais: 'Afganistán', response: 'Kabul' },
        { pais: 'Albania', response: 'Tirana' },
        { pais: 'Alemania', response: 'Berlín' },
        { pais: 'Andorra', response: 'Andorra la Vieja' },
        { pais: 'Angola', response: 'Luanda' },
        { pais: 'Antigua y Barbuda', response: 'Saint John\'s' },
        { pais: 'Arabia Saudita', response: 'Riad' },
        { pais: 'Argelia', response: 'Argel' },
        { pais: 'Argentina', response: 'Buenos Aires' },
        { pais: 'Armenia', response: 'Ereván' },
        { pais: 'Australia', response: 'Camberra' },
        { pais: 'Austria', response: 'Viena' },
        { pais: 'Azerbaiyán', response: 'Bakú' },
        { pais: 'Bahamas', response: 'Nassau' },
        { pais: 'Bangladés', response: 'Daca' },
        { pais: 'Baréin', response: 'Manama' },
        { pais: 'Bélgica', response: 'Bruselas' },
        { pais: 'Belice', response: 'Belmopán' },
        { pais: 'Benín', response: 'Porto Novo' },
        { pais: 'Bielorrusia', response: 'Minsk' },
        { pais: 'Birmania (Myanmar)', response: 'Naypyidó' },
        { pais: 'Bolivia', response: 'Sucre' },
        { pais: 'Bosnia y Herzegovina', response: 'Sarajevo' },
        { pais: 'Botsuana', response: 'Gaborone' },
        { pais: 'Brasil', response: 'Brasilia' },
        { pais: 'Brunéi', response: 'Bandar Seri Begawan' },
        { pais: 'Bulgaria', response: 'Sofía' },
        { pais: 'Burkina Faso', response: 'Uagadugú' },
        { pais: 'Burundi', response: 'Bujumbura' },
        { pais: 'Bután', response: 'Timbu' },
        { pais: 'Cabo Verde', response: 'Praia' },
        { pais: 'Camboya', response: 'Phnom Penh' },
        { pais: 'Camerún', response: 'Yaundé' },
        { pais: 'Canadá', response: 'Ottawa' },
        { pais: 'Catar', response: 'Doha' },
        { pais: 'Chad', response: 'N\'Djamena' },
        { pais: 'Chile', response: 'Santiago' },
        { pais: 'China', response: 'Pekín' },
        { pais: 'Chipre', response: 'Nicosia' },
        { pais: 'Colombia', response: 'Bogotá' },
        { pais: 'Comoras', response: 'Moroni' },
        { pais: 'Congo', response: 'Brazzaville' },
        { pais: 'Corea del Norte', response: 'Pionyang' },
        { pais: 'Corea del Sur', response: 'Seúl' },
        { pais: 'Costa Rica', response: 'San José' },
        { pais: 'Croacia', response: 'Zagreb' },
        { pais: 'Cuba', response: 'La Habana' },
        { pais: 'Dinamarca', response: 'Copenhague' },
        { pais: 'Dominica', response: 'Roseau' },
        { pais: 'República Dominicana', response: 'Santo Domingo' },
        { pais: 'Ecuador', response: 'Quito' },
        { pais: 'Egipto', response: 'El Cairo' },
        { pais: 'El Salvador', response: 'San Salvador' },
        { pais: 'Emiratos Árabes Unidos', response: 'Abu Dabi' },
        { pais: 'Eslovaquia', response: 'Bratislava' },
        { pais: 'Eslovenia', response: 'Liubliana' },
        { pais: 'España', response: 'Madrid' },
        { pais: 'Estados Unidos', response: 'Washington D.C.' },
        { pais: 'Estonia', response: 'Tallin' },
        { pais: 'Etiopía', response: 'Adís Abeba' },
        { pais: 'Fiji', response: 'Suva' },
        { pais: 'Filipinas', response: 'Manila' },
        { pais: 'Finlandia', response: 'Helsinki' },
        { pais: 'Francia', response: 'París' },
        { pais: 'Gabón', response: 'Libreville' },
        { pais: 'Gambia', response: 'Banjul' },
        { pais: 'Georgia', response: 'Tiflis' },
        { pais: 'Ghana', response: 'Acra' },
        { pais: 'Granada', response: 'Saint George\'s' },
        { pais: 'Guatemala', response: 'Ciudad de Guatemala' },
        { pais: 'Guinea', response: 'Conakri' },
        { pais: 'Guinea-Bisáu', response: 'Bissau' },
        { pais: 'Guinea Ecuatorial', response: 'Malabo' },
        { pais: 'Guyana', response: 'Georgetown' },
        { pais: 'Haití', response: 'Puerto Príncipe' },
        { pais: 'Honduras', response: 'Tegucigalpa' },
        { pais: 'Hungría', response: 'Budapest' },
        { pais: 'India', response: 'Nueva Delhi' },
        { pais: 'Indonesia', response: 'Yakarta' },
        { pais: 'Irak', response: 'Bagdad' },
        { pais: 'Irán', response: 'Teherán' },
        { pais: 'Irlanda', response: 'Dublín' },
        { pais: 'Islandia', response: 'Reikiavik' },
        { pais: 'Islas Marshall', response: 'Majuro' },
        { pais: 'Islas Salomón', response: 'Honiara' },
        { pais: 'Israel', response: 'Jerusalén' },
        { pais: 'Italia', response: 'Roma' },
        { pais: 'Jamaica', response: 'Kingston' },
        { pais: 'Japón', response: 'Tokio' },
        { pais: 'Jordania', response: 'Amán' },
        { pais: 'Kazajistán', response: 'Astaná' },
        { pais: 'Kenia', response: 'Nairobi' },
        { pais: 'Kirguistán', response: 'Biskek' },
        { pais: 'Kiribati', response: 'Tarawa' },
        { pais: 'Kuwait', response: 'Kuwait' },
        { pais: 'Laos', response: 'Vientián' },
        { pais: 'Lesoto', response: 'Maseru' },
        { pais: 'Letonia', response: 'Riga' },
        { pais: 'Líbano', response: 'Beirut' },
        { pais: 'Liberia', response: 'Monrovia' },
        { pais: 'Libia', response: 'Trípoli' },
        { pais: 'Liechtenstein', response: 'Vaduz' },
        { pais: 'Lituania', response: 'Vilna' },
        { pais: 'Luxemburgo', response: 'Luxemburgo' },
        { pais: 'Madagascar', response: 'Antananarivo' },
        { pais: 'Malasia', response: 'Kuala Lumpur' },
        { pais: 'Malawi', response: 'Lilongüe' },
        { pais: 'Maldivas', response: 'Malé' },
        { pais: 'Malí', response: 'Bamako' },
        { pais: 'Malta', response: 'La Valeta' },
        { pais: 'Marruecos', response: 'Rabat' },
        { pais: 'Mauricio', response: 'Port Louis' },
        { pais: 'Mauritania', response: 'Nuakchot' },
        { pais: 'México', response: 'Ciudad de México' }
    ];

    // Seleccionar un país aleatorio
    let json = capitals[Math.floor(Math.random() * capitals.length)];
    let _clue = json.response;
    let clue = _clue.replace(/[A-Za-z]/g, '_');

    let caption = `
ⷮ *Pais:* ${json.pais}

*Tiempo:* ${(timeout / 1000).toFixed(2)} segundos

*Responde con el nombre de la ciudad* 🪄
`.trim();

    conn.tekateki[id] = [
       await conn.reply(m.chat, caption, m),
        json, poin,
        setTimeout(async () => {
            if (conn.tekateki[id]) await conn.reply(m.chat, `Se acabó el tiempo!, intenta descubrir la capital de otro país.`, conn.tekateki[id][0]);
            delete conn.tekateki[id];
        }, timeout)
    ];
}

handler.help = ['capitalde']
handler.tags = ['game']
handler.command = /^(capitalde|capitales|capital|adivinalacapital)$/i

export default handler