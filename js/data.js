const CLAVE_USUARIOS = 'ib_usuarios';
const CLAVE_PRODUCTOS = 'ib_productos';
const CLAVE_CARRITO = 'ib_carrito';

const USUARIOS_SEED = [
  { id: 1, nombre: 'Administrador', email: 'admin@ironblade.cl', password: 'admin123', rol: 'admin' },
  { id: 2, nombre: 'Cliente Demo', email: 'usuario@ironblade.cl', password: 'user123', rol: 'usuario' }
];

const PRODUCTOS_SEED = [
  {
    id: 1,
    nombre: 'Corte Clásico',
    categoria: 'Servicio',
    precio: 9000,
    descripcion: 'Corte tradicional a tijera y máquina, terminación prolija.',
    imagen: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 2,
    nombre: 'Fade Moderno',
    categoria: 'Servicio',
    precio: 11000,
    descripcion: 'Degradado a máquina con difuminado perfecto y estilo actual.',
    imagen: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 3,
    nombre: 'Corte + Barba',
    categoria: 'Servicio',
    precio: 15000,
    descripcion: 'Combo completo: corte de pelo y perfilado de barba a navaja.',
    imagen: 'https://images.unsplash.com/photo-1621607512214-68297480165e?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 4,
    nombre: 'Afeitado a Navaja',
    categoria: 'Servicio',
    precio: 8000,
    descripcion: 'Afeitado clásico con toalla caliente y navaja tradicional.',
    imagen: 'https://images.unsplash.com/photo-1493256338651-d82f7acb2b38?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 5,
    nombre: 'Pomada Clásica',
    categoria: 'Producto',
    precio: 7990,
    descripcion: 'Pomada de fijación fuerte y acabado brillante, 100 gr.',
    imagen: 'https://images.unsplash.com/photo-1631730486572-226d1f595b68?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 6,
    nombre: 'Aceite para Barba',
    categoria: 'Producto',
    precio: 6490,
    descripcion: 'Aceite hidratante con aroma amaderado, 30 ml.',
    imagen: 'https://images.unsplash.com/photo-1621607512022-6aecc4fed814?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 7,
    nombre: 'Shampoo Sólido',
    categoria: 'Producto',
    precio: 5990,
    descripcion: 'Shampoo natural para cabello y barba, larga duración.',
    imagen: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 8,
    nombre: 'Kit de Afeitado',
    categoria: 'Producto',
    precio: 24990,
    descripcion: 'Set completo: navaja, brocha, jabón y soporte de acero.',
    imagen: 'https://images.unsplash.com/photo-1589710751893-f9a6770ad71b?auto=format&fit=crop&w=600&q=80'
  }
];

function inicializarDatos() {
  if (!localStorage.getItem(CLAVE_USUARIOS)) {
    localStorage.setItem(CLAVE_USUARIOS, JSON.stringify(USUARIOS_SEED));
  }
  if (!localStorage.getItem(CLAVE_PRODUCTOS)) {
    localStorage.setItem(CLAVE_PRODUCTOS, JSON.stringify(PRODUCTOS_SEED));
  }
  if (!localStorage.getItem(CLAVE_CARRITO)) {
    localStorage.setItem(CLAVE_CARRITO, JSON.stringify([]));
  }
}

function obtenerUsuarios() {
  return JSON.parse(localStorage.getItem(CLAVE_USUARIOS)) || [];
}

function guardarUsuarios(usuarios) {
  localStorage.setItem(CLAVE_USUARIOS, JSON.stringify(usuarios));
}

function obtenerProductos() {
  return JSON.parse(localStorage.getItem(CLAVE_PRODUCTOS)) || [];
}

function guardarProductos(productos) {
  localStorage.setItem(CLAVE_PRODUCTOS, JSON.stringify(productos));
}

function obtenerCarrito() {
  return JSON.parse(localStorage.getItem(CLAVE_CARRITO)) || [];
}

function guardarCarrito(carrito) {
  localStorage.setItem(CLAVE_CARRITO, JSON.stringify(carrito));
}

function formatearPrecio(valor) {
  return '$' + valor.toLocaleString('es-CL');
}

inicializarDatos();

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    CLAVE_USUARIOS, CLAVE_PRODUCTOS, CLAVE_CARRITO,
    USUARIOS_SEED, PRODUCTOS_SEED,
    inicializarDatos,
    obtenerUsuarios, guardarUsuarios,
    obtenerProductos, guardarProductos,
    obtenerCarrito, guardarCarrito,
    formatearPrecio
  };
}
