 
const annualReward = { 
    coin: 1000, 
    exp: 5000, 
    diamond: 50, 
}; 
var handler = async (m, { conn, text }) =&gt; { // Añadido 'text' para manejar comandos con argumentos 
    const user = global.db.data.users[m.sender] || {}; // Manejo de usuarios inexistentes 
    const lastClaim = user.lastAnnualClaim || 0; 
    const currentTime = Date.now(); // Más eficiente que new Date().getTime() 
    const oneYear = 31536000000; // Milisegundos en un año (más preciso) 
<pre><code>if (currentTime - lastClaim &lt; oneYear) { 
    const remainingTime = msToTime(oneYear - (currentTime - lastClaim)); 
    return conn.reply(m.chat, `🕚 *Ya has reclamado tu recompensa anual. Vuelve en ${remainingTime}*`, m); 
} 
 
// Actualización de recompensas con manejo de errores de datos faltantes 
user.coin = (user.coin || 0) + annualReward.coin; 
user.diamond = (user.diamond || 0) + annualReward.diamond; 
user.exp = (user.exp || 0) + annualReward.exp; 
user.lastAnnualClaim = currentTime; 
global.db.data.users[m.sender] = user; // Guardar los cambios 
 
// Mejor manejo de la moneda (asume que 'moneda' está definida globalmente) 
const moneda = global.moneda || 'Moneda'; // Define un valor por defecto si 'moneda' no existe 
 
conn.reply(m.chat, `🎉 *Recompensa Anual Reclamada* 
``` 
Recursos: 
💸 ${moneda} : <em>+${annualReward.coin}</em> 
💎 Diamantes : <em>+${annualReward.diamond}</em> 
✨ XP : <em>+${annualReward.exp}</em>`, m); 
}; 
handler.help = ['annual', 'yearly'] 
handler.tags = ['rpg'] 
handler.command = ['annual', 'yearly'] 
handler.group = true; 
handler.register = true 
export default handler; 
function msToTime(duration) { 
    const days = Math.floor(duration / (1000 * 60 * 60 * 24)); 
    const hours = Math.floor((duration % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)); 
    const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60)); 
    const seconds = Math.floor((duration % (1000 * 60)) / 1000); 
<pre><code>return `${days} Día${days !== 1 ? 's' : ''} ${hours} Hora${hours !== 1 ? 's' : ''} ${minutes} Minuto${minutes !== 1 ? 's' : ''} ${seconds} Segundo${seconds !== 1 ? 's' : ''}`; 
