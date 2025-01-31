let cooldowns = {}

let handler = async (m, { conn, text, command }) => {
  let users = global.db.data.users
  let senderId = m.sender
  let senderName = conn.getName(senderId)

  let tiempoEspera = 60 * 60  // Espera de 1 hora entre giros

  if (cooldowns[m.sender] && Date.now() - cooldowns[m.sender] < tiempoEspera * 1000) {
    let tiempoRestante = segundosAHMS(Math.ceil((cooldowns[m.sender] + tiempoEspera * 1000 - Date.now()) / 1000))
    return conn.reply(m.chat, `🎰 Espera *${tiempoRestante}* para girar la ruleta nuevamente.`, m, rcanal)
  }

  cooldowns[m.sender] = Date.now()

  let resultados = [
    '🪙 100 monedas',
    '🪙 50 monedas',
    '✨ 30 XP',
    '✨ 50 XP',
    '🚫 Nada'
  ]
  let resultado = resultados[Math.floor(Math.random() * resultados.length)]

  switch (resultado) {
    case '🪙 100 monedas':
      users[senderId].Monedas = users[senderId].Monedas || 0
      users[senderId].Monedas += 100
      return conn.reply(m.chat, `🎰 ¡Felicidades, ${senderName}! Has ganado *100 🪙 monedas*.`, m, rcanal)
    case '🪙 50 monedas':
      users[senderId].Monedas = users[senderId].Monedas || 0
      users[senderId].Monedas += 50
      return conn.reply(m.chat, `🎰 ¡Felicidades, ${senderName}! Has ganado *50 🪙 monedas*.`, m, rcanal)
    case '✨ 30 XP':
      users[senderId].xp = users[senderId].xp || 0
      users[senderId].xp += 30
      return conn.reply(m.chat, `🎰 ¡Felicidades, ${senderName}! Has ganado *30 ✨ XP*.`, m, rcanal)
    case '✨ 50 XP':
      users[senderId].xp = users[senderId].xp || 0
      users[senderId].xp += 50
      return conn.reply(m.chat, `🎰 ¡Felicidades, ${senderName}! Has ganado *50 ✨ XP*.`, m, rcanal)
    case '🚫 Nada':
      return conn.reply(m.chat, `🎰 Lo siento, ${senderName}, no ganaste nada esta vez. ¡Intenta de nuevo más tarde!`, m, rcanal)
  }
}

handler.command = ['rueda', 'wheel']
handler.tags = ['rpg']
handler.help = ['rueda']
handler.register = true

export default handler

function segundosAHMS(segundos) {
  let horas = Math.floor(segundos / 3600)
  let minutos = Math.floor((segundos % 3600) / 60)
  let segundosRestantes = segundos % 60
  return `${minutos} minutos y ${segundosRestantes} segundos`
}