protegerPagina('admin');

let modalProducto, modalUsuario;

function renderizarTablaProductos() {
  const tbody = document.getElementById('tabla-productos');
  const productos = obtenerProductos();
  tbody.innerHTML = '';

  if (productos.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5" class="text-center text-secondary">No hay productos registrados.</td></tr>';
    return;
  }

  productos.forEach(function (p) {
    const tr = document.createElement('tr');
    tr.innerHTML =
      '<td>' + p.id + '</td>' +
      '<td>' + p.nombre + '</td>' +
      '<td><span class="badge-categoria">' + p.categoria + '</span></td>' +
      '<td>' + formatearPrecio(p.precio) + '</td>' +
      '<td class="text-end">' +
        '<button class="btn btn-sm btn-iron-outline me-1" onclick="editarProducto(' + p.id + ')"><i class="bi bi-pencil"></i></button>' +
        '<button class="btn btn-sm btn-outline-danger" onclick="eliminarProducto(' + p.id + ')"><i class="bi bi-trash"></i></button>' +
      '</td>';
    tbody.appendChild(tr);
  });
}

function prepararNuevoProducto() {
  document.getElementById('formProducto').reset();
  document.getElementById('producto-id').value = '';
  document.getElementById('titulo-modal-producto').textContent = 'Nuevo producto';
  limpiarErrores(['producto-nombre', 'producto-categoria', 'producto-precio', 'producto-descripcion']);
}

function editarProducto(id) {
  const producto = obtenerProductos().find(function (p) { return p.id === id; });
  if (!producto) return;

  document.getElementById('producto-id').value = producto.id;
  document.getElementById('producto-nombre').value = producto.nombre;
  document.getElementById('producto-categoria').value = producto.categoria;
  document.getElementById('producto-precio').value = producto.precio;
  document.getElementById('producto-descripcion').value = producto.descripcion;
  document.getElementById('producto-imagen').value = producto.imagen;
  document.getElementById('titulo-modal-producto').textContent = 'Editar producto';
  limpiarErrores(['producto-nombre', 'producto-categoria', 'producto-precio', 'producto-descripcion']);

  modalProducto.show();
}

function eliminarProducto(id) {
  if (!confirm('Seguro que deseas eliminar este producto?')) return;
  const productos = obtenerProductos().filter(function (p) { return p.id !== id; });
  guardarProductos(productos);
  renderizarTablaProductos();
}

function guardarProducto(e) {
  e.preventDefault();

  const okNombre = validarTextoRequerido('producto-nombre', 'nombre', 3);
  const okCat    = validarSelect('producto-categoria', 'una categoria');
  const okPrecio = validarNumeroPositivo('producto-precio', 'precio');
  const okDesc   = validarTextoRequerido('producto-descripcion', 'descripcion', 5);
  if (!(okNombre && okCat && okPrecio && okDesc)) return;

  const productos = obtenerProductos();
  const id = document.getElementById('producto-id').value;
  const imagen = document.getElementById('producto-imagen').value.trim() ||
    'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=600&q=80';

  const datos = {
    nombre: document.getElementById('producto-nombre').value.trim(),
    categoria: document.getElementById('producto-categoria').value,
    precio: Number(document.getElementById('producto-precio').value),
    descripcion: document.getElementById('producto-descripcion').value.trim(),
    imagen: imagen
  };

  if (id === '') {
    datos.id = productos.length ? Math.max.apply(null, productos.map(function (p) { return p.id; })) + 1 : 1;
    productos.push(datos);
  } else {
    datos.id = Number(id);
    productos[productos.findIndex(function (p) { return p.id === Number(id); })] = datos;
  }

  guardarProductos(productos);
  renderizarTablaProductos();
  modalProducto.hide();
}

