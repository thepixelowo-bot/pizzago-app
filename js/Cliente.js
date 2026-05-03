function redir(page) {
  const base = window.location.href.substring(0, window.location.href.lastIndexOf('/') + 1)
  window.location.replace(base + page)
}
let carrito = []
let subtotal = 0

let configuracionPizza = {
  tamano: null,
  precioBase: 0,
  maxIngredientes: 0,
  precioOrilla: 0,
  ingredientes: [],
  orilla: "No"
}

function estaEnHorario() {
  const h = new Date().getHours()
  return h >= 16 && h < 23
}

function mostrarSeccion(id, boton = null) {
  if (id === "carrito") {
    const mensajeHorario = document.getElementById("mensajeHorario")
    if (mensajeHorario) mensajeHorario.style.display = estaEnHorario() ? "none" : "flex"
  }

  const navTabs = document.querySelector(".nav-tabs")
  if (navTabs) navTabs.style.display = id === "bienvenida" ? "none" : "flex"
  document.querySelectorAll(".seccion").forEach(sec => sec.classList.remove("activa"))

  const seccionActiva = document.getElementById(id)
  if (seccionActiva) seccionActiva.classList.add("activa")

  document.querySelectorAll(".tab-btn").forEach(btn => btn.classList.remove("active-tab"))

  if (boton) {
    boton.classList.add("active-tab")
  } else {
    const botonRelacionado = document.querySelector(`[data-seccion="${id}"]`)
    if (botonRelacionado) botonRelacionado.classList.add("active-tab")
  }

  window.scrollTo({ top: 0, behavior: "smooth" })
}

function iniciarConstructorPizza() {
  const radiosTamano = document.querySelectorAll('input[name="tamanoPizza"]')
  const checksIngredientes = document.querySelectorAll('input[name="ingredientePizza"]')
  const radiosOrilla = document.querySelectorAll('input[name="orillaRellena"]')

  radiosTamano.forEach(radio => radio.addEventListener("change", () => configurarTamanoPizza(radio)))
  checksIngredientes.forEach(check => check.addEventListener("change", () => controlarIngredientes()))
  radiosOrilla.forEach(radio => radio.addEventListener("change", () => {
    configuracionPizza.orilla = radio.value
    actualizarResumenPizza()
  }))
}

function configurarTamanoPizza(radioSeleccionado) {
  configuracionPizza.tamano = radioSeleccionado.value
  configuracionPizza.precioBase = Number(radioSeleccionado.dataset.precio)
  configuracionPizza.maxIngredientes = Number(radioSeleccionado.dataset.maxIngredientes)
  configuracionPizza.precioOrilla = Number(radioSeleccionado.dataset.orilla)

  const ingredientesInfo = document.getElementById("ingredientesInfo")
  const orillaInfo = document.getElementById("orillaInfo")
  const orillaPrecioVisual = document.getElementById("orillaPrecioVisual")

  if (ingredientesInfo) ingredientesInfo.textContent = `Puedes seleccionar hasta ${configuracionPizza.maxIngredientes} ingrediente(s) para una pizza ${configuracionPizza.tamano.toLowerCase()}.`
  if (orillaInfo) orillaInfo.textContent = `Orilla rellena para ${configuracionPizza.tamano.toLowerCase()}: +$${configuracionPizza.precioOrilla}`
  if (orillaPrecioVisual) orillaPrecioVisual.textContent = `$${configuracionPizza.precioOrilla}`

  limpiarIngredientesSiEsNecesario()
  actualizarResumenPizza()
}

function limpiarIngredientesSiEsNecesario() {
  const checksIngredientes = document.querySelectorAll('input[name="ingredientePizza"]:checked')
  if (checksIngredientes.length > configuracionPizza.maxIngredientes) {
    checksIngredientes.forEach(check => { check.checked = false })
    configuracionPizza.ingredientes = []
    mostrarMensajePizzaBuilder("Se reiniciaron los ingredientes porque cambiaste el tamaño.")
  }
}

function controlarIngredientes() {
  const checksSeleccionados = [...document.querySelectorAll('input[name="ingredientePizza"]:checked')]

  if (!configuracionPizza.tamano) {
    checksSeleccionados.forEach(check => { check.checked = false })
    mostrarMensajePizzaBuilder("Primero debes seleccionar un tamaño.")
    return
  }

  if (checksSeleccionados.length > configuracionPizza.maxIngredientes) {
    const ultimo = checksSeleccionados[checksSeleccionados.length - 1]
    ultimo.checked = false
    mostrarMensajePizzaBuilder(`Solo puedes seleccionar hasta ${configuracionPizza.maxIngredientes} ingrediente(s) para una pizza ${configuracionPizza.tamano.toLowerCase()}.`)
  }

  configuracionPizza.ingredientes = [...document.querySelectorAll('input[name="ingredientePizza"]:checked')].map(check => check.value)
  actualizarResumenPizza()
}

function actualizarResumenPizza() {
  const resumenTamano = document.getElementById("resumenTamanoPizza")
  const resumenIngredientes = document.getElementById("resumenIngredientesPizza")
  const resumenOrilla = document.getElementById("resumenOrillaPizza")
  const resumenPrecioBase = document.getElementById("resumenPrecioBasePizza")
  const resumenExtraOrilla = document.getElementById("resumenExtraOrillaPizza")
  const resumenTotal = document.getElementById("resumenTotalPizza")

  const extraOrilla = configuracionPizza.orilla === "Si" ? configuracionPizza.precioOrilla : 0
  const totalPizza = configuracionPizza.precioBase + extraOrilla

  if (resumenTamano) resumenTamano.textContent = configuracionPizza.tamano || "No seleccionado"
  if (resumenIngredientes) resumenIngredientes.textContent = configuracionPizza.ingredientes.length > 0 ? configuracionPizza.ingredientes.join(", ") : "No seleccionados"
  if (resumenOrilla) resumenOrilla.textContent = configuracionPizza.orilla === "Si" ? `Sí (+$${configuracionPizza.precioOrilla})` : "No"
  if (resumenPrecioBase) resumenPrecioBase.textContent = configuracionPizza.precioBase || 0
  if (resumenExtraOrilla) resumenExtraOrilla.textContent = extraOrilla
  if (resumenTotal) resumenTotal.textContent = totalPizza
}

