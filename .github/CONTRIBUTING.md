# Guía de Contribución para sardinitasenelmar.com

¡Gracias por tu interés en contribuir a **sardinitasenelmar.com**!

Todas las contribuciones son bienvenidas, desde reportar errores y sugerir nuevas características, hasta mejorar la documentación o enviar código. Esta guía te ayudará a entender el proceso.

## Tabla de Contenidos
1. [¿Cómo puedo contribuir?](#cómo-puedo-contribuir)
   - [Reportar Errores (Bugs)](#reportar-errores-bugs)
   - [Sugerir Mejoras](#sugerir-mejoras)
2. [Flujo de Trabajo](#flujo-de-trabajo)
3. [Guía de Estilo](#guía-de-estilo)
4. [Mensajes de Commit](#mensajes-de-commit)

---

## ¿Cómo puedo contribuir?

### Reportar Errores (Bugs)
Antes de crear un nuevo Issue, por favor, verifica si el error ya ha sido reportado en la sección de Issues del repositorio.

Si encuentras un error no reportado, abre un nuevo Issue e incluye:
* Un título claro y descriptivo.
* Pasos exactos para reproducir el error.
* El comportamiento esperado vs. el comportamiento actual.

### Sugerir Mejoras
Si tienes una idea para mejorar el proyecto, abre un Issue de tipo "Feature Request". Explica detalladamente por qué esta mejora sería útil para la mayoría de los usuarios y, si es posible, sugiere cómo podría implementarse.

---

## Flujo de Trabajo

Para enviar tus cambios al proyecto, sigue este proceso estándar:

1. **Haz un Fork** del repositorio haciendo clic en el botón "Fork" en la parte superior derecha de la página.
2. **Clona tu Fork** en tu máquina local ejecutando:

       git clone <link de tu repositorio>
3. **Añade el repositorio original** como remoto (upstream) para mantenerte actualizado:

       git remote add upstream https://github.com/Aimarr201/sardinitasenelmar.com.git
4. **Crea una nueva rama (branch)** para tu contribución. Usa un nombre descriptivo:

       git checkout -b feature/mi-nueva-funcionalidad
   o para errores:

       git checkout -b fix/solucion-error-tal
5. **Haz tus cambios** en el código.
6. **Prueba tus cambios** asegurándote de que no rompen nada existente:
    - Abre el html en el navegador y compueba que se ve bien tanto en pc como en móvil.
7. **Haz Commit** de tus cambios (ver la sección de Mensajes de Commit abajo):

        git commit -m "feat: añadir nueva página X"
8. **Sube los cambios (Push)** a tu fork:
   **git push origin feature/mi-nueva-funcionalidad**
9. **Abre un Pull Request** en el [repositorio original](https://github.com/Aimarr201/sardinitasenelmar.com.git) desde la pestaña de Pull Requests.

---

## Guía de Estilo
Para mantener un código limpio y consistente, seguimos estas reglas:
* Escribe los nombres de las variables en kebab-case.
* Usa 4 espacios para la indentación, no tabuladores.
* Sin espacios al final de las líneas o en líneas vacías.
* Todos los archivos deben terminar con una línea vacía.

---

## Mensajes de Commit
Tratamos de seguir la convención de Conventional Commits. El mensaje de tu commit debe tener un prefijo claro:

* **feat:** (nuevas características)
* **fix:** (solución de errores)
* **docs:** (cambios en la documentación)
* **style:** (formato, puntos y comas faltantes, etc; sin cambios en el código de producción)
* **refactor:** (refactorización de código en producción)
* **test:** (añadir o refactorizar pruebas)

Ejemplo de mensaje: **feat: añade botón de modo oscuro en la navegación**

## Añadir nueva página

sardinitasenelmar.com es un sitio estático. Esto significa que la forma en la que organizamos las carpetas en el repositorio determina exactamente cómo serán las URLs (enlaces) finales de la página.

Para mantener el diseño consistente en todo el sitio, tenemos una plantilla base preparada. Sigue estos pasos para crear una nueva sección o página:

Paso 1: **Decide el nombre de la URL**

El nombre que le des a tu nueva carpeta será exactamente el nombre que los usuarios verán en el enlace de su navegador.
Usa siempre letras minúsculas, sin tildes ni caracteres especiales, y separa las palabras usando guiones medios (nunca espacios ni caracteres especiales).

Paso 2: **Crea la carpeta**

Dentro de tu entorno local (una vez hayas hecho tu rama de trabajo), ve a la carpeta principal del proyecto y crea el nuevo directorio con el nombre que decidiste en el Paso 1.

Paso 3: **Copia los archivos de la plantilla**

En la raíz del proyecto encontrarás una carpeta llamada *templates* que contiene la estructura básica que debe tener toda nueva página.

    Entra a la carpeta templates.

    Copia el archivo index.html.

    Pega el archivo dentro de la nueva carpeta que creaste en el Paso 2.

Paso 4: **Renombra y enlaza los archivos**

Para que el navegador reconozca tu página automáticamente al entrar a esa carpeta, debes renombrar el archivo principal:

    Renombra template.html y cámbiale el nombre a index.html.

    Si quieres que el contenido de tu página tenga estilos o scripts personalizados, separa el css y/o el js en archivos independientes, que deben llamarse como la página que estás creando: .css/.js.

Paso 5: **¡Añade tu contenido!**

Ahora ya puedes empezar a modificar tu archivo index.html para añadir lo que quieras y usar tu archivo css para los estilos específicos de esa sección.

Para añadir imágenes, dentro de la carpeta que has creado, crea una carpeta llamada img/ y guarda ahí la imagen (el nombre de las imágenes debe ser siempre descriptivo, en minúsculas y separando palabras por guiones).

Si tienes que cambiar el header, está en `sardinitasenelmar.com/scripts/header.js`.

Paso 6: **Comprueba tus cambios**

Antes de dar por terminados los cambios, comprueba que todo funciona localmente. Para ello te recomiendo usar Python:

    python3 -m http.server 8000

En el navegador abre:

    http://localhost:8000/sardinitasenelmar.com/

Para detener el servidor en la consola donde lo iniciaste, pulsa Ctrl + C.

Recuerda siempre respetar la [Guía de Estilo](#guía-de-estilo) para html y css antes de subir tus cambios y enviar el Pull Request.
