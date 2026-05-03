function redir(page) {
  const base = window.location.href.substring(0, window.location.href.lastIndexOf('/') + 1)
  window.location.replace(base + page)
}

function siguienteEstado(e) {
  if (e === "Nuevo")          return "En preparación"
  if (e === "En preparación") return "En camino"
  if (e === "En camino")      return "Entregado"
  return "Entregado"
}

function badgeClase(estado) {
  if (estado === "Nuevo")          return "badge-Nuevo"
  if (estado === "En preparación") return "badge-preparacion"
  if (estado === "En camino")      return "badge-camino"
  if (estado === "Entregado")      return "badge-Entregado"
  return "badge-Nuevo"
}

function folio(idx) {
  return "#" + String(idx + 1).padStart(4, "0")
}

// ═══════════════════════════
// NOTIFICACIONES
// ═══════════════════════════
let _notifPermiso = false
let _pedidosIdsAnteriores = new Set()
let _primeraCarga = true

async function pedirPermisoNotificaciones() {
  if (!("Notification" in window)) return
  if (Notification.permission === "granted") {
    _notifPermiso = true
    return
  }
  if (Notification.permission !== "denied") {
    const permiso = await Notification.requestPermission()
    _notifPermiso = permiso === "granted"
  }
}

function enviarNotificacionMostrador(titulo, cuerpo, icono = "🍕") {
  if (!_notifPermiso || Notification.permission !== "granted") return
  try {
    new Notification(titulo, {
      body: cuerpo,
      icon: "img/logo.png",
      badge: "img/logo.png",
      tag: "pizzago-mostrador"
    })
  } catch (e) {
    console.log("Notificación no disponible:", e)
  }
}

// ═══════════════════════════
// RENDER TARJETA
// ═══════════════════════════
function renderCard(pedido, idx) {
  const productosHtml = pedido.productos.map(p =>
    `<div class="ms-prod-row"><span>${p.nombre}</span><strong>$${p.precio}</strong></div>`
  ).join("")

  const entregado = pedido.estado === "Entregado"
  const btnLabel  = entregado ? "✓ Entregado" : `Marcar: ${siguienteEstado(pedido.estado)}`

  const estiloIzq = {
    "Nuevo":          "border-left:3px solid var(--gold)",
    "En preparación": "border-left:3px solid var(--orange)",
    "En camino":      "border-left:3px solid var(--blue)",
    "Entregado":      "border-left:3px solid var(--green)"
  }[pedido.estado] || ""

  return `
    <div class="ms-card" data-estado="${pedido.estado}" data-id="${pedido.id}" style="${estiloIzq}">
      <div class="ms-card-top">
        <div>
          <div class="ms-card-folio">${folio(idx)}</div>
          <div class="ms-card-fecha">${pedido.fecha}</div>
        </div>
        <div class="ms-card-top-right">
          <span class="ms-estado-badge ${badgeClase(pedido.estado)}">${pedido.estado}</span>
          <button class="ms-card-delete" onclick="eliminarPedido(${pedido.id})" title="Eliminar">✕</button>
        </div>
      </div>
      <div class="ms-card-cliente">
        <strong>${pedido.cliente}</strong>
        <span>📞 ${pedido.telefono || "—"}</span>
        <span>📍 ${pedido.direccion || "—"}</span>
      </div>
      <div class="ms-card-productos">${productosHtml}</div>
      <div class="ms-card-footer">
        <div class="ms-card-total">
          $${pedido.total}
          <small>${pedido.cantidadProductos} producto${pedido.cantidadProductos !== 1 ? "s" : ""}</small>
        </div>
        <button class="ms-avanzar-btn" onclick="cambiarEstado(${pedido.id})" ${entregado ? "disabled" : ""}>
          ${btnLabel}
        </button>
      </div>
    </div>`
}

// ═══════════════════════════
// CARGAR PEDIDOS
// ═══════════════════════════
let filtroActual = "todos"
let _pedidosCache = []

