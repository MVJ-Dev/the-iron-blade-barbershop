# The Iron Blade Barbershop

Sitio web de una barbería (tienda online) desarrollado como **Evaluación Parcial N°1** de la asignatura **DSY1104 - Desarrollo Fullstack II**.

Proyecto **frontend** construido con **HTML5, CSS3, Bootstrap 5 y JavaScript** puro. La información se persiste en el navegador mediante **LocalStorage** y **SessionStorage** (no requiere backend ni base de datos).

## Integrantes

- **Nelson Carrasco**
- **Mathias Von Jentschyk**

## Tecnologías utilizadas

| Tecnología | Uso |
|---|---|
| HTML5 | Estructura semántica (`header`, `nav`, `main`, `section`, `article`, `footer`) |
| CSS3 | Hoja de estilos externa personalizada (`css/styles.css`) |
| Bootstrap 5 | Grid responsivo, navbar, cards, carrusel, modales (vía CDN) |
| Bootstrap Icons | Iconografía |
| JavaScript (ES6) | Validaciones, login por rol, CRUD, carrito |
| LocalStorage | Persistencia de usuarios, productos y carrito |
| SessionStorage | Sesión del usuario activo |

## Estructura del proyecto

```
the-iron-blade/
├── index.html          # Home: hero, carrusel, servicios, video, sobre nosotros
├── catalogo.html       # Catálogo de servicios y productos (cards)
├── login.html          # Inicio de sesión (admin / usuario)
├── registro.html       # Registro de nuevos usuarios
├── carrito.html        # Carrito de compras (solo usuario)
├── admin.html          # Mantenedor CRUD de usuarios y productos (solo admin)
├── contacto.html       # Formulario de reserva + mapa embebido
├── css/
│   └── styles.css      # CSS externo personalizado
├── js/
│   ├── data.js         # Datos iniciales (seed) en LocalStorage
│   ├── auth.js         # Autenticación, sesión y roles
│   ├── validaciones.js # Validaciones de formularios (JS)
│   ├── catalogo.js     # Render del catálogo y agregar al carrito
│   ├── carrito.js      # Lógica del carrito
│   └── admin.js        # CRUD de usuarios y productos
├── docs/
│   └── ERS_The_Iron_Blade_v1.md  # Especificación de Requisitos del Software
└── README.md
```

## Cómo ejecutar

No requiere instalación ni servidor backend. Opciones:

1. **Abrir directamente:** abre `index.html` en el navegador.
2. **Servidor local (recomendado):** desde la carpeta del proyecto ejecuta:
   ```bash
   python3 -m http.server 8000
   ```
   y visita `http://localhost:8000`.

## Cuentas de prueba

| Rol | Correo | Contraseña |
|---|---|---|
| Administrador | `admin@ironblade.cl` | `admin123` |
| Usuario | `usuario@ironblade.cl` | `user123` |

## Funcionalidades

- **Login por rol** (administrador / usuario) con redirección según perfil.
- **Registro de usuarios** con validaciones en JavaScript.
- **Catálogo de productos y servicios** en formato de cards, con filtro por categoría.
- **Carrito de compras** (solo usuarios) con persistencia en LocalStorage.
- **Mantenedor (CRUD)** de usuarios y productos, exclusivo para administradores.
- **Formulario de reserva** con validaciones y mensajes de error personalizados.
- **Video embebido**, carrusel de imágenes, navbar responsiva y footer informativo.

## Componentes de interfaz incluidos

Navbar · Cards · Formularios · Carrusel de imágenes · Botones · Footer · Modales · Tablas · Toasts.

---

Proyecto académico — Duoc UC, DSY1104 Desarrollo Fullstack II, 2025.
