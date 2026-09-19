let filtroActual = 'todos';

function renderizarCatalogo() {
  const grilla = document.getElementById('grilla-catalogo');
  const productos = obtenerProductos();
  grilla.innerHTML = '';

  const filtrados = productos.filter(function (p) {
    return filtroActual === 'todos' || p.categoria === filtroActual;
  });

  if (filtrados.length === 0) {
    grilla.innerHTML = '<p class="text-center text-secondary">No hay elementos en esta categoria.</p>';
    return;
  }

  filtrados.forEach(function (p) {
    const col = document.createElement('div');
    col.className = 'col-lg-3 col-md-4 col-sm-6';
    col.innerHTML =
      '<article class="card-iron">' +
        '<img src="' + p.imagen + '" alt="' + p.nombre + '">' +
        '<div class="card-body">' +
          '<span class="badge-categoria">' + p.categoria + '</span>' +
          '<h3 class="card-title mt-2">' + p.nombre + '</h3>' +
          '<p class="card-text">' + p.descripcion + '</p>' +
          '<div class="d-flex justify-content-between align-items-center mt-3">' +
            '<span class="precio">' + formatearPrecio(p.precio) + '</span>' +
            '<button class="btn btn-iron btn-sm btn-agregar" data-id="' + p.id + '">' +
              '<i class="bi bi-cart-plus"></i> Agregar' +
            '</button>' +
          '</div>' +
        '</div>' +
      '</article>';
    grilla.appendChild(col);
  });

  document.querySelectorAll('.btn-agregar').forEach(function (btn) {
    btn.addEventListener('click', function () {
      agregarAlCarrito(Number(this.getAttribute('data-id')));
    });
  });
}

function agregarAlCarrito(idProducto) {
  const sesion = obtenerSesion();

  if (!sesion || sesion.rol !== 'usuario') {
    document.getElementById('aviso-invitado').classList.remove('d-none');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }

  const producto = obtenerProductos().find(function (p) { return p.id === idProducto; });
  if (!producto) return;

  const carrito = obtenerCarrito();
  const existente = carrito.find(function (item) { return item.id === idProducto; });

  if (existente) {
    existente.cantidad += 1;
  } else {
    carrito.push({
      id: producto.id,
      nombre: producto.nombre,
      precio: producto.precio,
      imagen: producto.imagen,
      categoria: producto.categoria,
      cantidad: 1
    });
  }

  guardarCarrito(carrito);
  actualizarContador();

  document.getElementById('toast-texto').textContent = producto.nombre + ' agregado al carrito.';
  new bootstrap.Toast(document.getElementById('toastCarrito')).show();
}

function actualizarContador() {
  const contador = document.getElementById('contador-carrito');
  if (!contador) return;
  const carrito = obtenerCarrito();
  contador.textContent = carrito.reduce(function (suma, item) { return suma + item.cantidad; }, 0);
}

function configurarFiltros() {
  document.querySelectorAll('.filtro-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      document.querySelectorAll('.filtro-btn').forEach(function (b) { b.classList.remove('activo'); });
      this.classList.add('activo');
      filtroActual = this.getAttribute('data-filtro');
      renderizarCatalogo();
    });
  });
}

document.addEventListener('DOMContentLoaded', function () {
  renderizarCatalogo();
  configurarFiltros();
  actualizarContador();
});