function renderizarTablaUsuarios() {
  const tbody = document.getElementById('tabla-usuarios');
  const usuarios = obtenerUsuarios();
  tbody.innerHTML = '';

  if (usuarios.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5" class="text-center text-secondary">No hay usuarios registrados.</td></tr>';
    return;
  }

  usuarios.forEach(function (u) {
    const tr = document.createElement('tr');
    tr.innerHTML =
      '<td>' + u.id + '</td>' +
      '<td>' + u.nombre + '</td>' +
      '<td>' + u.email + '</td>' +
      '<td><span class="badge-rol">' + u.rol + '</span></td>' +
      '<td class="text-end">' +
        '<button class="btn btn-sm btn-iron-outline me-1" onclick="editarUsuario(' + u.id + ')"><i class="bi bi-pencil"></i></button>' +
        '<button class="btn btn-sm btn-outline-danger" onclick="eliminarUsuario(' + u.id + ')"><i class="bi bi-trash"></i></button>' +
      '</td>';
    tbody.appendChild(tr);
  });
}

function prepararNuevoUsuario() {
  document.getElementById('formUsuario').reset();
  document.getElementById('usuario-id').value = '';
  document.getElementById('titulo-modal-usuario').textContent = 'Nuevo usuario';
  limpiarErrores(['usuario-nombre', 'usuario-email', 'usuario-password', 'usuario-rol']);
}

function editarUsuario(id) {
  const usuario = obtenerUsuarios().find(function (u) { return u.id === id; });
  if (!usuario) return;

  document.getElementById('usuario-id').value = usuario.id;
  document.getElementById('usuario-nombre').value = usuario.nombre;
  document.getElementById('usuario-email').value = usuario.email;
  document.getElementById('usuario-password').value = usuario.password;
  document.getElementById('usuario-rol').value = usuario.rol;
  document.getElementById('titulo-modal-usuario').textContent = 'Editar usuario';
  limpiarErrores(['usuario-nombre', 'usuario-email', 'usuario-password', 'usuario-rol']);

  modalUsuario.show();
}

function eliminarUsuario(id) {
  const sesion = obtenerSesion();
  if (sesion && sesion.id === id) {
    alert('No puedes eliminar el usuario con el que tienes la sesion iniciada.');
    return;
  }
  if (!confirm('Seguro que deseas eliminar este usuario?')) return;
  const usuarios = obtenerUsuarios().filter(function (u) { return u.id !== id; });
  guardarUsuarios(usuarios);
  renderizarTablaUsuarios();
}

function guardarUsuario(e) {
  e.preventDefault();

  const okNombre = validarNombre('usuario-nombre');
  const okEmail  = validarEmail('usuario-email');
  const okPass   = validarPassword('usuario-password');
  const okRol    = validarSelect('usuario-rol', 'un rol');
  if (!(okNombre && okEmail && okPass && okRol)) return;

  const usuarios = obtenerUsuarios();
  const id = document.getElementById('usuario-id').value;
  const email = document.getElementById('usuario-email').value.trim();

  const duplicado = usuarios.some(function (u) {
    return u.email.toLowerCase() === email.toLowerCase() && u.id !== Number(id);
  });
  if (duplicado) {
    mostrarError('usuario-email', 'Ya existe otro usuario con ese correo.');
    return;
  }

  const datos = {
    nombre: document.getElementById('usuario-nombre').value.trim(),
    email: email,
    password: document.getElementById('usuario-password').value,
    rol: document.getElementById('usuario-rol').value
  };

  if (id === '') {
    datos.id = usuarios.length ? Math.max.apply(null, usuarios.map(function (u) { return u.id; })) + 1 : 1;
    usuarios.push(datos);
  } else {
    datos.id = Number(id);
    usuarios[usuarios.findIndex(function (u) { return u.id === Number(id); })] = datos;
  }

  guardarUsuarios(usuarios);
  renderizarTablaUsuarios();
  modalUsuario.hide();
}

function limpiarErrores(campos) {
  campos.forEach(function (idCampo) {
    const campo = document.getElementById(idCampo);
    const span = document.getElementById('error-' + idCampo);
    if (campo) campo.classList.remove('input-invalido', 'input-valido');
    if (span) span.textContent = '';
  });
}

document.addEventListener('DOMContentLoaded', function () {
  modalProducto = new bootstrap.Modal(document.getElementById('modalProducto'));
  modalUsuario  = new bootstrap.Modal(document.getElementById('modalUsuario'));

  renderizarTablaProductos();
  renderizarTablaUsuarios();

  document.getElementById('formProducto').addEventListener('submit', guardarProducto);
  document.getElementById('formUsuario').addEventListener('submit', guardarUsuario);
});
