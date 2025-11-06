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

document.getElementById("load-rom").addEventListener("click", () => {
  playTrack(currentTrack);
  nes_load_url("nes-canvas", "roms/INDIOBROS.NES");
});


// --- CONTROLES TÁCTILES ---

function simulateKey(code, type) {
  // Simula un evento de teclado
  const event = new KeyboardEvent(type, {
    code: code,
    key: code,
    bubbles: true,
    cancelable: true,
  });
  document.dispatchEvent(event);
}

function setupTouchControls() {
  const buttons = [
    { id: "btn-left", code: "ArrowLeft" },
    { id: "btn-right", code: "ArrowRight" },
    { id: "btn-a", code: "KeyA" },       // A - salto
    { id: "btn-b", code: "KeyS" },       // S - acción secundaria
    { id: "btn-select", code: "Tab" },   // Select
    { id: "btn-start", code: "Enter" },  // Start
  ];

  buttons.forEach(btn => {
    const el = document.getElementById(btn.id);
    if (!el) return;

    el.addEventListener("touchstart", e => {
      e.preventDefault();
      simulateKey(btn.code, "keydown");
    });

    el.addEventListener("touchend", e => {
      e.preventDefault();
      simulateKey(btn.code, "keyup");
    });
  });
}

// Activar solo si hay pantalla táctil
if ('ontouchstart' in window) {
  setupTouchControls();
}