function agregarPizzaPersonalizada() {
  if (!configuracionPizza.tamano) { mostrarMensajePizzaBuilder("Selecciona un tamaño de pizza."); return }
  if (configuracionPizza.ingredientes.length === 0) { mostrarMensajePizzaBuilder("Selecciona al menos un ingrediente."); return }
  if (configuracionPizza.ingredientes.length > configuracionPizza.maxIngredientes) {
    mostrarMensajePizzaBuilder(`Has seleccionado demasiados ingredientes para una pizza ${configuracionPizza.tamano.toLowerCase()}.`)
    return
  }

  const extraOrilla = configuracionPizza.orilla === "Si" ? configuracionPizza.precioOrilla : 0
  const totalPizza = configuracionPizza.precioBase + extraOrilla
  const nombrePizza = `Pizza ${configuracionPizza.tamano} - ${configuracionPizza.ingredientes.join(" + ")}${configuracionPizza.orilla === "Si" ? " con orilla rellena" : ""}`

  carrito.push({ nombre: nombrePizza, precio: totalPizza })
  subtotal += totalPizza
  actualizarCarrito()
  mostrarToast("Pizza personalizada agregada al carrito")
  mostrarMensajePizzaBuilder("Pizza agregada correctamente")
  reiniciarConstructorPizza()
}

function reiniciarConstructorPizza() {
  document.querySelectorAll('input[name="tamanoPizza"]').forEach(r => { r.checked = false })
  document.querySelectorAll('input[name="ingredientePizza"]').forEach(c => { c.checked = false })
  document.querySelectorAll('input[name="orillaRellena"]').forEach(r => { r.checked = r.value === "No" })

  configuracionPizza = { tamano: null, precioBase: 0, maxIngredientes: 0, precioOrilla: 0, ingredientes: [], orilla: "No" }

  const ingredientesInfo = document.getElementById("ingredientesInfo")
  const orillaInfo = document.getElementById("orillaInfo")
  const orillaPrecioVisual = document.getElementById("orillaPrecioVisual")
  const mensaje = document.getElementById("mensajePizzaBuilder")

  if (ingredientesInfo) ingredientesInfo.textContent = "Primero elige un tamaño para saber cuántos ingredientes puedes seleccionar"
  if (orillaInfo) orillaInfo.textContent = "Selecciona primero un tamaño"
  if (orillaPrecioVisual) orillaPrecioVisual.textContent = "$0"
  if (mensaje) mensaje.textContent = ""

  actualizarResumenPizza()
}

function mostrarMensajePizzaBuilder(texto) {
  const mensaje = document.getElementById("mensajePizzaBuilder")
  if (!mensaje) return
  mensaje.textContent = texto
  clearTimeout(window.mensajePizzaTimeout)
  window.mensajePizzaTimeout = setTimeout(() => { mensaje.textContent = "" }, 2500)
}

// =====================
// MODAL SESION
// =====================
let _pendingNombre = null
let _pendingPrecio = null

function cerrarModalSesion() {
  document.getElementById('modalSesion').classList.remove('visible')
  if (_pendingNombre !== null) {
    _agregarCarritoDirecto(_pendingNombre, _pendingPrecio)
    _pendingNombre = null
    _pendingPrecio = null
  }
}

function msOverlayClick(e) {
  if (e.target.id === 'modalSesion') cerrarModalSesion()
}

function _agregarCarritoDirecto(nombre, precio) {
  carrito.push({ nombre, precio })
  subtotal += precio
  actualizarCarrito()
  mostrarToast(`${nombre} se agregó al carrito`)
}

function agregarCarrito(nombre, precio) {
  if (!localStorage.getItem("clienteId")) {
    document.getElementById("modalSesion").classList.add("visible")
    return
  }
  _agregarCarritoDirecto(nombre, precio)
}

function actualizarCarrito() {
  const lista = document.getElementById("listaCarrito")
  const carritoVacio = document.getElementById("carritoVacio")
  const subtotalElemento = document.getElementById("subtotal")
  const totalElemento = document.getElementById("total")
  const cantidadProductos = document.getElementById("cantidadProductos")
  const contadorCarrito = document.getElementById("contadorCarrito")
  const resumenCuentaCarrito = document.getElementById("resumenCuentaCarrito")

  if (!lista) return
  lista.innerHTML = ""

  if (carrito.length === 0) {
    if (carritoVacio) { carritoVacio.style.display = "block"; carritoVacio.classList.add("visible") }
  } else {
    if (carritoVacio) { carritoVacio.style.display = "none"; carritoVacio.classList.remove("visible") }
  }

  carrito.forEach((item, index) => {
    const li = document.createElement("li")
    li.innerHTML = `
      <div>
        <div class="cr-item-nombre">${item.nombre}</div>
        <div class="cr-item-sub">Producto agregado a tu pedido</div>
      </div>
      <div class="cr-item-cantidad">
        <button onclick="cambiarCantidadCarrito(${index}, -1)">−</button>
        <span>1</span>
        <button onclick="cambiarCantidadCarrito(${index}, 1)">+</button>
      </div>
      <div style="display:flex;align-items:center;justify-content:space-between;gap:8px">
        <span class="cr-item-precio">$${item.precio}</span>
        <button onclick="eliminarDelCarrito(${index})" style="background:transparent;border:none;color:#ff6b6b;cursor:pointer;font-size:18px;padding:4px" title="Quitar">✕</button>
      </div>`
    lista.appendChild(li)
  })

  if (subtotalElemento) subtotalElemento.textContent = `$${subtotal}`
  const totalConDescuento = aplicarDescuentoCupon ? aplicarDescuentoCupon(subtotal) : subtotal
  if (totalElemento) totalElemento.textContent = `$${totalConDescuento}`
  const descEl = document.getElementById('cuponDescuentoLinea')
  if (descEl) {
    if (totalConDescuento < subtotal) {
      descEl.style.display = 'flex'
      descEl.querySelector('span:last-child').textContent = `-$${subtotal - totalConDescuento}`
    } else {
      descEl.style.display = 'none'
    }
  }
  if (cantidadProductos) cantidadProductos.textContent = carrito.length
  if (contadorCarrito) contadorCarrito.textContent = carrito.length
  if (resumenCuentaCarrito) resumenCuentaCarrito.textContent = carrito.length
  const accesoContador = document.getElementById("accesoContadorCarrito")
  if (accesoContador) accesoContador.textContent = carrito.length === 0 ? "0 productos" : carrito.length + " producto" + (carrito.length > 1 ? "s" : "")
}

function cambiarCantidadCarrito(index, delta) {
  if (delta < 0) eliminarDelCarrito(index)
}

function eliminarDelCarrito(index) {
  if (index < 0 || index >= carrito.length) return
  const productoEliminado = carrito[index]
  subtotal -= productoEliminado.precio
  carrito.splice(index, 1)
  if (subtotal < 0) subtotal = 0
  actualizarCarrito()
  mostrarToast(`${productoEliminado.nombre} fue eliminado del carrito`)
}

