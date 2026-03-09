/**
 * CONFIGURACIÓN DEL CARRUSEL INFINITO
 */
const track = document.getElementById('track');
const slidesOriginales = Array.from(track.children);
const dots = document.querySelectorAll('.dot');
const totalRealSlides = slidesOriginales.length;

// 1. Clonación para efecto infinito
const firstClone = slidesOriginales[0].cloneNode(true);
const lastClone = slidesOriginales[totalRealSlides - 1].cloneNode(true);

track.appendChild(firstClone);
track.insertBefore(lastClone, slidesOriginales[0]);

// 2. Estado Inicial
let indice = 1; 
let isTransitioning = false;
const speed = 600; // milisegundos

// Colocar el carrusel en la posición de la primera opinión real
track.style.transition = 'none';
track.style.transform = `translateX(-${indice * 100}%)`;

/**
 * FUNCIÓN DE MOVIMIENTO
 */
function actualizarCarrusel(animar = true) {
    if (animar) {
        track.style.transition = `transform ${speed}ms cubic-bezier(0.4, 0, 0.2, 1)`;
    } else {
        track.style.transition = 'none';
    }
    track.style.transform = `translateX(-${indice * 100}%)`;
    actualizarDots();
}

function actualizarDots() {
    let dotIndice = indice - 1;
    if (indice === 0) dotIndice = totalRealSlides - 1;
    if (indice === totalRealSlides + 1) dotIndice = 0;

    dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === dotIndice);
    });
}

function mover(paso) {
    if (isTransitioning) return;
    isTransitioning = true;
    indice += paso;
    actualizarCarrusel();
    reiniciarAutoPlay();
}

function irASlide(n) {
    if (isTransitioning) return;
    isTransitioning = true;
    indice = n + 1;
    actualizarCarrusel();
    reiniciarAutoPlay();
}

/**
 * RESETEO INVISIBLE (EL TRUCO DEL INFINITO)
 */
track.addEventListener('transitionend', () => {
    isTransitioning = false;
    
    // Si llegamos al clon del final, saltamos al inicio real sin que se note
    if (indice === totalRealSlides + 1) {
        indice = 1;
        actualizarCarrusel(false);
    }
    // Si llegamos al clon del inicio, saltamos al final real
    if (indice === 0) {
        indice = totalRealSlides;
        actualizarCarrusel(false);
    }
});

/**
 * AUTO-PLAY
 */
let autoPlay = setInterval(() => mover(1), 4000);

function reiniciarAutoPlay() {
    clearInterval(autoPlay);
    autoPlay = setInterval(() => mover(1), 4000);
}