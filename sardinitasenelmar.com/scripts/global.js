// ==================== BUBBLES GENERATION ====================
const bubblesContainer = document.getElementById('contenedor-burbujas-animadas');
if (bubblesContainer) {
    for (let i = 0; i < 25; i++) {
        const bubble = document.createElement('div');
        bubble.className = 'burbuja-animada';
        const size = Math.random() * 20 + 5;
        bubble.style.width = size + 'px';
        bubble.style.height = size + 'px';
        bubble.style.left = Math.random() * 100 + '%';
        bubble.style.animationDuration = (Math.random() * 10 + 8) + 's';
        bubble.style.animationDelay = (Math.random() * 10) + 's';
        bubblesContainer.appendChild(bubble);
    }
}

// ==================== NAVBAR SCROLL ====================
const scrollTopBtn = document.getElementById('boton-subir-arriba');

window.addEventListener('scroll', () => {
    const navbar = document.getElementById('barra-navegacion-fija');
    if (navbar) {
        if (window.scrollY > 80) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }

    if (scrollTopBtn) {
        if (window.scrollY > 80) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }
    }
});

// ==================== CURSOR GLOW ====================
const cursorGlow = document.getElementById('efecto-resplandor-cursor');

document.addEventListener('mousemove', (e) => {
    if (!cursorGlow) return;
    cursorGlow.style.left = e.clientX + 'px';
    cursorGlow.style.top = e.clientY + 'px';
    cursorGlow.style.display = 'flex';
});

// ==================== SARDININTXIS ====================
document.addEventListener('DOMContentLoaded', () => {

    // --- 1. LÓGICA DE MOVIMIENTO CARDUMEN ---
    function crearCaos(grupo) {
        const peces = grupo.querySelectorAll('button:not([data-escaped="true"])');
        peces.forEach(pez => {
            pez.style.top = `${Math.random() * 85}%`;
            pez.style.left = `${Math.random() * 85}%`;
            const tamaño = (Math.random() * 1.5) + 1;
            pez.style.fontSize = `${tamaño}rem`;
            pez.style.zIndex = Math.floor(Math.random() * 10);
        });
    }

    function animarCardumen(elemento, direccion, minEspera, maxEspera) {
        if (!elemento) return;

        function iniciarNado() {
            crearCaos(elemento);

            const nuevaAltura = Math.floor(Math.random() * 40) + 10;
            elemento.style.top = `${nuevaAltura}%`;
            elemento.style.transition = 'none';

            if (direccion === 'hacia-derecha') {
                elemento.style.transform = 'translateX(-100%)';
            } else if (direccion === 'hacia-izquierda') {
                elemento.style.transform = 'translateX(100%)';
            }

            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    elemento.style.transition = 'transform 11s linear';
                    if (direccion === 'hacia-derecha') {
                        elemento.style.transform = 'translateX(100vw)';
                    } else if (direccion === 'hacia-izquierda') {
                        elemento.style.transform = 'translateX(-100vw)';
                    }
                });
            });
        }

        elemento.addEventListener('transitionend', (evento) => {
            if (evento.target === elemento && evento.propertyName === 'transform') {
                const tiempoAleatorio = Math.floor(Math.random() * (maxEspera - minEspera + 1)) + minEspera;
                setTimeout(iniciarNado, tiempoAleatorio);
            }
        });

        const retrasoInicial = Math.floor(Math.random() * 7001) + 3000;
        setTimeout(iniciarNado, retrasoInicial);
    }

    const grupo1 = document.getElementById('grupo-peces-izquierda')
        || document.getElementById('grupo-izquierda');
    const grupo2 = document.getElementById('grupo-peces-derecha')
        || document.getElementById('grupo-derecha');

    animarCardumen(grupo1, 'hacia-derecha', 2000, 6000);
    animarCardumen(grupo2, 'hacia-izquierda', 3000, 8000);

    // --- 2. LÓGICA DE CLICKS (FANTASMA Y FLOTE LENTO) ---
    const allSardines = document.querySelectorAll('.sardina-izquierda, .sardina-derecha');
    const hero = document.getElementById('seccion-inicio-hero');

    allSardines.forEach(sardine => {
        sardine.addEventListener('click', function handler(e) {
            e.stopPropagation();

            sardine.removeEventListener('click', handler);
            sardine.dataset.escaped = 'true';
            sardine.style.cursor = 'default';

            const esDerecha = sardine.classList.contains('sardina-derecha');
            const scale = esDerecha ? 'scaleX(1)' : 'scaleX(-1)';

            const rect = sardine.getBoundingClientRect();
            const heroRect = hero.getBoundingClientRect();

            const currentTop = rect.top - heroRect.top;
            const currentLeft = rect.left - heroRect.left;

            const targetTop = heroRect.height * 0.02;
            const translateNeeded = -(currentTop - targetTop);

            sardine.style.visibility = 'hidden';

            const pezClon = sardine.cloneNode(true);
            pezClon.style.visibility = 'visible';
            pezClon.style.zIndex = '10';
            hero.appendChild(pezClon);

            pezClon.style.animation = 'none';
            pezClon.style.transition = 'none';
            pezClon.style.position = 'absolute';
            pezClon.style.left = currentLeft + 'px';
            pezClon.style.top = currentTop + 'px';
            pezClon.style.right = 'auto';
            pezClon.style.transform = 'none';
            pezClon.style.opacity = '1';

            pezClon.offsetHeight;

            // SUBIDA
            const escape = pezClon.animate([
                { transform: `translateY(0) rotate(0deg) scaleY(-1) ${scale}` },
                { transform: `translateY(${translateNeeded}px) rotate(10deg) scaleY(-1) ${scale}` }
            ], {
                duration: 45000,
                easing: 'ease-out',
                fill: 'forwards'
            });

            escape.onfinish = () => {
                escape.cancel();
                pezClon.style.top = targetTop + 'px';
                pezClon.style.transform = `rotate(10deg) scaleY(-1) ${scale}`;

                // BALANCEO EN SUPERFICIE
                const floatAnimation = esDerecha ? 'sardinaFlotandoDer' : 'sardinaFlotandoIzq';
                pezClon.style.animation = `${floatAnimation} 20s ease-in-out infinite`;
            };
        });
    });
});

document.addEventListener('click', (e) => {
    if (e.target.matches('.sardina-izquierda, .sardina-derecha')) return;

    const overlay = document.querySelector('.seccion-hero-inicio-contenido');
    const footer = document.querySelector('.divisor-ola-pie-pagina');

    let clickedElement = null;
    if (overlay && overlay.contains(e.target)) clickedElement = overlay;
    else if (footer && footer.contains(e.target)) clickedElement = footer;

    if (!clickedElement) return;

    const x = e.clientX;
    const y = e.clientY;

    const prevPointer = clickedElement.style.pointerEvents;
    clickedElement.style.pointerEvents = 'none';
    const elUnder = document.elementFromPoint(x, y);
    clickedElement.style.pointerEvents = prevPointer || '';

    if (!elUnder) return;

    if (elUnder.matches('.sardina-izquierda, .sardina-derecha')) {
        e.preventDefault();
        e.stopPropagation();
        elUnder.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
    }
});