async function cargarPedidos() {
  try {
    const pedidos = await sbObtenerPedidos()

    // Detectar pedidos nuevos (solo después de la primera carga)
    if (!_primeraCarga) {
      pedidos.forEach(p => {
        if (!_pedidosIdsAnteriores.has(p.id) && p.estado === "Nuevo") {
          enviarNotificacionMostrador(
            "🍕 ¡Nuevo pedido!",
            `${p.cliente} — $${p.total} — ${p.productos.length} producto(s)`
          )
          mostrarToast(`🍕 Nuevo pedido de ${p.cliente}`)
        }
      })
    }

    // Actualizar el set de IDs conocidos
    _pedidosIdsAnteriores = new Set(pedidos.map(p => p.id))
    _primeraCarga = false
    _pedidosCache = pedidos

    const nuevos     = pedidos.filter(p => p.estado === "Nuevo").length
    const prep       = pedidos.filter(p => p.estado === "En preparación").length
    const camino     = pedidos.filter(p => p.estado === "En camino").length
    const activos    = pedidos.filter(p => p.estado !== "Entregado").length
    const entregados = pedidos.filter(p => p.estado === "Entregado").length

    setText("totalPedidos",       pedidos.length)
    setText("pedidosNuevos",      nuevos)
    setText("pedidosPreparacion", prep)
    setText("pedidosCamino",      camino)
    setText("msBadgeActivos",     activos + " Activos")
    setText("msBadgeNuevos",      nuevos + " Nuevos")
    setText("tabTodos",           pedidos.length)
    setText("tabNuevos",          nuevos)
    setText("tabPrep",            prep)
    setText("tabCamino",          camino)
    setText("tabEntregado",       entregados)

    // Actualizar título de la pestaña del navegador
    if (nuevos > 0) {
      document.title = `(${nuevos} nuevos) PizzaGo | Panel`
    } else {
      document.title = "PizzaGo | Panel de Pedidos"
    }

    let filtrados = [...pedidos]
    if (filtroActual !== "todos") {
      filtrados = filtrados.filter(p => p.estado === filtroActual)
    }

    const lista  = document.getElementById("listaPedidos")
    const sinPed = document.getElementById("sinPedidos")
    if (!lista) return

    if (filtrados.length === 0) {
      sinPed.style.display = "block"
      lista.innerHTML = ""
    } else {
      sinPed.style.display = "none"
      lista.innerHTML = filtrados.map((p, i) => renderCard(p, pedidos.findIndex(x => x.id === p.id))).join("")
    }

  } catch (err) {
    console.error("Error cargando pedidos:", err)
    mostrarToast("Error al cargar pedidos")
  }
}

function setText(id, val) {
  const el = document.getElementById(id)
  if (el) el.textContent = val
}

// ═══════════════════════════
// ACCIONES
// ═══════════════════════════
async function cambiarEstado(idPedido) {
  const pedido = _pedidosCache.find(p => p.id == idPedido)
  if (!pedido || pedido.estado === "Entregado") return

  const nuevoEstado = siguienteEstado(pedido.estado)
  try {
    await sbCambiarEstado(idPedido, nuevoEstado)
    mostrarToast(`Pedido actualizado → ${nuevoEstado}`)
    cargarPedidos()
  } catch (err) {
    mostrarToast("Error al actualizar pedido")
    console.error(err)
  }
}

async function eliminarPedido(idPedido) {
  try {
    await sbEliminarPedido(idPedido)
    mostrarToast("Pedido eliminado")
    cargarPedidos()
  } catch (err) {
    mostrarToast("Error al eliminar pedido")
    console.error(err)
  }
}

function cerrarSesionMostrador() {
  localStorage.removeItem("sesionMostrador")
  localStorage.removeItem("adminActual")
  mostrarToast("Sesión cerrada")
  setTimeout(() => { redir("mostrador-login.html") }, 900)
}

// ═══════════════════════════
// FILTRO TABS
// ═══════════════════════════
function msFiltrar(estado, btn) {
  filtroActual = estado
  document.querySelectorAll(".ms-tab").forEach(b => b.classList.remove("active"))
  btn.classList.add("active")
  cargarPedidos()
}

// ═══════════════════════════
// PANELES SIDEBAR
// ═══════════════════════════
function msSetTab(panel, btn) {
  document.querySelectorAll(".ms-panel").forEach(p => p.style.display = "none")
  document.querySelectorAll(".ms-nav-btn").forEach(b => b.classList.remove("active"))
  document.getElementById("ms-panel-" + panel).style.display = "block"
  document.getElementById("ms-tabs-pedidos").style.display = panel === "pedidos" ? "flex" : "none"
  btn.classList.add("active")
  if (panel === "historial") renderHistorial()
  if (panel === "settings")  renderSettings()
}

