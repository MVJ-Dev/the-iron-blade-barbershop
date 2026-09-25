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
  if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/.test(valor)) {
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
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor)) {
    mostrarError(idCampo, 'Formato de correo inválido. Sugerencia: nombre@correo.cl');
    return false;
  }
  marcarValido(idCampo);
  return true;
}

function validarPassword(idCampo) {
  const valor = document.getElementById(idCampo).value;
  if (valor === '') {
    mostrarError(idCampo, 'La contraseña es obligatoria.');
    return false;
  }
  if (valor.length < 6) {
    mostrarError(idCampo, 'La contraseña debe tener al menos 6 caracteres.');
    return false;
  }
  if (!/[a-zA-Z]/.test(valor) || !/[0-9]/.test(valor)) {
    mostrarError(idCampo, 'La contraseña debe combinar letras y números. Ej: barber123');
    return false;
  }
  marcarValido(idCampo);
  return true;
}

function validarConfirmacion(idPassword, idConfirmacion) {
  const pass = document.getElementById(idPassword).value;
  const conf = document.getElementById(idConfirmacion).value;
  if (conf === '') {
    mostrarError(idConfirmacion, 'Debes repetir la contraseña.');
    return false;
  }
  if (pass !== conf) {
    mostrarError(idConfirmacion, 'Las contraseñas no coinciden.');
    return false;
  }
  marcarValido(idConfirmacion);
  return true;
}

function validarTelefono(idCampo) {
  const valor = document.getElementById(idCampo).value.trim();
  if (valor === '') {
    mostrarError(idCampo, 'El teléfono es obligatorio. Ej: +56912345678');
    return false;
  }
  if (!/^(\+?56)?\s?9\s?\d{4}\s?\d{4}$/.test(valor)) {
    mostrarError(idCampo, 'Teléfono inválido. Sugerencia: +56912345678 o 912345678');
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
    mostrarError(idCampo, nombreCampo + ' debe ser un número mayor a 0.');
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
  const partes = valor.split('-');
  const fechaSeleccionada = new Date(Number(partes[0]), Number(partes[1]) - 1, Number(partes[2]));
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  if (fechaSeleccionada < hoy) {
    mostrarError(idCampo, 'La fecha no puede ser anterior a hoy.');
    return false;
  }
  marcarValido(idCampo);
  return true;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    mostrarError, marcarValido,
    validarNombre, validarEmail, validarPassword, validarConfirmacion,
    validarTelefono, validarTextoRequerido, validarSelect,
    validarNumeroPositivo, validarFechaFutura
  };
}
