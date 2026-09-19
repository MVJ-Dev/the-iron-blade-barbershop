const CLAVE_SESION = 'ib_sesion';

function iniciarSesion(email, password) {
  const usuarios = obtenerUsuarios();
  const encontrado = usuarios.find(
    (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
  );

  if (!encontrado) {
    return { ok: false, mensaje: 'Correo o contrasena incorrectos.' };
  }

  const sesion = {
    id: encontrado.id,
    nombre: encontrado.nombre,
    email: encontrado.email,
    rol: encontrado.rol
  };
  sessionStorage.setItem(CLAVE_SESION, JSON.stringify(sesion));
  return { ok: true, mensaje: 'Sesion iniciada.', usuario: sesion };
}

function registrarUsuario(nombre, email, password) {
  const usuarios = obtenerUsuarios();

  if (usuarios.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
    return { ok: false, mensaje: 'Ya existe una cuenta con ese correo.' };
  }

  const nuevoId = usuarios.length ? Math.max(...usuarios.map((u) => u.id)) + 1 : 1;
  const nuevo = { id: nuevoId, nombre, email, password, rol: 'usuario' };

  usuarios.push(nuevo);
  guardarUsuarios(usuarios);
  return { ok: true, mensaje: 'Cuenta creada correctamente.', usuario: nuevo };
}

function obtenerSesion() {
  return JSON.parse(sessionStorage.getItem(CLAVE_SESION)) || null;
}

function haySesion() {
  return obtenerSesion() !== null;
}

function esAdmin() {
  const sesion = obtenerSesion();
  return sesion !== null && sesion.rol === 'admin';
}

function cerrarSesion() {
  sessionStorage.removeItem(CLAVE_SESION);
  window.location.href = 'index.html';
}

function protegerPagina(rolRequerido) {
  const sesion = obtenerSesion();

  if (!sesion) {
    alert('Debes iniciar sesion para acceder a esta seccion.');
    window.location.href = 'login.html';
    return false;
  }

  if (rolRequerido === 'admin' && sesion.rol !== 'admin') {
    alert('Acceso restringido: solo el administrador puede entrar aqui.');
    window.location.href = 'index.html';
    return false;
  }

  return true;
}

function actualizarNavbar() {
  const sesion = obtenerSesion();

  const navLogin      = document.getElementById('nav-login');
  const navAdmin      = document.getElementById('nav-admin');
  const navCarrito    = document.getElementById('nav-carrito');
  const navUsuario    = document.getElementById('nav-usuario');
  const navCerrar     = document.getElementById('nav-cerrar');
  const nombreUsuario = document.getElementById('nombre-usuario');

  if (sesion) {
    if (navLogin)   navLogin.classList.add('d-none');
    if (navCerrar)  navCerrar.classList.remove('d-none');
    if (navUsuario) navUsuario.classList.remove('d-none');
    if (nombreUsuario) {
      nombreUsuario.textContent = sesion.nombre + ' (' + sesion.rol + ')';
    }
    if (navAdmin) {
      sesion.rol === 'admin'
        ? navAdmin.classList.remove('d-none')
        : navAdmin.classList.add('d-none');
    }
    if (navCarrito) {
      sesion.rol === 'usuario'
        ? navCarrito.classList.remove('d-none')
        : navCarrito.classList.add('d-none');
    }
  } else {
    if (navLogin)    navLogin.classList.remove('d-none');
    if (navCerrar)   navCerrar.classList.add('d-none');
    if (navUsuario)  navUsuario.classList.add('d-none');
    if (navAdmin)    navAdmin.classList.add('d-none');
    if (navCarrito)  navCarrito.classList.add('d-none');
  }
}

if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', function () {
    actualizarNavbar();
    const btnCerrar = document.getElementById('nav-cerrar');
    if (btnCerrar) {
      btnCerrar.addEventListener('click', function (e) {
        e.preventDefault();
        cerrarSesion();
      });
    }
  });
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    CLAVE_SESION,
    iniciarSesion, registrarUsuario,
    obtenerSesion, haySesion, esAdmin, cerrarSesion
  };
}
