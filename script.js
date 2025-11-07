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


// --- CONTROLES TÁCTILES SIMPLIFICADOS ---
// Llama directamente a nes.buttonDown / nes.buttonUp para móviles

function setupTouchControls() {
  const buttons = [
    { id: "btn-left", player: 1, button: jsnes.Controller.BUTTON_LEFT },
    { id: "btn-right", player: 1, button: jsnes.Controller.BUTTON_RIGHT },
    { id: "btn-a", player: 1, button: jsnes.Controller.BUTTON_A },
    { id: "btn-select", player: 1, button: jsnes.Controller.BUTTON_SELECT },
    { id: "btn-start", player: 1, button: jsnes.Controller.BUTTON_START }
  ];

  buttons.forEach(btn => {
    const el = document.getElementById(btn.id);
    if (!el) return;

    el.addEventListener("touchstart", e => {
      e.preventDefault();
      nes.buttonDown(btn.player, btn.button);
    });

    el.addEventListener("touchend", e => {
      e.preventDefault();
      nes.buttonUp(btn.player, btn.button);
    });
  });
}

// Activamos solo en pantallas táctiles
if ('ontouchstart' in window) {
  setupTouchControls();
}

// Toggle diestro / zurdo
const toggleBtn = document.getElementById("toggle-handedness");
const touchControls = document.getElementById("touch-controls");

toggleBtn.addEventListener("click", () => {
  if (touchControls.classList.contains("right-handed")) {
    touchControls.classList.remove("right-handed");
    touchControls.classList.add("left-handed");
    toggleBtn.textContent = "Cambiar a modo diestro";
  } else {
    touchControls.classList.remove("left-handed");
    touchControls.classList.add("right-handed");
    toggleBtn.textContent = "Cambiar a modo zurdo";
  }
});



const placeholder = document.getElementById("rom-placeholder");
const canvas = document.getElementById("nes-canvas");

function startGame() {
  // Oculta la portada
  placeholder.style.display = "none";
  // Muestra el canvas
  canvas.style.display = "block";
  // Carga el ROM
  nes_load_url("nes-canvas", "roms/INDIOBROS.NES");
}

// Click en la portada
placeholder.addEventListener("click", startGame);

// Click en el botón "Jugar" (respaldo)
document.getElementById("load-rom").addEventListener("click", startGame);