function vaciarCarrito() {
  if (carrito.length === 0) { mostrarToast("Tu carrito ya está vacío"); return }
  marcarCuponUsado()
  carrito = []
  subtotal = 0
  actualizarCarrito()
  mostrarToast("Se vació el carrito")
}

function guardarDatosCuenta() {
  const correo = document.getElementById("correoCuenta")
  const telefono = document.getElementById("telefonoCuenta")
  if (correo) localStorage.setItem("correoCliente", correo.value.trim())
  if (telefono) localStorage.setItem("telefonoCliente", telefono.value.trim())
  mostrarToast("Tus datos de cuenta se guardaron correctamente")
}

// =====================
// UBICACION LEGIBLE
// =====================
function obtenerUbicacionActual() {
  if (!navigator.geolocation) { mostrarToast("Tu navegador no permite obtener la ubicación"); return }
  navigator.geolocation.getCurrentPosition(
    async posicion => {
      const latitud = posicion.coords.latitude.toFixed(6)
      const longitud = posicion.coords.longitude.toFixed(6)
      localStorage.setItem("latitudCliente", latitud)
      localStorage.setItem("longitudCliente", longitud)
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitud}&lon=${longitud}&format=json`)
        const data = await res.json()
        const direccionLegible = data.display_name || `Lat: ${latitud}, Lon: ${longitud}`
        localStorage.setItem("direccion", direccionLegible)
        const direccionInput = document.getElementById("direccion")
        const direccionGuardada = document.getElementById("direccionGuardada")
        if (direccionInput) direccionInput.value = direccionLegible
        if (direccionGuardada) direccionGuardada.textContent = "Ubicación guardada: " + direccionLegible
      } catch {
        const fallback = `Lat: ${latitud}, Lon: ${longitud}`
        const direccionInput = document.getElementById("direccion")
        if (direccionInput) direccionInput.value = fallback
      }
      mostrarToast("Ubicación actual obtenida correctamente")
    },
    () => { mostrarToast("No se pudo obtener tu ubicación") }
  )
}

function guardarDireccion() {
  const direccionInput = document.getElementById("direccion")
  const direccionGuardada = document.getElementById("direccionGuardada")
  if (!direccionInput) return
  const direccion = direccionInput.value.trim()
  if (direccion === "") { mostrarToast("Escribe una dirección o usa tu ubicación actual"); return }
  localStorage.setItem("direccion", direccion)
  if (direccionGuardada) direccionGuardada.textContent = "Ubicación guardada: " + direccion
  mostrarToast("Tu ubicación se guardó correctamente")
}

function obtenerPedidosActivosIds() {
  return JSON.parse(localStorage.getItem("pedidosActivosIds")) || []
}

function guardarPedidosActivosIds(ids) {
  localStorage.setItem("pedidosActivosIds", JSON.stringify(ids))
}

// =====================
// NOTIFICACIONES
// =====================
let _notifPermiso = false
let _estadosPedidosAnteriores = {}

async function pedirPermisoNotificaciones() {
  if (!("Notification" in window)) return
  if (Notification.permission === "granted") { _notifPermiso = true; return }
  if (Notification.permission !== "denied") {
    const permiso = await Notification.requestPermission()
    _notifPermiso = permiso === "granted"
  }
}

function enviarNotificacion(estado) {
  const mensajes = {
    "En preparación": { titulo: "👨‍🍳 ¡Tu pedido está en preparación!", cuerpo: "El equipo de PizzaGo está preparando tu orden." },
    "En camino":      { titulo: "🛵 ¡Tu pedido va en camino!",          cuerpo: "El repartidor está llevando tu pizza. ¡Prepárate!" },
    "Entregado":      { titulo: "🏠 ¡Tu pedido fue entregado!",          cuerpo: "Disfruta tu pizza. ¡Gracias por elegirnos!" }
  }
  const info = mensajes[estado]
  if (!info) return

  if (_notifPermiso && Notification.permission === "granted") {
    try {
      new Notification(info.titulo, { body: info.cuerpo, icon: "img/logo.png", tag: "pizzago-" + estado })
    } catch (e) { console.log("Notificación no disponible") }
  }
  mostrarToast(info.titulo)
}

async function mostrarPedidosCliente() {
  const contenedor = document.getElementById("listaPedidosCliente")
  if (!contenedor) return

  const idsActivos = obtenerPedidosActivosIds()
  contenedor.innerHTML = ""

  if (idsActivos.length === 0) {
    contenedor.innerHTML = `<div class="pd-vacio"><div class="pd-vacio-icon">📦</div><h4>Sin pedidos activos</h4><p>Tus pedidos recientes aparecerán aquí.</p></div>`
    return
  }

  let pedidosActivos = []
  try {
    pedidosActivos = await sbObtenerPedidosPorIds(idsActivos)
  } catch (err) { console.error("Error cargando pedidos:", err); return }

  pedidosActivos.reverse().forEach((pedido, idx) => {
    const estados = ["Nuevo", "En preparación", "En camino", "Entregado"]
    const etiquetas = [
      { label: "Recibido", icon: "✅" },
      { label: "En preparación", icon: "👨‍🍳" },
      { label: "En camino", icon: "🛵" },
      { label: "Entregado", icon: "🏠" }
    ]
    const indexActual = estados.indexOf(pedido.estado)
    const estadoLabel = pedido.estado === "Nuevo" ? "Pedido recibido" : pedido.estado

    const productosHtml = pedido.productos.map(p =>
      `<div class="pd-producto-row"><span>${p.nombre}</span><span class="pd-precio">$${p.precio}</span></div>`
    ).join("")

    const barraHtml = etiquetas.map((e, i) => {
      let clase = i < indexActual ? "completado" : i === indexActual ? "activo" : ""
      return `<div class="pd-paso ${clase}"><div class="pd-paso-icon">${e.icon}</div><span>${e.label}</span></div>`
    }).join("")

    const card = document.createElement("div")
    card.className = "pd-card"
    card.innerHTML = `
      <div class="pd-card-header" onclick="pdToggle(this)">
        <div class="pd-card-header-left">
          <span class="pd-badge">${estadoLabel}</span>
          <div>
            <strong class="pd-card-titulo">Pedido #${pedido.id || (idx + 1)}</strong>
            <span class="pd-card-fecha">${pedido.fecha}</span>
          </div>
        </div>
        <div class="pd-card-header-right">
          <strong class="pd-card-total">$${pedido.total}</strong>
          <span class="pd-flecha">▾</span>
        </div>
      </div>
      <div class="pd-card-body">
        <div class="pd-barra">${barraHtml}</div>
        <div class="pd-detalle">
          <div class="pd-detalle-col">
            <p><span>Cliente</span><strong>${pedido.cliente}</strong></p>
            <p><span>Teléfono</span><strong>${pedido.telefono}</strong></p>
            <p><span>Dirección</span><strong>${pedido.direccion}</strong></p>
            <p><span>Tiempo estimado</span><strong>${pedido.tiempoEstimado}</strong></p>
          </div>
          <div class="pd-productos-col">
            <p class="pd-prod-titulo">Productos</p>
            ${productosHtml}
            <div class="pd-prod-total"><span>Total</span><strong>$${pedido.total}</strong></div>
          </div>
        </div>
      </div>`
    contenedor.appendChild(card)
  })
}

function pdToggle(header) {
  const card = header.closest('.pd-card')
  const body = card.querySelector('.pd-card-body')
  const flecha = card.querySelector('.pd-flecha')
  const abierto = card.classList.toggle('pd-abierto')
  body.style.maxHeight = abierto ? body.scrollHeight + 'px' : '0'
  flecha.style.transform = abierto ? 'rotate(180deg)' : 'rotate(0)'
}

async function obtenerEstadoPedidoActual() {
  const idsActivos = obtenerPedidosActivosIds()
  if (idsActivos.length === 0) { mostrarPedidosCliente(); return }
  try {
    const pedidos = await sbObtenerPedidosPorIds(idsActivos)

    // Detectar cambios de estado y notificar
    pedidos.forEach(pedido => {
      const estadoAnterior = _estadosPedidosAnteriores[pedido.id]
      if (estadoAnterior !== undefined && estadoAnterior !== pedido.estado) {
        enviarNotificacion(pedido.estado)
      }
      _estadosPedidosAnteriores[pedido.id] = pedido.estado
    })

    mostrarPedidosCliente()
    ctRenderOrders()
  } catch (err) { console.error("Error obteniendo estado:", err) }
}

function realizarPedido() {
  const horaActual = new Date().getHours()
  if (horaActual < 16 || horaActual >= 23) {
    mostrarToast("⏰ Solo recibimos pedidos de 4:00 PM a 11:00 PM")
    const mensajeHorario = document.getElementById("mensajeHorario")
    if (mensajeHorario) mensajeHorario.style.display = "flex"
    return
  }
  if (carrito.length === 0) { mostrarToast("Agrega productos al carrito antes de realizar tu pedido"); mostrarSeccion("menu"); return }
  if (subtotal < 150) { mostrarToast("El pedido mínimo para envío es de $150"); return }
  const clienteId = localStorage.getItem('clienteId')
  if (!clienteId) { document.getElementById('modalSesion').classList.add('visible'); return }
  const direccionCliente = localStorage.getItem("direccion") || ""
  if (!direccionCliente.trim()) { mostrarToast("Primero guarda tu ubicación en Mi cuenta"); mostrarSeccion("cuenta"); return }
  mostrarModalCupon()
}

function mostrarModalCupon() {
  const raw = localStorage.getItem('cuponBienvenida')
  const cupon = raw ? JSON.parse(raw) : null
  const tieneCuponActivo = cupon && !cupon.usado
  const modal = document.getElementById('modalCuponPedido')
  const cuerpo = document.getElementById('modalCuponCuerpo')

  if (tieneCuponActivo) {
    cuerpo.innerHTML = `
      <p class="mcp-subtitle">¡Tienes un cupón disponible!</p>
      <div class="mcp-ticket">
        <div class="mcp-ticket-left"><small>🎉 Cupón de Bienvenida</small><strong>20% OFF</strong><span>Pizzas Mediana, Grande y Familiar</span></div>
        <div class="mcp-ticket-divider"></div>
        <div class="mcp-ticket-right"><small>Tu código</small><span class="mcp-codigo">${cupon.codigo}</span><span class="mcp-badge-activo">✓ Activo</span></div>
      </div>
      <div class="mcp-opciones">
        <button class="mcp-btn-aplicar" onclick="confirmarConCupon('${cupon.codigo}')">Aplicar y confirmar pedido</button>
        <button class="mcp-btn-sin" onclick="confirmarSinCupon()">Continuar sin cupón</button>
      </div>`
  } else {
    cuerpo.innerHTML = `
      <p class="mcp-subtitle">¿Tienes un código de cupón de la sucursal?</p>
      <div class="mcp-input-row">
        <input type="text" id="mcp-input" placeholder="Ej: A1234BCDE" maxlength="9" class="mcp-input">
        <button class="mcp-btn-verificar" onclick="mcpVerificarCodigo()">Verificar</button>
      </div>
      <p id="mcpMensaje" class="mcp-mensaje"></p>
      <button class="mcp-btn-sin" onclick="confirmarSinCupon()">No tengo cupón, continuar</button>`
  }
  modal.classList.add('visible')
}

function mcpVerificarCodigo() {
  const val = (document.getElementById('mcp-input').value || '').trim().toUpperCase()
  const msg = document.getElementById('mcpMensaje')
  const raw = localStorage.getItem('cuponBienvenida')
  const cupon = raw ? JSON.parse(raw) : null

  if (!val) { msg.textContent = 'Ingresa un código'; msg.className = 'mcp-mensaje err'; return }
  if (!cupon || val !== cupon.codigo) { msg.textContent = 'Código no válido o no encontrado'; msg.className = 'mcp-mensaje err'; return }
  if (cupon.usado) { msg.textContent = 'Este cupón ya fue utilizado'; msg.className = 'mcp-mensaje err'; return }

  msg.textContent = '¡Cupón válido! 20% de descuento aplicado 🎉'
  msg.className = 'mcp-mensaje ok'
  setTimeout(() => confirmarConCupon(val), 900)
}

function confirmarConCupon(codigo) {
  localStorage.setItem('cuponActivo', JSON.stringify({ codigo, descuento: 20, usado: false }))
  document.getElementById('modalCuponPedido').classList.remove('visible')
  _ejecutarPedido()
}

function confirmarSinCupon() {
  document.getElementById('modalCuponPedido').classList.remove('visible')
  _ejecutarPedido()
}

async function _ejecutarPedido() {
  const nombreCliente   = localStorage.getItem("nombreCliente")   || "Cliente"
  const usuarioCliente  = localStorage.getItem("usuarioCliente")  || "-"
  const telefonoCliente = localStorage.getItem("telefonoCliente") || usuarioCliente
  const direccionCliente = localStorage.getItem("direccion")      || ""
  const latitudCliente  = localStorage.getItem("latitudCliente")  || ""
  const longitudCliente = localStorage.getItem("longitudCliente") || ""
  const totalFinal = aplicarDescuentoCupon ? aplicarDescuentoCupon(subtotal) : subtotal

  const pedidoData = {
    cliente: nombreCliente, telefono: telefonoCliente, direccion: direccionCliente,
    latitud: latitudCliente, longitud: longitudCliente, productos: [...carrito],
    cantidadProductos: carrito.length, subtotal, descuento: subtotal - totalFinal, total: totalFinal
  }

  try {
    const pedidoId = await sbCrearPedido(pedidoData)
    const idsActivos = obtenerPedidosActivosIds()
    idsActivos.push(pedidoId)
    guardarPedidosActivosIds(idsActivos)

    // Registrar estado inicial para tracking de notificaciones
    _estadosPedidosAnteriores[pedidoId] = "Nuevo"

    marcarCuponUsado()
    carrito = []
    subtotal = 0
    actualizarCarrito()
    obtenerEstadoPedidoActual()
    mostrarPedidosCliente()
    mostrarToast("Pedido realizado con éxito. Tiempo estimado: 30 a 35 minutos 🍕")
    setTimeout(() => { mostrarSeccion("carrito") }, 400)
  } catch (err) {
    console.error("Error al guardar pedido:", err)
    mostrarToast("Error al realizar el pedido. Intenta de nuevo.")
  }
}

function cerrarSesion() {
  const keys = ['clienteId','nombreCliente','usuarioCliente','correoCliente','telefonoCliente','passwordCliente','clienteRegistrado','direccion','latitudCliente','longitudCliente','cuponBienvenida','cuponActivo','pedidosActivosIds']
  keys.forEach(k => localStorage.removeItem(k))
  redir("inicio.html")
}

function actualizarTopbarSesion() {
  const tieneSesion = !!localStorage.getItem("clienteId")
  const zonaUsuario   = document.getElementById("zonaUsuario")
  const zonaSinSesion = document.getElementById("zonaSinSesion")
  if (zonaUsuario)   zonaUsuario.style.display   = tieneSesion ? "flex" : "none"
  if (zonaSinSesion) zonaSinSesion.style.display = tieneSesion ? "none" : "flex"
}

function mostrarToast(mensaje) {
  const toast = document.getElementById("toast")
  if (!toast) return
  toast.textContent = mensaje
  toast.classList.add("show")
  clearTimeout(window.toastTimeout)
  window.toastTimeout = setTimeout(() => { toast.classList.remove("show") }, 2500)
}

window.addEventListener("storage", e => {
  if (e.key === "pedidosPizzaGo" || e.key === "pedidosActivosIds") {
    obtenerEstadoPedidoActual()
    mostrarPedidosCliente()
  }
})

// =====================
// SESION GOOGLE
// =====================
async function manejarSesionGoogleEnCliente() {
  const hash = window.location.hash
  if (!hash || !hash.includes('access_token')) return

  const params = new URLSearchParams(hash.substring(1))
  const accessToken = params.get('access_token')
  if (!accessToken) return

  try {
    const res = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
      headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${accessToken}` }
    })
    const user = await res.json()
    if (!user || !user.email) return

    const check = await fetch(
      `${SUPABASE_URL}/rest/v1/clientes?correo=eq.${encodeURIComponent(user.email)}&select=*`,
      { headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` } }
    )
    const existe = await check.json()

    let cliente
    if (existe && existe.length > 0) {
      cliente = existe[0]
    } else {
      const nombre = user.user_metadata?.full_name || user.email.split('@')[0]
      const crearRes = await fetch(`${SUPABASE_URL}/rest/v1/clientes`, {
        method: 'POST',
        headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}`, 'Content-Type': 'application/json', 'Prefer': 'return=representation' },
        body: JSON.stringify({ nombre, correo: user.email, password: '', telefono: '', cupon: '', cupon_usado: false })
      })
      const data = await crearRes.json()
      cliente = data[0]
      const codigo = generarCodigoCupon()
      localStorage.setItem('cuponBienvenida', JSON.stringify({ codigo, usado: false, descuento: 20 }))
    }

    localStorage.setItem('clienteId',        cliente.id)
    localStorage.setItem('nombreCliente',    cliente.nombre)
    localStorage.setItem('usuarioCliente',   cliente.correo)
    localStorage.setItem('correoCliente',    cliente.correo)
    localStorage.setItem('telefonoCliente',  cliente.telefono || '')
    localStorage.setItem('clienteRegistrado','true')
    window.history.replaceState(null, '', window.location.pathname)
  } catch (err) {
    console.error('Error manejando sesión Google:', err)
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  await manejarSesionGoogleEnCliente()
  await pedirPermisoNotificaciones()

  const clienteNombre = localStorage.getItem("nombreCliente")
  if (clienteNombre) {
    try {
      const pedidos = await sbFetch(`pedidos?cliente=eq.${encodeURIComponent(clienteNombre)}&select=id&order=fecha.desc`)
      if (pedidos && pedidos.length > 0) guardarPedidosActivosIds(pedidos.map(p => p.id))
    } catch(e) { console.error("Error cargando pedidos:", e) }
  }

  const nombre = localStorage.getItem("nombreCliente") || "Cliente"
  const usuario = localStorage.getItem("usuarioCliente") || "-"
  const correo = localStorage.getItem("correoCliente") || ""
  const telefono = localStorage.getItem("telefonoCliente") || usuario
  const direccion = localStorage.getItem("direccion") || ""

  const nombreUsuario = document.getElementById("nombreUsuario")
  const nombreCuentaTexto = document.getElementById("nombreCuentaTexto")
  const correoCuenta = document.getElementById("correoCuenta")
  const telefonoCuenta = document.getElementById("telefonoCuenta")
  const direccionInput = document.getElementById("direccion")
  const direccionGuardada = document.getElementById("direccionGuardada")

  if (nombreUsuario) nombreUsuario.textContent = nombre
  if (nombreCuentaTexto) nombreCuentaTexto.value = nombre
  if (correoCuenta) correoCuenta.value = correo
  if (telefonoCuenta) telefonoCuenta.value = telefono
  if (direccionInput) direccionInput.value = direccion
  if (direccionGuardada && direccion !== "") direccionGuardada.textContent = "Ubicación guardada: " + direccion

  const navTabs = document.querySelector(".nav-tabs")
  if (navTabs) navTabs.style.display = "none"

  const hora = new Date().getHours()
  const saludoEl = document.getElementById("saludoTiempo")
  const nombreBienvenida = document.getElementById("nombreBienvenida")
  if (saludoEl) {
    if (hora >= 5 && hora < 12) saludoEl.textContent = "¡Buenos días! ☀️"
    else if (hora >= 12 && hora < 19) saludoEl.textContent = "¡Buenas tardes! 🌤️"
    else saludoEl.textContent = "¡Buenas noches! 🌙"
  }
  if (nombreBienvenida) nombreBienvenida.textContent = nombre

  actualizarTopbarSesion()
  initTheme()
  ctActualizarSidebar()
  iniciarCarrusel()
  ctRenderOrders()
  iniciarConstructorPizza()
  actualizarResumenPizza()
  actualizarCarrito()
  obtenerEstadoPedidoActual()
  mostrarPedidosCliente()

  // Actualizar cada 5 segundos
  setInterval(() => { obtenerEstadoPedidoActual() }, 5000)
})

