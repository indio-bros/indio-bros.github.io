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
  ["11eshoradelevantarse.mp3", "¡Es hora de levantarse, querido! (¿dormiste bien?)"],
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
  if (index === undefined) index = Math.floor(Math.random() * tracks.length);
  currentTrack = index;
  player.src = `audio/${tracks[index][0]}`;
  player.play().catch(() => {
    console.warn("Esperando interacción del usuario para reproducir audio.");
  });
}

// Reproducir siguiente (aleatorio continuo)
player.addEventListener("ended", () => {
  let next;
  do {
    next = Math.floor(Math.random() * tracks.length);
  } while (next === currentTrack);
  playTrack(next);
});

// --- EMULADOR JSNES EMBED ---
let nes = new jsnes.NES({
  onFrame: function (frameBuffer) {
    nes_draw_frame(frameBuffer);
  },
  onAudioSample: function (l, r) {
    nes_write_audio_sample(l, r);
  }
});

// Evitamos reproducir audio antes de interacción
document.getElementById("load-rom").addEventListener("click", () => {
  // Usuario hace clic → habilitado el audio
  playTrack(currentTrack);
  nes_load_url("nes-canvas", "roms/INDIOBROS.NES");
});
