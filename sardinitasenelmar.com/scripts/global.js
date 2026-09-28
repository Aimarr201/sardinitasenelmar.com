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

    // --- VARIABLES DE CANTIDAD DE PECES ---
    const cantidadPecesIzquierda = 9; // Cantidad de peces que aparecen por la izquierda
    const cantidadPecesDerecha = 16;  // Cantidad de peces que aparecen por la derecha

    // --- CONFIGURACIÓN DE EMOJIS POR CARDUMEN (Porcentajes y Orientación) ---
    // Orientaciones posibles: 'izquierda', 'derecha', 'arriba'
    const emojisIzquierda = [
        { emoji: '🐟', probabilidad: 85.9, orientacion: 'izquierda' },
        { emoji: '🐠', probabilidad: 14, orientacion: 'izquierda' },
        { emoji: '🦄', probabilidad: 0.1, orientacion: 'derecha' },
    ];

    const emojisDerecha = [
        { emoji: '🐟', probabilidad: 83, orientacion: 'izquierda' },
        { emoji: '🐠', probabilidad: 11, orientacion: 'izquierda' },
        { emoji: '🐙', probabilidad: 3, orientacion: 'arriba' },
        { emoji: '🦑', probabilidad: 3, orientacion: 'arriba' }
    ];

    function obtenerEmojiAleatorio(configuracion) {
        // Sumamos las probabilidades para permitir decimales o totales que no den 100 exactos
        const sumaTotal = configuracion.reduce((suma, item) => suma + item.probabilidad, 0);
        const rnd = Math.random() * sumaTotal;

        let acumulado = 0;
        for (const item of configuracion) {
            acumulado += item.probabilidad;
            if (rnd < acumulado) {
                return item;
            }
        }
        return configuracion[0]; // Fallback
    }

    function configurarPezAleatorio(pez, direccionNado, orientacionNatural) {
        pez.style.top = `${Math.random() * 85}%`;
        pez.style.left = `${Math.random() * 85}%`;
        const tamaño = (Math.random() * 1.5) + 1;
        pez.style.fontSize = `${tamaño}rem`;
        pez.style.zIndex = Math.floor(Math.random() * 10);

        let transform = '';
        let aleteoX = '-5px'; // Por defecto, aletea hacia la izquierda visualmente

        if (direccionNado === 'derecha') { // El cardumen se mueve hacia la derecha en la pantalla
            if (orientacionNatural === 'izquierda') { transform = 'scaleX(-1)'; aleteoX = '5px'; }
            else if (orientacionNatural === 'derecha') { transform = 'scaleX(1)'; aleteoX = '-5px'; }
            else if (orientacionNatural === 'arriba') { transform = 'rotate(90deg)'; aleteoX = '0px'; }
        } else { // El cardumen se mueve hacia la izquierda
            if (orientacionNatural === 'izquierda') { transform = 'scaleX(1)'; aleteoX = '-5px'; }
            else if (orientacionNatural === 'derecha') { transform = 'scaleX(-1)'; aleteoX = '5px'; }
            else if (orientacionNatural === 'arriba') { transform = 'rotate(-90deg)'; aleteoX = '0px'; }
        }

        pez.style.setProperty('--ajuste-orientacion', transform);
        pez.style.setProperty('--aleteo-x', aleteoX);
        pez.dataset.orientacionBase = transform; // Para la animación de "escape" (flote)
    }

    const grupo1 = document.querySelector('cardumen-izquierdo');
    const grupo2 = document.querySelector('cardumen-derecho');

    // Generar peces dinámicamente
    if (grupo1) {
        for (let i = 0; i < cantidadPecesIzquierda; i++) {
            const pez = document.createElement('button');
            pez.className = 'sardina-izquierda';
            const configPez = obtenerEmojiAleatorio(emojisIzquierda);
            pez.textContent = configPez.emoji;
            configurarPezAleatorio(pez, 'derecha', configPez.orientacion || 'izquierda');
            grupo1.appendChild(pez);
        }
    }

    if (grupo2) {
        for (let i = 0; i < cantidadPecesDerecha; i++) {
            const pez = document.createElement('button');
            pez.className = 'sardina-derecha';
            const configPez = obtenerEmojiAleatorio(emojisDerecha);
            pez.textContent = configPez.emoji;
            configurarPezAleatorio(pez, 'izquierda', configPez.orientacion || 'izquierda');
            grupo2.appendChild(pez);
        }
    }

    // --- 1. LÓGICA DE MOVIMIENTO CARDUMEN ---

    function animarCardumen(elemento, direccion, minEspera, maxEspera) {
        if (!elemento) return;

        function iniciarNado() {
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
            const baseTransform = sardine.dataset.orientacionBase || (esDerecha ? 'scaleX(1)' : 'scaleX(-1)');

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
                { transform: `translateY(0) rotate(0deg) scaleY(-1) ${baseTransform}` },
                { transform: `translateY(${translateNeeded}px) rotate(10deg) scaleY(-1) ${baseTransform}` }
            ], {
                duration: 45000,
                easing: 'ease-out',
                fill: 'forwards'
            });

            escape.onfinish = () => {
                escape.cancel();
                pezClon.style.top = targetTop + 'px';
                pezClon.style.transform = `rotate(10deg) scaleY(-1) ${baseTransform}`;

                // BALANCEO EN SUPERFICIE
                pezClon.style.animation = `sardinaFlotando 20s ease-in-out infinite`;
            };
        });
    });
});

document.addEventListener('click', (e) => {
    if (e.target.matches('.sardina-izquierda, .sardina-derecha')) return;

    const overlay = document.querySelector('.seccion-hero-inicio-contenido');
    if (!overlay) return;

    if (!overlay.contains(e.target)) return;

    const x = e.clientX;
    const y = e.clientY;

    const prevPointer = overlay.style.pointerEvents;
    overlay.style.pointerEvents = 'none';
    const elUnder = document.elementFromPoint(x, y);
    overlay.style.pointerEvents = prevPointer || '';

    if (!elUnder) return;

    if (elUnder.matches('.sardina-izquierda, .sardina-derecha')) {
        e.preventDefault();
        e.stopPropagation();
        elUnder.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
    }
});