// =====================
// TABS MENU
// =====================
function cambiarCategoriaMenu(categoria, boton) {
  document.querySelectorAll('.mn-categoria').forEach(el => el.style.display = 'none')
  document.querySelectorAll('.mn-tab').forEach(el => el.classList.remove('active'))
  document.getElementById('cat-' + categoria).style.display = 'block'
  boton.classList.add('active')
}

// =====================
// MODAL PIZZA
// =====================
let modalCantidad = 1
let modalNombreBase = ''

function abrirPizzaModal(img, nombre, desc) {
  modalNombreBase = nombre
  modalCantidad = 1
  document.getElementById('pzImgPrincipal').src = img
  document.getElementById('pzNombre').textContent = nombre
  document.getElementById('pzDesc').textContent = desc
  document.getElementById('pzCantidad').textContent = 1
  document.querySelector('input[name="pzTamano"][value="99"]').checked = true
  document.querySelector('input[name="pzOrilla"][value="0"]').checked = true
  actualizarTotalModal()
  document.getElementById('pizzaModal').classList.add('activo')
  document.body.style.overflow = 'hidden'
}

function cerrarPizzaModal(e) {
  if (e && e.target !== document.getElementById('pizzaModal') && !e.target.classList.contains('pz-close')) return
  document.getElementById('pizzaModal').classList.remove('activo')
  document.body.style.overflow = ''
}

