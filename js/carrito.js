protegerPagina('usuario');

function renderizarCarrito() {
  const carrito = obtenerCarrito();
  const lista = document.getElementById('lista-carrito');
  const vacio = document.getElementById('carrito-vacio');
  const resumen = document.getElementById('resumen-carrito');

  lista.innerHTML = '';

  if (carrito.length === 0) {
    vacio.classList.remove('d-none');
    resumen.classList.add('d-none');
    actualizarContador();
    return;
  }

  vacio.classList.add('d-none');
  resumen.classList.remove('d-none');

  carrito.forEach(function (item) {
    const subtotal = item.precio * item.cantidad;
    const div = document.createElement('div');
    div.className = 'item-carrito';
    div.innerHTML =
      '<img src="' + item.imagen + '" alt="' + item.nombre + '">' +
      '<div class="flex-grow-1">' +
        '<h4 class="h6 mb-1">' + item.nombre + '</h4>' +
        '<small class="text-secondary">' + formatearPrecio(item.precio) + ' c/u</small>' +
        '<div class="mt-2 d-flex align-items-center gap-2">' +
          '<button class="btn btn-iron-outline btn-sm btn-menos" data-id="' + item.id + '">-</button>' +
          '<span>' + item.cantidad + '</span>' +
          '<button class="btn btn-iron-outline btn-sm btn-mas" data-id="' + item.id + '">+</button>' +
        '</div>' +
      '</div>' +
      '<div class="text-end">' +
        '<span class="precio">' + formatearPrecio(subtotal) + '</span><br>' +
        '<button class="btn btn-sm text-danger btn-eliminar mt-2" data-id="' + item.id + '">' +
          '<i class="bi bi-trash"></i> Quitar' +
        '</button>' +
      '</div>';
    lista.appendChild(div);
  });

  enlazarBotones();
  actualizarResumen();
  actualizarContador();
}

function enlazarBotones() {
  document.querySelectorAll('.btn-mas').forEach(function (b) {
    b.addEventListener('click', function () { cambiarCantidad(Number(this.dataset.id), 1); });
  });
  document.querySelectorAll('.btn-menos').forEach(function (b) {
    b.addEventListener('click', function () { cambiarCantidad(Number(this.dataset.id), -1); });
  });
  document.querySelectorAll('.btn-eliminar').forEach(function (b) {
    b.addEventListener('click', function () { eliminarItem(Number(this.dataset.id)); });
  });
}

function cambiarCantidad(id, delta) {
  let carrito = obtenerCarrito();
  const item = carrito.find(function (i) { return i.id === id; });
  if (!item) return;

  item.cantidad += delta;
  if (item.cantidad <= 0) {
    carrito = carrito.filter(function (i) { return i.id !== id; });
  }
  guardarCarrito(carrito);
  renderizarCarrito();
}

function eliminarItem(id) {
  const carrito = obtenerCarrito().filter(function (i) { return i.id !== id; });
  guardarCarrito(carrito);
  renderizarCarrito();
}

function actualizarResumen() {
  const carrito = obtenerCarrito();
  const cantidad = carrito.reduce(function (s, i) { return s + i.cantidad; }, 0);
  const total = carrito.reduce(function (s, i) { return s + i.precio * i.cantidad; }, 0);
  document.getElementById('resumen-cantidad').textContent = cantidad;
  document.getElementById('resumen-total').textContent = formatearPrecio(total);
}

function actualizarContador() {
  const contador = document.getElementById('contador-carrito');
  if (!contador) return;
  const carrito = obtenerCarrito();
  contador.textContent = carrito.reduce(function (s, i) { return s + i.cantidad; }, 0);
}

document.addEventListener('DOMContentLoaded', function () {
  renderizarCarrito();

  document.getElementById('btn-pagar').addEventListener('click', function () {
    const carrito = obtenerCarrito();
    if (carrito.length === 0) return;
    const total = carrito.reduce(function (s, i) { return s + i.precio * i.cantidad; }, 0);
    alert('Compra realizada con exito!\nTotal pagado: ' + formatearPrecio(total) + '\nGracias por preferir The Iron Blade.');
    guardarCarrito([]);
    renderizarCarrito();
  });

  document.getElementById('btn-vaciar').addEventListener('click', function () {
    if (confirm('Seguro que deseas vaciar el carrito?')) {
      guardarCarrito([]);
      renderizarCarrito();
    }
  });
});
