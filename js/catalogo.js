/* =========================================================================
   catalogo.js - Render del catalogo y agregar al carrito
   The Iron Blade Barbershop | DSY1104
   ========================================================================= */

let filtroActual = 'todos';

/* ---------- Renderiza las cards del catalogo ----------------------------- */
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

  // Enlaza los botones "Agregar"
  document.querySelectorAll('.btn-agregar').forEach(function (btn) {
    btn.addEventListener('click', function () {
      agregarAlCarrito(Number(this.getAttribute('data-id')));
    });
  });
}

/* ---------- Agregar un producto al carrito ------------------------------- */
function agregarAlCarrito(idProducto) {
  const sesion = obtenerSesion();

  // Solo clientes con sesion pueden comprar
  if (!sesion || sesion.rol !== 'usuario') {
    document.getElementById('aviso-invitado').classList.remove('d-none');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }

  const productos = obtenerProductos();
  const producto = productos.find(function (p) { return p.id === idProducto; });
  if (!producto) return;

  let carrito = obtenerCarrito();
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

  // Muestra el toast de confirmacion
  document.getElementById('toast-texto').textContent = producto.nombre + ' agregado al carrito.';
  const toast = new bootstrap.Toast(document.getElementById('toastCarrito'));
  toast.show();
}

/* ---------- Actualiza el contador del carrito en la navbar --------------- */
function actualizarContador() {
  const contador = document.getElementById('contador-carrito');
  if (!contador) return;
  const carrito = obtenerCarrito();
  const total = carrito.reduce(function (suma, item) { return suma + item.cantidad; }, 0);
  contador.textContent = total;
}

/* ---------- Filtros por categoria ---------------------------------------- */
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

/* ---------- Inicio ------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', function () {
  renderizarCatalogo();
  configurarFiltros();
  actualizarContador();
});