function actualizarTotalModal() {
  const tamanoInput = document.querySelector('input[name="pzTamano"]:checked')
  const tamano = parseInt(tamanoInput.value) || 99
  const orillaCosto = parseInt(tamanoInput.dataset.orilla) || 30
  const orilaOpt = document.querySelector('input[name="pzOrilla"]:checked')
  const orilla = (orilaOpt && orilaOpt.value === 'orilla') ? orillaCosto : 0
  const label = document.getElementById('pzOrillaPrecioLabel')
  if (label) label.textContent = '+ $' + orillaCosto
  const total = (tamano + orilla) * modalCantidad
  document.getElementById('pzTotal').textContent = '$' + total.toFixed(2) + ' MXN'
  return { tamano, orilla, total }
}

function cambiarCantidadModal(delta) {
  modalCantidad = Math.max(1, modalCantidad + delta)
  document.getElementById('pzCantidad').textContent = modalCantidad
  actualizarTotalModal()
}

function agregarDesdeModal() {
  const tamanoInput = document.querySelector('input[name="pzTamano"]:checked')
  const orillaCosto = parseInt(tamanoInput.dataset.orilla) || 30
  const orilaOpt = document.querySelector('input[name="pzOrilla"]:checked')
  const tieneOrilla = orilaOpt && orilaOpt.value === 'orilla'
  const orilla = tieneOrilla ? orillaCosto : 0
  const tamanoLabel = tamanoInput.dataset.label
  const tamanoPrice = parseInt(tamanoInput.value)
  const precioUnitario = tamanoPrice + orilla
  const nombreCompleto = modalNombreBase + ' (' + tamanoLabel + (tieneOrilla ? ' + Orilla' : '') + ')'
  for (let i = 0; i < modalCantidad; i++) agregarCarrito(nombreCompleto, precioUnitario)
  document.getElementById('pizzaModal').classList.remove('activo')
  document.body.style.overflow = ''
}

