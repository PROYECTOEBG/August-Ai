let handler = async(m, { conn, usedPrefix, command, text }) => {
let enc = {
"a": "•-",
"b": "-•••",
"c": "-•-•",
"d": "-••",
"e": "•",
"f": "••-•",
"g": "--•",
"h": "••••",
"i": "••",
"j": "•---",
"k": "-•-",
"l": "•-••",
"m": "--",
"n": "-•",
"o": "---",
"p": "•--•",
"q": "--•-",
"r": "•-•",
"s": "•••",
"t": "-",
"u": "••-",
"v": "•••-",
"w": "•--",
"x": "-••-",
"y": "-•--",
"z": "--••",
"0": "-----",
"1": "•----",
"2": "••---",
"3": "•••--",
"4": "••••-",
"5": "•••••",
"6": "-••••",
"7": "--•••",
"8": "---••",
"9": "----•",
"?": "••--••",
"!": "-•-•--",
".": "•-•-•-",
",": "--••--",
";": "-•-•-•",
":": "---•••",
"+": "•-•-•",
"-": "-••••-",
"/": "-••-•",
"=": "-•••-",
" ": "/"
}
let dec = {
"-----": "0",
"•----": "1",
"••---": "2",
"•••--": "3",
"••••-": "4",
"•••••": "5",
"-••••": "6",
"--•••": "7",
"---••": "8",
"----•": "9",
"•-": "a",
"-•••": "b",
"-•-•": "c",
"-••": "d",
"•": "e",
"••-•": "f",
"--•": "g",
"••••": "h",
"••": "i",
"•---": "j",
"-•-": "k",
"•-••": "l",
"--": "m",
"-•": "n",
"---": "o",
"•--•": "p",
"--•-": "q",
"•-•": "r",
"•••": "s",
"-": "t",
"••-": "u",
"•••-": "v",
"•--": "w",
"-••-": "x",
"-•--": "y",
"--••": "z",
"••--••": "?",
"-•-•--": "!",
"•-•-•-": ".",
"--••--": ",",
"-•-•-•": ";",
"---•••": ":",
"•-•-•": "+",
"-••••-": "-",
"-••-•": "/",
"-•••-": "=",
"/": " "
}
// Definición de fkontak como un objeto de contacto
let fkontak = {
key: {
remoteJid: m.chat,
fromMe: false,
id: 'someUniqueId'
},
participant: '123456789@s.whatsapp.net' // Aquí pones el número o ID del contacto
};
let selected = text.toLowerCase().split(" ")[0] + " ";
if(selected == "codificar ") {
let str = text.replace(selected, "").toLowerCase();
let Output_Morse = "";
for(let i of str) {
if(!enc[i]) Output_Morse += i;
for(let j in enc) {
if(j == i) Output_Morse += enc[i] + " ";
}
}
return conn.reply(m.chat, Output_M