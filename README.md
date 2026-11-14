# El Adviento de Nori ✨

Calendario de Adviento web interactivo personalizado para **Nora (Nori)**, programado para entregarse como experiencia móvil y escritorio.

## Datos configurados
- **Clave de entrada:** `0207`
- **Código de Modo Creador:** `VICENT` (permite abrir cualquier puerta antes del 1 de diciembre para probarlo)
- **WhatsApp para canjear vales:** `34626661315`
- **Código secreto del Día 24:** `NORITA` (se forma con las letras doradas de los días 4, 8, 12, 16, 20 y 23)

## Cómo personalizar fotos, textos y el regalo del Día 24
1. **Fotos propias:** Copia tus fotos en `assets/photos/` con los nombres `dia-1.jpg`, `dia-6.jpg`, `dia-9.jpg`, `dia-13.jpg`, `dia-17.jpg`, `dia-19.jpg` y `dia-22.jpg`. Si falta alguna foto, la app muestra automáticamente una ilustración navideña a medida.
2. **Audios opcionales:** Si quieres añadir notas de voz o canciones en MP3 en las Polaroids, guárdalas en `assets/audio/` (`dia-1.mp3`, `dia-6.mp3`, etc.).
3. **Textos / Regalo del Día 24:** Edita `js/config.js` (propiedad `physicalGiftInstruction` dentro de `CONFIG`, o cualquier día en `DAYS_DATA`).

## Cómo probarlo en local ahora mismo
Como usa módulos ES (`type="module"`), ábrelo mediante un servidor local sencillo:

```powershell
cd C:\Users\User\.gemini\antigravity\scratch\calendario-adviento-nora
npx serve .
```
(O con Python: `python -m http.server 8080`, y abrir `http://localhost:8080`).

## Cómo subirlo gratis a internet para enviárselo a Nori
1. **Netlify Drop (1 minuto, sin configurar nada):** Entra en [app.netlify.com/drop](https://app.netlify.com/drop) y arrastra la carpeta `calendario-adviento-nora` entera. Te dará un enlace privado HTTPS listo para abrir desde su móvil y guardarlo en pantalla de inicio.
2. **GitHub Pages / Vercel:** Sube la carpeta a un repositorio de GitHub y activa Pages o conéctalo a Vercel.

## Tests
```powershell
npm test
```