document.addEventListener('change', function(e) {
  if (e.target.name === 'pzTamano' || e.target.name === 'pzOrilla') actualizarTotalModal()
})

// =====================
// PERSONALIZADOR
// =====================
let psSlots = 2
let psPrecioBase = 0

document.addEventListener('change', function(e) {
  if (e.target.name === 'psTamano') {
    const input = e.target
    psSlots = parseInt(input.dataset.slots)
    psPrecioBase = parseInt(input.dataset.precio)
    for (let i = 1; i <= 4; i++) {
      const slot = document.getElementById('psSlot' + i)
      const mitad = document.getElementById('psMitad' + i)
      if (slot) slot.style.display = i <= psSlots ? 'block' : 'none'
      if (mitad) mitad.style.display = i <= psSlots ? 'block' : 'none'
    }
    const mitadesBox = document.getElementById('psMitades')
    if (mitadesBox) { mitadesBox.style.gridTemplateColumns = 'repeat(2,1fr)'; mitadesBox.dataset.slots = psSlots }
    const paso = document.getElementById('psPasoSabores')
    if (paso) { paso.style.opacity = '1'; paso.style.pointerEvents = 'all' }
    const badge = document.getElementById('psSaboresInfo')
    if (badge) badge.textContent = psSlots === 4 ? '4 secciones' : '2 mitades'
    actualizarResumenPs()
  }
  if (e.target.name === 'psOrilla') actualizarResumenPs()
  if (e.target.name && e.target.name.startsWith('psSabor')) {
    const slot = parseInt(e.target.name.replace('psSabor',''))
    const imgEl = document.getElementById('psImg' + slot)
    const labelEl = document.getElementById('psLabel' + slot)
    if (imgEl) { imgEl.src = e.target.dataset.img; imgEl.style.opacity = '1' }
    if (labelEl) labelEl.textContent = e.target.value
    actualizarResumenPs()
  }
})

function actualizarResumenPs() {
  const tamanoInput = document.querySelector('input[name="psTamano"]:checked')
  const orillaCosto = tamanoInput ? parseInt(tamanoInput.dataset.orilla || 0) : 30
  const orilaOpt = document.querySelector('input[name="psOrilla"]:checked')
  const tieneOrilla = orilaOpt && parseInt(orilaOpt.value) > 0
  const orilla = tieneOrilla ? orillaCosto : 0
  const psOrillaLabel = document.getElementById('psOrillaPrecioLabel')
  if (psOrillaLabel) psOrillaLabel.textContent = '+ $' + orillaCosto
  const total = psPrecioBase + orilla
  const totalEl = document.getElementById('psTotalTexto')
  if (totalEl) totalEl.textContent = total > 0 ? '$' + total.toFixed(2) + ' MXN' : '$0.00 MXN'
  const sabores = []
  for (let i = 1; i <= psSlots; i++) {
    const sel = document.querySelector(`input[name="psSabor${i}"]:checked`)
    if (sel) sabores.push(sel.value)
  }
  const tamanoNombre = tamanoInput ? tamanoInput.value.charAt(0).toUpperCase() + tamanoInput.value.slice(1) : ''
  const resumen = document.getElementById('psResumenTexto')
  if (resumen) resumen.textContent = tamanoNombre ? `Pizza ${tamanoNombre} · ${sabores.length}/${psSlots} sabores elegidos` : 'Selecciona un tamaño para comenzar'
}

