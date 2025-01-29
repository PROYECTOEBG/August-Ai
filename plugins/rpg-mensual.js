 
const baseCoinReward = 20000; 
var handler = async (m, { conn }) =&gt; { 
    let user = global.db.data.users[m.sender] || { coin: 0, exp: 0, diamonds: 0, monthly: 0 }; // Initialize missing values 
<pre><code>const cooldown = 604800000 * 4; // 4 weeks in milliseconds 
 
const lastClaimTime = user.monthly; 
const now = Date.now(); 
const timeRemaining = lastClaimTime + cooldown - now; 
 
if (timeRemaining &gt; 0) { 
    return m.reply(`⏱️ ¡Ya reclamaste tu regalo mensual! Vuelve en:
 *${msToTime(timeRemaining)}*`); 
} 
 
// More robust reward system - using baseCoinReward and multipliers 
let coinReward = baseCoinReward + pickRandom([-5000, -2500, 0, 2500, 5000]); // Add some variance 
let expReward = Math.floor(coinReward / 10); //Experience scales with coin reward 
let diamondReward = Math.floor(coinReward / 5000); // Diamonds are a rarer reward 
 
// Ensure rewards are not negative. 
coinReward = Math.max(0, coinReward); 
expReward = Math.max(0, expReward); 
diamondReward = Math.max(0, diamondReward); 
 
 
user.coin += coinReward; 
user.exp += expReward; 
user.diamonds += diamondReward; 
user.monthly = now; // Update claim time 
 
m.reply(` 
``` 
```🎁 ¡Ha pasado un mes! ¡Disfruta de tu regalo mensual!. ``` 
💸 <em>${moneda || 'Moneda'}</em> : +${coinReward} 
✨ <em>Experiencia</em> : +${expReward} 
💎 <em>Diamantes</em> : +${diamondReward}`); 
<pre><code>// Save the updated user data.  This part depends on your database implementation. 
global.db.data.users[m.sender] = user; 
``` 
}; 
handler.help = ['monthly']; 
handler.tags = ['rpg']; 
handler.command = ['mensual', 'monthly']; 
export default handler; 
function pickRandom(list) { 
    return list[Math.floor(Math.random() * list.length)]; 
} 
function msToTime(duration) { 
    if(duration &lt;= 0) return "0 segundos"; //Handle 0 duration cases 
    var seconds = Math.floor((duration / 1000) % 60); 
    var minutes = Math.floor((duration / (1000 * 60)) % 60); 
    var hours = Math.floor((duration / (1000 * 60 * 60)) % 24); 
    var days = Math.floor(duration / (1000 * 60 * 60 * 24)); 
<pre><code>return `${days} días ${hours} horas ${minutes} minutos ${seconds} segundos`; 