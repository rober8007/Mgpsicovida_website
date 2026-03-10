const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('#nav-menu a');

if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
}

const track = document.getElementById('track');
const slidesOriginales = Array.from(track.children);
const dots = document.querySelectorAll('.dot');
const totalRealSlides = slidesOriginales.length;

const firstClone = slidesOriginales[0].cloneNode(true);
const lastClone = slidesOriginales[totalRealSlides - 1].cloneNode(true);

track.appendChild(firstClone);
track.insertBefore(lastClone, slidesOriginales[0]);

let indice = 1;
let isTransitioning = false;
const speed = 600;

track.style.transition = 'none';
track.style.transform = `translateX(-${indice * 100}%)`;

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

track.addEventListener('transitionend', () => {
    isTransitioning = false;

    if (indice === totalRealSlides + 1) {
        indice = 1;
        actualizarCarrusel(false);
    }
    if (indice === 0) {
        indice = totalRealSlides;
        actualizarCarrusel(false);
    }
});

let autoPlay = setInterval(() => mover(1), 4000);

function reiniciarAutoPlay() {
    clearInterval(autoPlay);
    autoPlay = setInterval(() => mover(1), 4000);
}

document.getElementById('miFormulario').addEventListener('submit', function(e) {
    e.preventDefault();

    const btnEnviar = this.querySelector('.btn-enviar');
    const nombre = document.getElementById('nombre').value.trim();
    const email = document.getElementById('email').value.trim();
    const asunto = document.getElementById('asunto').value.trim();
    const mensaje = document.getElementById('mensaje').value.trim();
    const politica = this.querySelector('input[type="checkbox"]').checked;

    if (!nombre || !email || !mensaje) {
        Swal.fire({
            title: 'Campos incompletos',
            text: 'Por favor, rellena todos los campos marcados con asterisco (*).',
            icon: 'warning',
            confirmButtonColor: '#2b2140'
        });
        return;
    }

    if (!politica) {
        Swal.fire({
            title: 'Política de Privacidad',
            text: 'Para poder enviarme tu consulta, es necesario que aceptes la política de privacidad marcando la casilla.',
            icon: 'info',
            confirmButtonText: 'Entendido',
            confirmButtonColor: '#2b2140'
        });
        return;
    }

    btnEnviar.disabled = true;
    btnEnviar.textContent = 'Enviando...';

    const formData = new FormData(this);

    fetch(this.action, {
        method: this.method,
        body: formData,
        headers: { 'Accept': 'application/json' }
    }).then(response => {
        if (response.ok) {
            Swal.fire({
                title: '¡Mensaje enviado!',
                text: `Gracias por contactar, ${nombre}. Te responderé lo antes posible.`,
                icon: 'success',
                confirmButtonColor: '#2b2140'
            });
            this.reset();
        } else {
            Swal.fire('Error', 'Hubo un problema al enviar. Inténtalo de nuevo.', 'error');
        }
    }).catch(error => {
        Swal.fire('Error', 'No hay conexión con el servidor.', 'error');
    }).finally(() => {
        btnEnviar.disabled = false;
        btnEnviar.textContent = 'Enviar';
    });
});