// =====================
// CUENTA PANELES
// =====================
function ctMostrarPanel(panel) {
  document.querySelectorAll('.ct-panel').forEach(p => p.style.display = 'none')
  document.querySelectorAll('.ct-nav-btn').forEach(b => b.classList.remove('active'))
  const el = document.getElementById('ct-panel-' + panel)
  if (el) el.style.display = 'block'
  const btns = document.querySelectorAll('.ct-nav-btn')
  const idx = ['info','ubicacion','pedidos','preferencias'].indexOf(panel)
  if (btns[idx]) btns[idx].classList.add('active')
}

function ctActualizarSidebar() {
  const nombre = localStorage.getItem('nombreCliente') || 'Cliente'
  const correo = localStorage.getItem('correoCliente') || '—'
  const nd = document.getElementById('ctNombreDisplay')
  const cd = document.getElementById('ctCorreoDisplay')
  if (nd) nd.textContent = nombre
  if (cd) cd.textContent = correo
}

// =====================
// ORDENES
// =====================
const estadoConfig = {
  "Nuevo":          { label: "Recibido",   color: "#f6c400", bg: "rgba(246,196,0,0.12)" },
  "En preparación": { label: "Preparando", color: "#4da6ff", bg: "rgba(77,166,255,0.12)" },
  "En camino":      { label: "En camino",  color: "#ff9f43", bg: "rgba(255,159,67,0.12)" },
  "Entregado":      { label: "Entregado",  color: "#4caf88", bg: "rgba(76,175,136,0.12)" },
}

async function ctRenderOrders() {
  const body = document.getElementById("ctOrdersBody")
  if (!body) return
  const idsActivos = obtenerPedidosActivosIds()
  if (idsActivos.length === 0) { body.innerHTML = `<div class="ct-orders-vacio">No tienes pedidos registrados aún.</div>`; return }
  try {
    const pedidos = await sbObtenerPedidosPorIds(idsActivos)
    if (pedidos.length === 0) { body.innerHTML = `<div class="ct-orders-vacio">No tienes pedidos registrados aún.</div>`; return }
    body.innerHTML = [...pedidos].reverse().map((p) => {
      const cfg = estadoConfig[p.estado] || estadoConfig["Nuevo"]
      const folio = "#" + String(idsActivos.indexOf(p.id) + 1).padStart(4, "0")
      return `<div class="ct-order-row">
        <span class="ct-order-id">${folio}</span>
        <span class="ct-order-fecha">${p.fecha || "—"}</span>
        <span><span class="ct-order-badge" style="color:${cfg.color};background:${cfg.bg};border-color:${cfg.color}30">${cfg.label}</span></span>
        <span class="ct-order-total">$${p.total}</span>
        <span><button class="ct-order-eye" onclick="ctVerPedido(${p.id})" title="Ver detalle">👁</button></span>
      </div>`
    }).join("")
  } catch (err) {
    body.innerHTML = `<div class="ct-orders-vacio">Error al cargar pedidos.</div>`
  }
}

async function ctVerPedido(id) {
  let p = null
  try { const pedidos = await sbObtenerPedidosPorIds([id]); p = pedidos[0] } catch (err) { console.error(err) }
  if (!p) return
  const idsActivos = obtenerPedidosActivosIds()
  const folio = "#" + String(idsActivos.indexOf(p.id) + 1).padStart(4, "0")
  const cfg = estadoConfig[p.estado] || estadoConfig["Nuevo"]
  const estados = ["Nuevo","En preparación","En camino","Entregado"]
  const etiquetas = [{ label:"Recibido",icon:"✅"},{label:"Preparando",icon:"👨‍🍳"},{label:"En camino",icon:"🛵"},{label:"Entregado",icon:"🏠"}]
  const idx = estados.indexOf(p.estado)
  const barraHtml = etiquetas.map((e,i) => `<div class="pd-paso ${i<idx?'completado':i===idx?'activo':''}"><div class="pd-paso-icon">${e.icon}</div><span>${e.label}</span></div>`).join("")
  const productosHtml = p.productos.map(pr => `<div class="pd-producto-row"><span>${pr.nombre}</span><span class="pd-precio">$${pr.precio}</span></div>`).join("")
  const box = document.getElementById("ctPedidoModalBox")
  box.innerHTML = `
    <div class="ct-modal-header"><div><h3>Pedido ${folio}</h3><span style="font-size:12px;color:var(--text-muted)">${p.fecha}</span></div><button class="ct-modal-close" onclick="ctCerrarModalBtn()">✕</button></div>
    <div class="pd-barra" style="margin:0 -28px;padding:20px 28px;background:rgba(255,255,255,0.015);border-bottom:1px solid rgba(255,255,255,0.06)">${barraHtml}</div>
    <div class="ct-modal-body">
      <div class="ct-modal-col">
        <p class="ct-modal-section">Información del pedido</p>
        <div class="ct-modal-rows">
          <div class="ct-modal-row"><span>Cliente</span><strong>${p.cliente}</strong></div>
          <div class="ct-modal-row"><span>Teléfono</span><strong>${p.telefono}</strong></div>
          <div class="ct-modal-row"><span>Dirección</span><strong>${p.direccion}</strong></div>
          <div class="ct-modal-row"><span>Tiempo estimado</span><strong>${p.tiempoEstimado}</strong></div>
          <div class="ct-modal-row"><span>Estado</span><strong style="color:${cfg.color}">${cfg.label}</strong></div>
        </div>
      </div>
      <div class="ct-modal-col"><p class="ct-modal-section">Productos</p>${productosHtml}<div class="pd-prod-total" style="margin-top:12px"><span>Total</span><strong>$${p.total}</strong></div></div>
    </div>`
  document.getElementById("ctPedidoModal").classList.add("visible")
}

function ctCerrarModal(e) {
  if (e && e.target.id !== "ctPedidoModal") return
  document.getElementById("ctPedidoModal").classList.remove("visible")
}

function ctCerrarModalBtn() {
  document.getElementById("ctPedidoModal").classList.remove("visible")
}

// =====================
// CARRUSEL
// =====================
let carruselIdx = 0

