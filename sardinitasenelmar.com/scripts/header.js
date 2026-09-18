/* ==========================================================================
    header.js — <site-header>
    ========================================================================== */

const MOBILE_QUERY = '(max-width: 768px)';

class SiteHeader extends HTMLElement {
    connectedCallback() {
        // connectedCallback se ejecuta de nuevo si el elemento se mueve en el
        // DOM, y volver a renderizar eliminaría los listeners añadidos más
        // abajo.
        if (this.ready) return;
        this.ready = true;

        this.render();
        this.initMenu();
    }

    render() {
        this.innerHTML = `
      <nav class="barra-navegacion" id="barra-navegacion-fija">
        <a href="#" class="marca-logo-sitio">
            <span class="logo-pez-animado">🐟</span>
            Sardinitas en el Mar
        </a>
        <ul class="lista-enlaces-navegacion" id="lista-enlaces-navegacion">
            <li><a href="#nosotros">Nosotros</a></li>
        </ul>
        <button class="boton-conmutador-menu" id="boton-menu" type="button" aria-label="Menú" aria-expanded="false" aria-controls="lista-enlaces-navegacion">
            <span></span><span></span><span></span>
        </button>
    </nav>
    `;
    }

    initMenu() {
        const toggle = this.querySelector('#boton-menu');
        const menu = this.querySelector('#lista-enlaces-navegacion');
        if (!toggle || !menu) return;

        const mobile = matchMedia(MOBILE_QUERY);
        let open = false;

        const setOpen = next => {
            if (next === open) return;
            open = next;

            menu.classList.toggle('abierta', open);
            toggle.classList.toggle('abierto', open);
            toggle.setAttribute('aria-expanded', String(open));
        };

        toggle.addEventListener('click', () => setOpen(!open));

        // Al seguir un enlace se cierra el panel.
        menu.addEventListener('click', event => {
            if (event.target.closest('a')) setOpen(false);
        });

        document.addEventListener('click', event => {
            if (!open) return;
            if (menu.contains(event.target) || toggle.contains(event.target)) return;
            setOpen(false);
        });

        document.addEventListener('keydown', event => {
            if (event.key !== 'Escape' || !open) return;
            setOpen(false);
            toggle.focus();
        });

        // Cuando volvemos al diseño de escritorio los enlaces se muestran de
        // todos modos, así que limpiamos el estado en lugar de dejar un panel
        // abierto obsoleto y un icono de cierre obsoleto.
        const syncBreakpoint = () => {
            if (!mobile.matches) setOpen(false);
        };

        mobile.addEventListener('change', syncBreakpoint);
        syncBreakpoint();
    }
}

customElements.define('site-header', SiteHeader);
