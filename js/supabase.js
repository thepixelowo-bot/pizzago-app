const SUPABASE_URL = 'https://yztzyqprygszjohvhwwp.supabase.co'
const SUPABASE_KEY = 'sb_publishable_JHn5OZguQ80CVBgi2q5Xcg_G561708N'

async function sbFetch(endpoint, options = {}) {
  const url = `${SUPABASE_URL}/rest/v1/${endpoint}`
  const headers = {
    'apikey': SUPABASE_KEY,
    'Authorization': `Bearer ${SUPABASE_KEY}`,
    'Content-Type': 'application/json',
    'Prefer': 'return=representation',
    ...options.headers
  }
  const res = await fetch(url, { ...options, headers })
  if (!res.ok) {
    const err = await res.text()
    throw new Error(err)
  }
  const text = await res.text()
  return text ? JSON.parse(text) : []
}

// ─── CLIENTES ───────────────────────────
async function sbRegistrarCliente(nombre, usuario, password) {
  // Verificar si ya existe
  const existe = await sbFetch(`clientes?correo=eq.${encodeURIComponent(usuario)}&select=id`)
  if (existe.length > 0) throw new Error('El correo ya está registrado')
  const codigo = generarCodigoCupon ? generarCodigoCupon() : 'BIENVEN20'
  const data = await sbFetch('clientes', {
    method: 'POST',
    body: JSON.stringify({
      nombre,
      correo: usuario,
      password,
      cupon: codigo,
      cupon_usado: false
    })
  })
  return { ...data[0], cupon: codigo }
}

async function sbLoginCliente(usuario, password) {
  const data = await sbFetch(`clientes?correo=eq.${encodeURIComponent(usuario)}&password=eq.${encodeURIComponent(password)}&select=*`)
  if (data.length === 0) throw new Error('Usuario o contraseña incorrectos')
  return data[0]
}

// ─── USUARIOS MOSTRADOR ─────────────────
async function sbLoginMostrador(usuario, password) {
  const data = await sbFetch(
    `usuarios_mostrador?or=(correo.eq.${encodeURIComponent(usuario)},empleado_id.eq.${encodeURIComponent(usuario)})&password.eq.${encodeURIComponent(password)}&select=*`
  )
  if (data.length === 0) throw new Error('Usuario o contraseña incorrectos')
  return data[0]
}

// ─── PEDIDOS ────────────────────────────
async function sbCrearPedido(pedido) {
  // Insertar pedido principal
  const data = await sbFetch('pedidos', {
    method: 'POST',
    body: JSON.stringify({
      cliente:            pedido.cliente,
      telefono:           pedido.telefono,
      direccion:          pedido.direccion,
      latitud:            pedido.latitud,
      longitud:           pedido.longitud,
      total:              pedido.total,
      cantidad_productos: pedido.cantidadProductos,
      estado:             'Nuevo',
      descuento:          pedido.descuento || 0,
      nota:               pedido.nota || ''
    })
  })
  const pedidoId = data[0].id

  // Insertar productos
  const productos = pedido.productos.map(p => ({
    pedido_id: pedidoId,
    nombre:    p.nombre,
    precio:    p.precio,
    cantidad:  p.cantidad || 1
  }))
  await sbFetch('pedido_productos', {
    method: 'POST',
    body: JSON.stringify(productos)
  })

  return pedidoId
}

async function sbObtenerPedidos() {
  const pedidos = await sbFetch('pedidos?select=*,pedido_productos(*)&order=fecha.desc')
  return pedidos.map(p => ({
    ...p,
    id:                p.id,
    cliente:           p.cliente,
    telefono:          p.telefono || '—',
    direccion:         p.direccion || '—',
    total:             p.total,
    cantidadProductos: p.cantidad_productos,
    estado:            p.estado,
    fecha:             new Date(p.fecha).toLocaleString(),
    tiempoEstimado:    '30 a 35 minutos',
    productos:         (p.pedido_productos || []).map(pp => ({
      nombre: pp.nombre,
      precio: pp.precio
    }))
  }))
}

async function sbObtenerPedidosPorIds(ids) {
  if (!ids || ids.length === 0) return []
  const filter = ids.map(id => `id.eq.${id}`).join(',')
  const pedidos = await sbFetch(`pedidos?or=(${filter})&select=*,pedido_productos(*)`)
  return pedidos.map(p => ({
    ...p,
    id:                p.id,
    cliente:           p.cliente,
    telefono:          p.telefono || '—',
    direccion:         p.direccion || '—',
    total:             p.total,
    cantidadProductos: p.cantidad_productos,
    estado:            p.estado,
    fecha:             new Date(p.fecha).toLocaleString(),
    tiempoEstimado:    '30 a 35 minutos',
    productos:         (p.pedido_productos || []).map(pp => ({
      nombre: pp.nombre,
      precio: pp.precio
    }))
  }))
}

async function sbCambiarEstado(pedidoId, nuevoEstado) {
  await sbFetch(`pedidos?id=eq.${pedidoId}`, {
    method: 'PATCH',
    body: JSON.stringify({ estado: nuevoEstado })
  })
}

async function sbEliminarPedido(pedidoId) {
  await sbFetch(`pedidos?id=eq.${pedidoId}`, { method: 'DELETE' })
}

async function sbActualizarCliente(id, datos) {
  await sbFetch(`clientes?id=eq.${id}`, {
    method: 'PATCH',
    body: JSON.stringify(datos)
  })
}