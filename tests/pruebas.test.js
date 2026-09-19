const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const JS_DIR = path.join(__dirname, '..', 'js');

/* ---------- Stubs de almacenamiento del navegador ------------------------ */
function crearStorage() {
  let datos = {};
  return {
    getItem: (k) => (k in datos ? datos[k] : null),
    setItem: (k, v) => { datos[k] = String(v); },
    removeItem: (k) => { delete datos[k]; },
    clear: () => { datos = {}; }
  };
}

/* ---------- Stub minimo de un campo <input> y su span de error ----------- */
function crearCampo(valor) {
  return {
    value: valor,
    _clases: new Set(),
    classList: {
      add(c) { this.owner._clases.add(c); },
      remove(c) { this.owner._clases.delete(c); }
    }
  };
}

/* ---------- Construye un contexto de navegador simulado ------------------ */
/* campos: objeto { idCampo: valorString } para los inputs que el test use */
function crearContexto(campos = {}) {
  const elementos = {};

  // Crea el input y su span de error asociado (id "error-<id>")
  for (const [id, valor] of Object.entries(campos)) {
    const campo = crearCampo(valor);
    campo.classList.owner = campo;
    elementos[id] = campo;
    elementos['error-' + id] = { textContent: '' };
  }

  const documentStub = {
    getElementById: (id) => elementos[id] || null,
    addEventListener: () => {},
    querySelectorAll: () => []
  };

  const contexto = {
    localStorage: crearStorage(),
    sessionStorage: crearStorage(),
    document: documentStub,
    window: {},
    alert: () => {},
    console: console,
    module: { exports: {} },
    _elementos: elementos
  };
  contexto.globalThis = contexto;
  vm.createContext(contexto);
  return contexto;
}

/* ---------- Carga uno o varios archivos js/ en el contexto --------------- */
function cargar(contexto, ...archivos) {
  for (const nombre of archivos) {
    const codigo = fs.readFileSync(path.join(JS_DIR, nombre), 'utf8');
    vm.runInContext(codigo, contexto, { filename: nombre });
  }
}

/* DATA.JS - Inicializacion y helpers */
test('data.js: la inicializacion carga usuarios, productos y carrito', () => {
  const ctx = crearContexto();
  cargar(ctx, 'data.js');
  const usuarios = ctx.obtenerUsuarios();
  const productos = ctx.obtenerProductos();
  const carrito = ctx.obtenerCarrito();

  assert.ok(usuarios.length >= 2, 'debe haber al menos 2 usuarios seed');
  assert.ok(productos.length >= 1, 'debe haber productos seed');
  assert.strictEqual(carrito.length, 0, 'el carrito inicia vacio');
});

test('data.js: existe un admin y un usuario en el seed', () => {
  const ctx = crearContexto();
  cargar(ctx, 'data.js');
  const usuarios = ctx.obtenerUsuarios();
  assert.ok(usuarios.some(u => u.rol === 'admin'), 'debe existir un admin');
  assert.ok(usuarios.some(u => u.rol === 'usuario'), 'debe existir un usuario');
});

test('data.js: formatearPrecio da formato CLP', () => {
  const ctx = crearContexto();
  cargar(ctx, 'data.js');
  const texto = ctx.formatearPrecio(12000);
  assert.ok(texto.startsWith('$'), 'debe empezar con $');
  assert.ok(/12.?000/.test(texto), 'debe contener el numero 12000 con separador');
});

test('data.js: guardar y obtener productos persiste en localStorage', () => {
  const ctx = crearContexto();
  cargar(ctx, 'data.js');
  const nuevos = [{ id: 99, nombre: 'Test', categoria: 'Producto', precio: 100, descripcion: 'x', imagen: 'x' }];
  ctx.guardarProductos(nuevos);
  const guardados = ctx.obtenerProductos();
  assert.strictEqual(guardados.length, 1);
  assert.strictEqual(guardados[0].id, 99);
  assert.strictEqual(guardados[0].nombre, 'Test');
  assert.strictEqual(guardados[0].precio, 100);
});

