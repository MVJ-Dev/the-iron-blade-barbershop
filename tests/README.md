# Pruebas — The Iron Blade Barbershop

Pruebas de la lógica de la aplicación. **No requieren instalar dependencias**: usan el runner integrado de Node (`node:test`), disponible en Node 18+.

## Cómo ejecutar

Desde la raíz del proyecto:

```bash
npm test
```

o directamente:

```bash
node --test tests/*.test.js
```

## Qué se prueba (20 pruebas)

- **data.js** — inicialización del seed (usuarios, productos, carrito), roles del seed, formato de precio CLP, persistencia en LocalStorage.
- **auth.js** — login correcto / contraseña incorrecta / correo inexistente, registro de usuario, correo duplicado, sesión y control de rol (`esAdmin`).
- **validaciones.js** — email, contraseña (largo y complejidad), confirmación de contraseña, nombre, teléfono chileno, número positivo y select obligatorio.
- **Smoke test de páginas** — las 7 páginas HTML existen, tienen DOCTYPE, enlazan el CSS externo, cargan los scripts y tienen footer; `index.html` usa etiquetas semánticas y `<video>`.

Las pruebas cargan los módulos reales de `js/` dentro de un contexto que simula el navegador (stubs de `localStorage`, `sessionStorage` y `document`), por lo que verifican el código de producción sin modificarlo.
