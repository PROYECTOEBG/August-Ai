let cooldowns = {}

let handler = async (m, { conn, text, command }) => {
  let users = global.db.data.users
  let senderId = m.sender
  let senderName = conn.getName(senderId)

  // Tiempo de enfriamiento (en segundos)
  let tiempoEspera = 5 * 60

  // Verificar si el jugador está en tiempo de enfriamiento
  if (cooldowns[m.sender] && Date.now() - cooldowns[m.sender] < tiempoEspera * 1000) {
    let tiempoRestante = segundosAHMS(Math.ceil((cooldowns[m.sender] + tiempoEspera * 1000 - Date.now()) / 1000))
    m.reply(`🎣 Ya has pescado recientemente. Espera ⏳ *${tiempoRestante}* antes de intentarlo de nuevo.`)
    return
  }

  // Actualizar el tiempo de enfriamiento
  cooldowns[m.sender] = Date.now()

  if (!users[senderId]) {
    users[senderId] = { Monedas: 0, Inventario: [] }
  }

  let senderMonedas = users[senderId].Monedas || 0
  let inventario = users[senderId].Inventario || []

  // Generar resultado aleatorio
  const peces = [
    { nombre: '🐟 Pez Dorado', monedas: 50 },
    { nombre: '🐠 Pez Tropical', monedas: 20 },
    { nombre: '🦈 Tiburón', monedas: 50 },
    { nombre: '🐡 Pez Globo', monedas: 10 },
    { nombre: '🪙 Cofre de Tesoro', monedas: 100 },
    { nombre: '🚫 Bota Vieja', monedas: 0 }
  ]

  let resultado = peces[Math.floor(Math.random() * peces.length)]

  // Actualizar monedas e inventario según el resultado
  if (resultado.monedas > 0) {
    users[senderId].Monedas += resultado.monedas
    m.reply(`🎣 ¡Pescaste un *${resultado.nombre}*! Obtienes *${resultado.monedas} 🪙 Monedas*. Ahora tienes un total de *${users[senderId].Monedas} 🪙 Monedas*.`)
  } else {
    m.reply(`🎣 ¡Oh no! Pescaste una *${resultado.nombre}*. Mejor suerte la próxima vez.`)
  }

  // Agregar el pez al inventario del jugador
  inventario.push(resultado.nombre)
  users[senderId].Inventario = inventario

  // Guardar la base de datos
  global.db.write()
}

handler.tags = ['rpg']
handler.help = ['pescar']
handler.command = ['pescar', 'fish']
handler.register = true
handler.group = true

export default handler

function segundosAHMS(segundos) {
  let minutos = Math.floor(segundos / 60)
  let segundosRestantes = segundos % 60
  return `${minutos} minutos y ${segundosRestantes} segundos`
}