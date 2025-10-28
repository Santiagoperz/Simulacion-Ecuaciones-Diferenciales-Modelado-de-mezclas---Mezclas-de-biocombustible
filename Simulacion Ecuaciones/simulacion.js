const canvas = document.getElementById('reactor');
const ctx = canvas.getContext('2d');
const tiempo = document.getElementById('tiempo');
const info = document.getElementById('info');
const volumenes = document.getElementById('volumenes');
const btnPlay = document.getElementById('btnPlay');

// Parámetros base
const aceite = 1.0;       // L
const metanol = 0.2;      // L (200 ml)
const sosa = 4;           // g

// Proporciones teóricas finales (simplificadas)
const biodieselTeorico = 0.9; // L
const glicerinaTeorica = 0.3; // L

// Variables de simulación
let simulacionActiva = false;
let intervalo = null;
let progreso = 0; // 0–100 representa 0–24 horas
const duracionSimuladaHoras = 24;

// --- FUNCIÓN PRINCIPAL ---
function dibujarReactor(t) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Dibujar recipiente
  ctx.strokeStyle = '#333';
  ctx.lineWidth = 3;
  ctx.strokeRect(100, 30, 200, 240);

  const totalAltura = 240;
  const glicerinaAltura = totalAltura * (t / 100) * 0.4;
  const biodieselAltura = totalAltura - glicerinaAltura;

  if (t < 30) {
    const grad = ctx.createLinearGradient(0, 30, 0, 270);
    grad.addColorStop(0, '#f7e48d');
    grad.addColorStop(1, '#c5b580');
    ctx.fillStyle = grad;
    ctx.fillRect(100, 30, 200, totalAltura);
    info.textContent = "Fase inicial: mezcla homogénea de aceite, metanol y sosa cáustica.";
  } else if (t < 70) {
    const mezclaProgreso = (t - 30) / 40;
    const grad = ctx.createLinearGradient(0, 30, 0, 270);
    grad.addColorStop(0, '#f7e48d');
    grad.addColorStop(Math.min(mezclaProgreso, 1), '#c49b66');
    grad.addColorStop(1, '#9a754c');
    ctx.fillStyle = grad;
    ctx.fillRect(100, 30, 200, totalAltura);
    info.textContent = "Fase intermedia: comienza la separación entre biodiésel (arriba) y glicerina (abajo).";
  } else {
    const ySeparacion = 30 + biodieselAltura;
    const grad = ctx.createLinearGradient(0, ySeparacion - 15, 0, ySeparacion + 15);
    grad.addColorStop(0, '#f7e48d');
    grad.addColorStop(0.5, '#b07a3a');
    grad.addColorStop(1, '#8b5a2b');

    ctx.fillStyle = '#f7e48d';
    ctx.fillRect(100, 30, 200, biodieselAltura - 15);

    ctx.fillStyle = grad;
    ctx.fillRect(100, ySeparacion - 15, 200, 30);

    ctx.fillStyle = '#8b5a2b';
    ctx.fillRect(100, ySeparacion + 15, 200, glicerinaAltura - 15);

    info.textContent = "Fase final: biodiésel arriba, glicerina abajo (más densa).";
  }

  // Texto dentro del reactor
  ctx.fillStyle = '#222';
  ctx.font = '14px Arial';
  if (t >= 70) {
    ctx.fillText("Biodiésel", 160, 50 + biodieselAltura / 2);
    ctx.fillText("Glicerina", 160, 30 + biodieselAltura + glicerinaAltura / 2);
  } else {
    ctx.fillText("Mezcla reaccionando...", 130, 160);
  }

  // Cálculo de volúmenes
  const biodiesel = (biodieselTeorico * t) / 100;
  const glicerina = (glicerinaTeorica * t) / 100;
  const horas = (t / 100) * duracionSimuladaHoras;

  volumenes.textContent = `Tiempo: ${horas.toFixed(1)} h | Aceite: ${aceite.toFixed(2)} L | Metanol: ${metanol.toFixed(2)} L | Sosa: ${sosa} g → Biodiésel: ${biodiesel.toFixed(2)} L | Glicerina: ${glicerina.toFixed(2)} L`;
}

// --- CONTROL MANUAL ---
tiempo.addEventListener('input', e => {
  progreso = parseInt(e.target.value);
  dibujarReactor(progreso);
});

// --- ANIMACIÓN AUTOMÁTICA ---
btnPlay.addEventListener('click', () => {
  if (!simulacionActiva) {
    simulacionActiva = true;
    btnPlay.textContent = "⏸ Pausar";
    intervalo = setInterval(() => {
      progreso += 0.2; // velocidad de simulación
      if (progreso > 100) {
        progreso = 100;
        clearInterval(intervalo);
        simulacionActiva = false;
        btnPlay.textContent = "▶ Reiniciar";
      }
      tiempo.value = progreso;
      dibujarReactor(progreso);
    }, 200); // cada 200 ms = avance progresivo
  } else {
    simulacionActiva = false;
    btnPlay.textContent = "▶ Reanudar";
    clearInterval(intervalo);
  }
});

// Dibujo inicial
dibujarReactor(0);
