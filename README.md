# César Martínez — Portfolio

Sitio personal en Astro, bilingüe (`/` español, `/en/` inglés), con un diseño simple y centrado (inspirado en braydoncoyer.dev): portada con foto, "Sobre mí" en tarjetas, experiencia, proyectos y contacto. Modo claro y oscuro según el sistema.

## Dónde editar

- **Textos (ES y EN):** `src/content.ts`. Regla: no nombrar tecnologías concretas en las descripciones de trabajo.
- **Diseño:** `src/styles/global.css` (colores y fuentes en `:root`, arriba).
- **Estructura:** `src/components/Portfolio.astro`.
- **Imágenes:** `src/assets/` (Astro las optimiza a WebP al compilar).
- **CV:** se edita en `cv/cv-es.html` y `cv/cv-en.html`. Para regenerar los PDF que descarga la web (`public/cv_es.pdf`, `public/cv_en.pdf`):
  `google-chrome --headless=new --no-pdf-header-footer --print-to-pdf=public/cv_es.pdf cv/cv-es.html` (y lo mismo con `en`).
- **Arcade (Kung Fu, No Hay Luz):** la página está en `src/components/ArcadePage.astro` (rutas `/arcade/` y `/en/arcade/`). El juego es una copia de `game.js` del proyecto `platanus-hack-26-venezuela-arcade` en `public/arcade/kungfu/`; para actualizarlo, vuelve a copiar ese archivo.

## Comandos

```bash
pnpm install
pnpm dev        # desarrollo en http://localhost:4321
pnpm build      # genera dist/
pnpm preview    # sirve dist/
```

## Publicación

`.github/workflows/deploy.yml` compila y publica en GitHub Pages en cada push a `main`. Pensado para el repo `CisorM/CisorM.github.io` (https://cisorm.github.io); en el repo hay que elegir **Settings → Pages → Source: GitHub Actions**.