/* AUTH.JS - Login, registro, roles y sesion */
test('auth.js: login correcto con admin del seed', () => {
  const ctx = crearContexto();
  cargar(ctx, 'data.js', 'auth.js');
  const r = ctx.iniciarSesion('admin@ironblade.cl', 'admin123');
  assert.strictEqual(r.ok, true);
  assert.strictEqual(r.usuario.rol, 'admin');
});

test('auth.js: login con contrasena incorrecta falla', () => {
  const ctx = crearContexto();
  cargar(ctx, 'data.js', 'auth.js');
  const r = ctx.iniciarSesion('admin@ironblade.cl', 'clave-mala');
  assert.strictEqual(r.ok, false);
  assert.ok(r.mensaje.length > 0, 'debe entregar un mensaje de error');
});

test('auth.js: login con correo inexistente falla', () => {
  const ctx = crearContexto();
  cargar(ctx, 'data.js', 'auth.js');
  const r = ctx.iniciarSesion('nadie@x.cl', 'algo123');
  assert.strictEqual(r.ok, false);
});

test('auth.js: registro crea un usuario nuevo con rol usuario', () => {
  const ctx = crearContexto();
  cargar(ctx, 'data.js', 'auth.js');
  const r = ctx.registrarUsuario('Pedro Soto', 'pedro@correo.cl', 'clave123');
  assert.strictEqual(r.ok, true);
  assert.strictEqual(r.usuario.rol, 'usuario');
  assert.ok(ctx.obtenerUsuarios().some(u => u.email === 'pedro@correo.cl'));
});

test('auth.js: registro con correo duplicado falla', () => {
  const ctx = crearContexto();
  cargar(ctx, 'data.js', 'auth.js');
  const r = ctx.registrarUsuario('Otro', 'admin@ironblade.cl', 'clave123');
  assert.strictEqual(r.ok, false);
});

test('auth.js: sesion y esAdmin funcionan tras iniciar sesion', () => {
  const ctx = crearContexto();
  cargar(ctx, 'data.js', 'auth.js');
  ctx.iniciarSesion('admin@ironblade.cl', 'admin123');
  assert.strictEqual(ctx.haySesion(), true);
  assert.strictEqual(ctx.esAdmin(), true);
  const sesion = ctx.obtenerSesion();
  assert.strictEqual(sesion.email, 'admin@ironblade.cl');
});

test('auth.js: un usuario normal no es admin', () => {
  const ctx = crearContexto();
  cargar(ctx, 'data.js', 'auth.js');
  ctx.iniciarSesion('usuario@ironblade.cl', 'user123');
  assert.strictEqual(ctx.esAdmin(), false);
});

/* VALIDACIONES.JS - Validaciones de formularios */
test('validaciones.js: email valido e invalido', () => {
  const ctx = crearContexto({ correo: 'juan@correo.cl' });
  cargar(ctx, 'validaciones.js');
  assert.strictEqual(ctx.validarEmail('correo'), true);

  const ctx2 = crearContexto({ correo: 'esto-no-es-email' });
  cargar(ctx2, 'validaciones.js');
  assert.strictEqual(ctx2.validarEmail('correo'), false);
});

test('validaciones.js: password exige letras y numeros y minimo 6', () => {
  const ctxOk = crearContexto({ pass: 'barber123' });
  cargar(ctxOk, 'validaciones.js');
  assert.strictEqual(ctxOk.validarPassword('pass'), true);

  const ctxCorta = crearContexto({ pass: 'ab1' });
  cargar(ctxCorta, 'validaciones.js');
  assert.strictEqual(ctxCorta.validarPassword('pass'), false);

  const ctxSoloLetras = crearContexto({ pass: 'solotexto' });
  cargar(ctxSoloLetras, 'validaciones.js');
  assert.strictEqual(ctxSoloLetras.validarPassword('pass'), false);
});

