/* =========================================================================
   validaciones.js - Validaciones de formularios en JavaScript
   The Iron Blade Barbershop | DSY1104 - Indicador IE1.2.1
   Validaciones controladas por JS con sugerencias y mensajes de error
   personalizados, mostrados en el contexto de cada campo.
   ========================================================================= */

/* ---------- Utilidades para mostrar/limpiar mensajes --------------------- */
/* Cada campo tiene un <span class="mensaje-error" id="error-<campo>"> */

function mostrarError(idCampo, mensaje) {
  const campo = document.getElementById(idCampo);
  const spanError = document.getElementById('error-' + idCampo);
  if (campo) {
    campo.classList.add('input-invalido');
    campo.classList.remove('input-valido');
  }
  if (spanError) {
    spanError.textContent = mensaje;
  }
}

function marcarValido(idCampo) {
  const campo = document.getElementById(idCampo);
  const spanError = document.getElementById('error-' + idCampo);
  if (campo) {
    campo.classList.add('input-valido');
    campo.classList.remove('input-invalido');
  }
  if (spanError) {
    spanError.textContent = '';
  }
}

/* ---------- Validadores individuales (retornan true/false) --------------- */

function validarNombre(idCampo) {
  const valor = document.getElementById(idCampo).value.trim();
  if (valor === '') {
    mostrarError(idCampo, 'El nombre es obligatorio. Ej: Juan Perez');
    return false;
  }
  if (valor.length < 3) {
    mostrarError(idCampo, 'El nombre debe tener al menos 3 caracteres.');
    return false;
  }
  // Solo letras y espacios (incluye tildes y n)
  const patron = /^[a-zA-ZaeiouAEIOUnNuU\s]+$/;
  if (!patron.test(valor)) {
    mostrarError(idCampo, 'El nombre solo puede contener letras y espacios.');
    return false;
  }
  marcarValido(idCampo);
  return true;
}

function validarEmail(idCampo) {
  const valor = document.getElementById(idCampo).value.trim();
  if (valor === '') {
    mostrarError(idCampo, 'El correo es obligatorio. Ej: nombre@correo.cl');
    return false;
  }
  // Patron de email estandar
  const patron = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!patron.test(valor)) {
    mostrarError(idCampo, 'Formato de correo invalido. Sugerencia: nombre@correo.cl');
    return false;
  }
  marcarValido(idCampo);
  return true;
}

function validarPassword(idCampo) {
  const valor = document.getElementById(idCampo).value;
  if (valor === '') {
    mostrarError(idCampo, 'La contrasena es obligatoria.');
    return false;
  }
  if (valor.length < 6) {
    mostrarError(idCampo, 'La contrasena debe tener al menos 6 caracteres.');
    return false;
  }
  // Debe tener al menos una letra y un numero
  const tieneLetra = /[a-zA-Z]/.test(valor);
  const tieneNumero = /[0-9]/.test(valor);
  if (!tieneLetra || !tieneNumero) {
    mostrarError(idCampo, 'La contrasena debe combinar letras y numeros. Ej: barber123');
    return false;
  }
  marcarValido(idCampo);
  return true;
}

function validarConfirmacion(idPassword, idConfirmacion) {
  const pass = document.getElementById(idPassword).value;
  const conf = document.getElementById(idConfirmacion).value;
  if (conf === '') {
    mostrarError(idConfirmacion, 'Debes repetir la contrasena.');
    return false;
  }
  if (pass !== conf) {
    mostrarError(idConfirmacion, 'Las contrasenas no coinciden.');
    return false;
  }
  marcarValido(idConfirmacion);
  return true;
}

function validarTelefono(idCampo) {
  const valor = document.getElementById(idCampo).value.trim();
  if (valor === '') {
    mostrarError(idCampo, 'El telefono es obligatorio. Ej: +56912345678');
    return false;
  }
  // Acepta +569XXXXXXXX o 9 digitos
  const patron = /^(\+?56)?\s?9\s?\d{4}\s?\d{4}$/;
  if (!patron.test(valor)) {
    mostrarError(idCampo, 'Telefono invalido. Sugerencia: +56912345678 o 912345678');
    return false;
  }
  marcarValido(idCampo);
  return true;
}

function validarTextoRequerido(idCampo, nombreCampo, minimo) {
  const valor = document.getElementById(idCampo).value.trim();
  if (valor === '') {
    mostrarError(idCampo, 'El campo ' + nombreCampo + ' es obligatorio.');
    return false;
  }
  if (minimo && valor.length < minimo) {
    mostrarError(idCampo, nombreCampo + ' debe tener al menos ' + minimo + ' caracteres.');
    return false;
  }
  marcarValido(idCampo);
  return true;
}

function validarSelect(idCampo, nombreCampo) {
  const valor = document.getElementById(idCampo).value;
  if (valor === '' || valor === null) {
    mostrarError(idCampo, 'Debes seleccionar ' + nombreCampo + '.');
    return false;
  }
  marcarValido(idCampo);
  return true;
}

function validarNumeroPositivo(idCampo, nombreCampo) {
  const valor = document.getElementById(idCampo).value;
  if (valor === '') {
    mostrarError(idCampo, 'El campo ' + nombreCampo + ' es obligatorio.');
    return false;
  }
  const numero = Number(valor);
  if (isNaN(numero) || numero <= 0) {
    mostrarError(idCampo, nombreCampo + ' debe ser un numero mayor a 0.');
    return false;
  }
  marcarValido(idCampo);
  return true;
}

function validarFechaFutura(idCampo) {
  const valor = document.getElementById(idCampo).value;
  if (valor === '') {
    mostrarError(idCampo, 'Debes seleccionar una fecha para tu reserva.');
    return false;
  }
  const fechaSeleccionada = new Date(valor);
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  if (fechaSeleccionada < hoy) {
    mostrarError(idCampo, 'La fecha no puede ser anterior a hoy.');
    return false;
  }
  marcarValido(idCampo);
  return true;
}