function carruselMover(dir) {
  const carousel = document.getElementById('hmCarousel')
  if (!carousel) return
  const items = carousel.querySelectorAll('.hm-carr-item')
  const visible = window.innerWidth < 780 ? 2 : window.innerWidth < 1100 ? 3 : 4
  const max = Math.ceil(items.length / visible) - 1
  carruselIdx = Math.max(0, Math.min(carruselIdx + dir, max))
  carousel.scrollLeft = carruselIdx * (items[0].offsetWidth + 20) * visible
  actualizarDots()
}

function actualizarDots() {
  const dots = document.querySelectorAll('.hm-carr-dot')
  dots.forEach((d, i) => d.classList.toggle('active', i === carruselIdx))
}

function iniciarCarrusel() {
  const carousel = document.getElementById('hmCarousel')
  const dotsEl   = document.getElementById('hmDots')
  if (!carousel || !dotsEl) return
  const items   = carousel.querySelectorAll('.hm-carr-item')
  const visible = window.innerWidth < 780 ? 2 : window.innerWidth < 1100 ? 3 : 4
  const total   = Math.ceil(items.length / visible)
  dotsEl.innerHTML = ''
  for (let i = 0; i < total; i++) {
    const d = document.createElement('div')
    d.className = 'hm-carr-dot' + (i === 0 ? ' active' : '')
    d.onclick = () => { carruselIdx = i; carruselMover(0) }
    dotsEl.appendChild(d)
  }
  setInterval(() => {
    carruselIdx = carruselIdx >= total - 1 ? 0 : carruselIdx + 1
    carousel.scrollLeft = carruselIdx * (items[0].offsetWidth + 20) * visible
    actualizarDots()
  }, 4000)
}

function agregarCombo(nombre, precio) {
  agregarCarrito(nombre, precio)
  mostrarToast('¡' + nombre + ' agregado al carrito!')
}

// =====================
// CUPONES
// =====================
function generarCodigoCupon() {
  const letra = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const nums  = '0123456789'
  const c1 = letra[Math.floor(Math.random() * letra.length)]
  const n4 = Array.from({length:4}, () => nums[Math.floor(Math.random() * nums.length)]).join('')
  const l4 = Array.from({length:4}, () => letra[Math.floor(Math.random() * letra.length)]).join('')
  return c1 + n4 + l4
}

function ctIniciarCupon() {
  if (!localStorage.getItem('cuponBienvenida')) {
    if (localStorage.getItem('clienteRegistrado') === 'true') {
      const codigo = generarCodigoCupon()
      localStorage.setItem('cuponBienvenida', JSON.stringify({ codigo, usado: false, descuento: 20 }))
    }
  }
  ctRenderCupon()
}

function ctRenderCupon() {
  const wrap = document.getElementById('ctCuponBienvenida')
  if (!wrap) return
  const raw = localStorage.getItem('cuponBienvenida')
  if (!raw) {
    wrap.innerHTML = `<div class="ct-cupon-info" style="text-align:center;padding:32px"><p style="color:#aaa;font-size:14px">🎟️ Regístrate para recibir tu cupón de bienvenida con <strong style="color:#b8900a">20% de descuento</strong></p></div>`
    return
  }
  const cupon = JSON.parse(raw)
  const estadoBadge = cupon.usado
    ? `<span class="ct-cupon-badge-usado ct-cupon-badge-usado-b">✗ Usado</span>`
    : `<span class="ct-cupon-badge-usado ct-cupon-badge-activo">✓ Activo</span>`
  wrap.innerHTML = `
    <div class="ct-cupon-card">
      <div class="ct-muesca-izq"></div>
      <div class="ct-cupon-left"><h3>🎉 Cupón de Bienvenida</h3><h2>20% OFF</h2><p>En pizzas Mediana, Grande y Familiar</p></div>
      <div class="ct-cupon-divider"></div>
      <div class="ct-cupon-right"><small>Tu código</small><span class="ct-cupon-codigo">${cupon.codigo}</span>${estadoBadge}</div>
      <div class="ct-muesca-der"></div>
    </div>`
}

function ctAplicarCupon() {
  const input = document.getElementById('ctCuponInput')
  const msg   = document.getElementById('ctCuponMensaje')
  const val   = input.value.trim().toUpperCase()
  if (!val) { msg.textContent = 'Ingresa un código'; msg.className = 'ct-cupon-msg err'; return }
  const raw = localStorage.getItem('cuponBienvenida')
  if (!raw) { msg.textContent = 'Código no válido'; msg.className = 'ct-cupon-msg err'; return }
  const cupon = JSON.parse(raw)
  if (val !== cupon.codigo) { msg.textContent = 'Código incorrecto'; msg.className = 'ct-cupon-msg err'; return }
  if (cupon.usado) { msg.textContent = 'Este cupón ya fue utilizado'; msg.className = 'ct-cupon-msg err'; return }
  localStorage.setItem('cuponActivo', JSON.stringify(cupon))
  msg.textContent = `¡Cupón aplicado! 20% de descuento en tu próximo pedido 🎉`
  msg.className = 'ct-cupon-msg ok'
  input.value = ''
  mostrarToast('¡Cupón de 20% aplicado! 🎉')
}

function aplicarDescuentoCupon(subtotalOriginal) {
  const raw = localStorage.getItem('cuponActivo')
  if (!raw) return subtotalOriginal
  const cupon = JSON.parse(raw)
  if (cupon.usado) return subtotalOriginal
  const tieneElegible = carrito.some(item => {
    const nombre = (item.nombre || '').toLowerCase()
    return nombre.includes('mediana') || nombre.includes('grande') || nombre.includes('familiar')
  })
  if (!tieneElegible) return subtotalOriginal
  return Math.round(subtotalOriginal * (1 - cupon.descuento / 100))
}

function marcarCuponUsado() {
  const raw = localStorage.getItem('cuponActivo')
  if (!raw) return
  const cupon = JSON.parse(raw)
  cupon.usado = true
  localStorage.setItem('cuponBienvenida', JSON.stringify(cupon))
  localStorage.removeItem('cuponActivo')
}

function mcpOverlayClick(e) {
  if (e.target.id === 'modalCuponPedido') document.getElementById('modalCuponPedido').classList.remove('visible')
}

// =====================
// TEMA
// =====================
function toggleTheme() {
  const isDark = document.body.classList.toggle('dark-mode')
  localStorage.setItem('pgTheme', isDark ? 'dark' : 'light')
  document.getElementById('themeIcon').textContent = isDark ? '☀️' : '🌙'
}

function initTheme() {
  const saved = localStorage.getItem('pgTheme')
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  if (saved === 'dark' || (!saved && prefersDark)) {
    document.body.classList.add('dark-mode')
    const icon = document.getElementById('themeIcon')
    if (icon) icon.textContent = '☀️'
  }
}