// ═══════════════════════════
// HISTORIAL
// ═══════════════════════════
function renderHistorial() {
  const lista = document.getElementById("msHistorialLista")
  if (!lista) return
  if (_pedidosCache.length === 0) {
    lista.innerHTML = `<div class="ms-hist-vacio">No hay pedidos en el historial.</div>`
    return
  }
  lista.innerHTML = [..._pedidosCache].map((p, i) => `
    <div class="ms-hist-row">
      <span class="ms-hist-id">#${String(i + 1).padStart(4,"0")}</span>
      <span class="ms-hist-cli">${p.cliente}</span>
      <span class="ms-hist-prod">${p.productos.map(x => x.nombre).join(", ")}</span>
      <span class="ms-hist-tot">$${p.total}</span>
      <span class="ms-hist-est">
        <span class="ms-estado-badge ${badgeClase(p.estado)}">${p.estado}</span>
      </span>
    </div>`).join("")
}

async function msLimpiarHistorial() {
  if (!confirm("¿Eliminar todos los pedidos?")) return
  try {
    await sbFetch('pedidos', { method: 'DELETE', headers: { 'Prefer': 'return=minimal' } })
    _pedidosCache = []
    renderHistorial()
    cargarPedidos()
    mostrarToast("Historial limpiado")
  } catch (err) {
    mostrarToast("Error al limpiar historial")
  }
}

// ═══════════════════════════
// SETTINGS
// ═══════════════════════════
function renderSettings() {
  const admin = JSON.parse(localStorage.getItem("adminActual") || "null")
  const cont  = document.getElementById("msSettingsInfo")
  if (!cont) return
  if (!admin) {
    cont.innerHTML = `<div class="ms-settings-row"><span>Usuario</span><strong>Administrador</strong></div>`
    return
  }
  cont.innerHTML = `
    <div class="ms-settings-row"><span>Nombre</span><strong>${admin.nombre}</strong></div>
    <div class="ms-settings-row"><span>Correo</span><strong>${admin.correo}</strong></div>
    <div class="ms-settings-row"><span>ID de Empleado</span><strong>${admin.empleadoId}</strong></div>
    <div class="ms-settings-row"><span>Rol</span><strong>${admin.rol}</strong></div>
    <div class="ms-settings-row"><span>Registrado</span><strong>${admin.fecha}</strong></div>`
}

function cargarAdminSidebar() {
  const admin = JSON.parse(localStorage.getItem("adminActual") || "null")
  const nombre = document.getElementById("msAdminNombre")
  const rol    = document.getElementById("msAdminRol")
  if (admin) {
    if (nombre) nombre.textContent = admin.nombre || "Administrador"
    if (rol)    rol.textContent    = admin.rol    || "Kitchen Manager"
  }
}

// ═══════════════════════════
// TOAST
// ═══════════════════════════
function mostrarToast(msg) {
  const t = document.getElementById("toastMostrador")
  if (!t) return
  t.textContent = msg
  t.classList.add("show")
  clearTimeout(window._toastT)
  window._toastT = setTimeout(() => t.classList.remove("show"), 2500)
}

// ═══════════════════════════
// SONIDO DE ALERTA
// ═══════════════════════════
function reproducirSonidoAlerta() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.frequency.setValueAtTime(880, ctx.currentTime)
    osc.frequency.setValueAtTime(660, ctx.currentTime + 0.1)
    osc.frequency.setValueAtTime(880, ctx.currentTime + 0.2)
    gain.gain.setValueAtTime(0.3, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4)
    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + 0.4)
  } catch (e) {
    // Audio no disponible
  }
}

// ═══════════════════════════
// INIT
// ═══════════════════════════
document.addEventListener("DOMContentLoaded", async () => {
  cargarAdminSidebar()
  await pedirPermisoNotificaciones()
  await cargarPedidos()

  // Actualizar cada 5 segundos
  setInterval(cargarPedidos, 5000)
})