test('validaciones.js: confirmacion detecta contrasenas distintas', () => {
  const ctx = crearContexto({ pass: 'barber123', conf: 'otra123' });
  cargar(ctx, 'validaciones.js');
  assert.strictEqual(ctx.validarConfirmacion('pass', 'conf'), false);

  const ctx2 = crearContexto({ pass: 'barber123', conf: 'barber123' });
  cargar(ctx2, 'validaciones.js');
  assert.strictEqual(ctx2.validarConfirmacion('pass', 'conf'), true);
});

test('validaciones.js: nombre rechaza vacio y numeros', () => {
  const ctxVacio = crearContexto({ nom: '' });
  cargar(ctxVacio, 'validaciones.js');
  assert.strictEqual(ctxVacio.validarNombre('nom'), false);

  const ctxNum = crearContexto({ nom: 'Juan123' });
  cargar(ctxNum, 'validaciones.js');
  assert.strictEqual(ctxNum.validarNombre('nom'), false);

  const ctxOk = crearContexto({ nom: 'Juan Perez' });
  cargar(ctxOk, 'validaciones.js');
  assert.strictEqual(ctxOk.validarNombre('nom'), true);
});

test('validaciones.js: telefono chileno valido e invalido', () => {
  const ctxOk = crearContexto({ tel: '+56912345678' });
  cargar(ctxOk, 'validaciones.js');
  assert.strictEqual(ctxOk.validarTelefono('tel'), true);

  const ctxMal = crearContexto({ tel: '123' });
  cargar(ctxMal, 'validaciones.js');
  assert.strictEqual(ctxMal.validarTelefono('tel'), false);
});

test('validaciones.js: numero positivo rechaza cero y negativos', () => {
  const ctxCero = crearContexto({ precio: '0' });
  cargar(ctxCero, 'validaciones.js');
  assert.strictEqual(ctxCero.validarNumeroPositivo('precio', 'precio'), false);

  const ctxOk = crearContexto({ precio: '15000' });
  cargar(ctxOk, 'validaciones.js');
  assert.strictEqual(ctxOk.validarNumeroPositivo('precio', 'precio'), true);
});

test('validaciones.js: select obliga a elegir una opcion', () => {
  const ctxVacio = crearContexto({ cat: '' });
  cargar(ctxVacio, 'validaciones.js');
  assert.strictEqual(ctxVacio.validarSelect('cat', 'una categoria'), false);

  const ctxOk = crearContexto({ cat: 'Servicio' });
  cargar(ctxOk, 'validaciones.js');
  assert.strictEqual(ctxOk.validarSelect('cat', 'una categoria'), true);
});

/* SMOKE TEST - Las paginas HTML se levantan y estan bien formadas */
test('paginas HTML: todas existen y tienen scripts + IDs esperados', () => {
  const raiz = path.join(__dirname, '..');
  const paginas = [
    'index.html', 'login.html', 'registro.html', 'catalogo.html',
    'carrito.html', 'admin.html', 'contacto.html'
  ];

  for (const p of paginas) {
    const ruta = path.join(raiz, p);
    assert.ok(fs.existsSync(ruta), p + ' debe existir');
    const html = fs.readFileSync(ruta, 'utf8');
    assert.ok(/<!DOCTYPE html>/i.test(html), p + ' debe tener DOCTYPE');
    assert.ok(html.includes('css/styles.css'), p + ' debe enlazar el CSS externo');
    assert.ok(html.includes('js/data.js'), p + ' debe cargar data.js');
    assert.ok(html.includes('<footer'), p + ' debe tener footer');
  }
});

test('paginas HTML: index usa etiquetas semanticas y video', () => {
  const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
  ['<header', '<nav', '<main', '<section', '<article', '<footer', '<video']
    .forEach(tag => assert.ok(html.includes(tag), 'index.html debe incluir ' + tag));
});
