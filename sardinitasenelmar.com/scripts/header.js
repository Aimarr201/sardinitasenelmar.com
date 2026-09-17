
class SiteHeader extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <nav class="barra-navegacion" id="barra-navegacion-fija">
        <a href="#" class="marca-logo-sitio">
            <span class="logo-pez-animado">🐟</span>
            Sardinitas en el Mar
        </a>
        <ul class="lista-enlaces-navegacion" id="lista-enlaces-navegacion">
            <li><a href="#nosotros">Nosotros</a></li>
        </ul>
        <button class="boton-conmutador-menu" id="boton-menu" aria-label="Menú">
            <span></span><span></span><span></span>
        </button>
    </nav>
    `;
  }
}

// Registramos el componente para que el navegador lo reconozca como <site-header>
customElements.define('site-header', SiteHeader);
