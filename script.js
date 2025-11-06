// --- TRACKLIST ---
const tracks = [
  ["1unpacmanenelsavoy.mp3", "Un pacman en el Savoy"],
  ["2laoscuridad.mp3", "La oscuridad"],
  ["3esaestrellaeramilujo.mp3", "Esa estrella era mi lujo"],
  ["4eltesorodelosinocentes.mp3", "El tesoro de los inocentes"],
  ["5encuentroconunangelamateur.mp3", "Encuentro con un ángel amateur"],
  ["6jijiji.mp3", "Jijiji"],
  ["7infierno.mp3", "El infierno está encantador esta noche"],
  ["8motorpsico.mp3", "Motor psico"],
  ["9tareafina.mp3", "Tarea fina"],
  ["10todounpalo.mp3", "Todo un palo"],
  ["11eshoradelevantarse.mp3", "¡Es hora de levantarse, querido! (dormiste bien?)"],
  ["12pabellonseptimo.mp3", "Pabellón séptimo (relato de Horacio)"],
  ["13habiaunavez.mp3", "Había una vez"]
];

const player = document.getElementById("audio-player");
const table = document.getElementById("tracklist");

// Cargar lista
tracks.forEach(([file, name], i) => {
  const row = document.createElement("tr");
  row.innerHTML = `<td>${i + 1}</td><td>${name}</td>`;
  row.onclick = () => playTrack(i);
  table.appendChild(row);
});

let currentTrack = Math.floor(Math.random() * tracks.length);

function playTrack(index) {
  currentTrack = index;
  player.src = `audio/${tracks[index][0]}`;
  player.play();
}

// Reproducir siguiente (aleatorio continuo)
player.addEventListener("ended", () => {
  let next;
  do {
    next = Math.floor(Math.random() * tracks.length);
  } while (next === currentTrack);
  playTrack(next);
});

// Reproducir uno al azar al cargar
window.addEventListener("load", () => playTrack(currentTrack));


// --- EMULADOR REAL ---
const canvas = document.getElementById("nes-canvas");
const ctx = canvas.getContext("2d");
const imageData = ctx.getImageData(0, 0, 256, 240);
const nes = new JSNES({ onFrame: frame => drawFrame(frame) });

function drawFrame(frameBuffer) {
  const data = imageData.data;
  for (let i = 0; i < frameBuffer.length; i++) {
    data[i * 4] = (frameBuffer[i] >> 16) & 0xFF;
    data[i * 4 + 1] = (frameBuffer[i] >> 8) & 0xFF;
    data[i * 4 + 2] = frameBuffer[i] & 0xFF;
  }
  ctx.putImageData(imageData, 0, 0);
}

document.getElementById("load-rom").addEventListener("click", async () => {
  try {
    const response = await fetch("roms/INDIOBROS.NES");
    const buffer = await response.arrayBuffer();
    nes.loadROM(new Uint8Array(buffer));
    startLoop();
  } catch (err) {
    alert("Error al cargar la ROM: " + err.message);
  }
});

function startLoop() {
  function frame() {
    nes.frame();
    requestAnimationFrame(frame);
  }
  frame();
}
