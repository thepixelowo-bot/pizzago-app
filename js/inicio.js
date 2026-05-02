// ─── LOGIN CON GOOGLE ───────────────────
async function loginConGoogle() {
  window.location.href = `${SUPABASE_URL}/auth/v1/authorize?provider=google&redirect_to=${encodeURIComponent(window.location.origin + '/cliente.html')}`
}

function redir(page) {
  const base = window.location.href.substring(0, window.location.href.lastIndexOf('/') + 1)
  window.location.replace(base + page)
}

function inTogglePass(id, btn) {
  const input = document.getElementById(id)
  if (!input) return
  input.type = input.type === 'password' ? 'text' : 'password'
  btn.style.opacity = input.type === 'text' ? '0.9' : '0.35'
}

function inMostrar(panel) {
  const isLogin = panel === 'login'
  document.getElementById('inFormLogin').style.display    = isLogin ? 'block' : 'none'
  document.getElementById('inFormRegistro').style.display = isLogin ? 'none'  : 'block'
  document.getElementById('tabLogin').classList.toggle('active',    isLogin)
  document.getElementById('tabRegistro').classList.toggle('active', !isLogin)
  document.getElementById('inTagline').innerHTML = isLogin
    ? 'Las mejores pizzas,<br>directo a <em>tu puerta.</em>'
    : 'Las mejores rebanadas<br>de la ciudad <em>te esperan.</em>'
  document.getElementById('inSub').textContent = isLogin
    ? 'Inicia sesión y disfruta de pizzas artesanales horneadas al momento.'
    : 'Únete y obtén acceso a promociones exclusivas, seguimiento de pedidos y mucho más.'
}

function validarCorreo(valor) {
  return /^[^\s@]+@gmail\.com$/.test(valor)
}

function validarTelefono(valor) {
  return /^[0-9]{10}$/.test(valor)
}

function soloNumeros(input) {
  input.value = input.value.replace(/[^0-9]/g, '').slice(0, 10)
}

function mostrarMensaje(id, texto, ok = false) {
  const el = document.getElementById(id)
  if (!el) return
  el.textContent = texto
  el.className = 'in-mensaje' + (ok ? ' ok' : '')
}

function generarCupon() {
  const L = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const N = '0123456789'
  const c1 = L[Math.floor(Math.random() * L.length)]
  const n4 = Array.from({ length: 4 }, () => N[Math.floor(Math.random() * N.length)]).join('')
  const l4 = Array.from({ length: 4 }, () => L[Math.floor(Math.random() * L.length)]).join('')
  return c1 + n4 + l4
}

// ─── LOGIN ──────────────────────────────
async function iniciarSesion(e) {
  e.preventDefault()
  const usuario  = document.getElementById('loginUsuario').value.trim()
  const password = document.getElementById('loginPassword').value.trim()

  if (!usuario || !password) { mostrarMensaje('loginMensaje', 'Completa todos los campos'); return }
  if (!validarCorreo(usuario)) { mostrarMensaje('loginMensaje', 'Ingresa un correo válido (@gmail.com)'); return }

  mostrarMensaje('loginMensaje', 'Verificando...')

  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/clientes?correo=eq.${encodeURIComponent(usuario)}&password=eq.${encodeURIComponent(password)}&select=*`,
      { headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` } }
    )

    if (!res.ok) {
      mostrarMensaje('loginMensaje', 'Error de conexión. Intenta de nuevo.')
      return
    }

    const data = await res.json()
    if (!data || data.length === 0) {
      mostrarMensaje('loginMensaje', 'Usuario o contraseña incorrectos')
      return
    }

    const cliente = data[0]
    localStorage.setItem('clienteId',        cliente.id)
    localStorage.setItem('nombreCliente',    cliente.nombre)
    localStorage.setItem('usuarioCliente',   cliente.correo)
    localStorage.setItem('correoCliente',    cliente.correo)
    localStorage.setItem('telefonoCliente',  cliente.telefono || '')
    localStorage.setItem('direccion',        cliente.direccion || '')
    localStorage.setItem('latitudCliente',   cliente.latitud || '')
    localStorage.setItem('longitudCliente',  cliente.longitud || '')
    localStorage.setItem('clienteRegistrado','true')

    if (cliente.cupon && !cliente.cupon_usado) {
      localStorage.setItem('cuponBienvenida', JSON.stringify({
        codigo: cliente.cupon,
        usado: cliente.cupon_usado,
        descuento: 20
      }))
    }

    mostrarMensaje('loginMensaje', '¡Bienvenido! Redirigiendo...', true)
    setTimeout(() => { redir("cliente.html") }, 1000)

  } catch (err) {
    mostrarMensaje('loginMensaje', 'Error de conexión. Intenta de nuevo.')
    console.error(err)
  }
}

// ─── REGISTRO ───────────────────────────
async function registrar(e) {
  e.preventDefault()
  const nombre    = document.getElementById('regNombre').value.trim()
  const usuario   = document.getElementById('regUsuario').value.trim()
  const telefono  = document.getElementById('regTelefono').value.trim()
  const password  = document.getElementById('regPassword').value.trim()
  const confirmar = document.getElementById('regConfirmar').value.trim()

  if (!nombre || !usuario || !telefono || !password || !confirmar) {
    mostrarMensaje('registroMensaje', 'Completa todos los campos'); return
  }
  if (!validarCorreo(usuario)) {
    mostrarMensaje('registroMensaje', 'El correo debe ser @gmail.com'); return
  }
  if (!validarTelefono(telefono)) {
    mostrarMensaje('registroMensaje', 'El teléfono debe tener exactamente 10 dígitos'); return
  }
  if (password.length < 6) {
    mostrarMensaje('registroMensaje', 'La contraseña debe tener al menos 6 caracteres'); return
  }
  if (password !== confirmar) {
    mostrarMensaje('registroMensaje', 'Las contraseñas no coinciden'); return
  }

  mostrarMensaje('registroMensaje', 'Creando cuenta...')

  try {
    const check = await fetch(
      `${SUPABASE_URL}/rest/v1/clientes?correo=eq.${encodeURIComponent(usuario)}&select=id`,
      { headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` } }
    )
    const existe = await check.json()
    if (existe.length > 0) { mostrarMensaje('registroMensaje', 'Este correo ya está registrado'); return }

    const codigo = generarCupon()

    const res = await fetch(`${SUPABASE_URL}/rest/v1/clientes`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify({ nombre, correo: usuario, password, telefono, cupon: codigo, cupon_usado: false })
    })

    if (!res.ok) {
      mostrarMensaje('registroMensaje', 'Error al crear cuenta. Intenta de nuevo.')
      return
    }

    const data = await res.json()
    if (!data || data.length === 0) {
      mostrarMensaje('registroMensaje', 'Error al crear cuenta. Intenta de nuevo.')
      return
    }
    const cliente = data[0]

    localStorage.setItem('clienteId',        cliente.id)
    localStorage.setItem('nombreCliente',    cliente.nombre)
    localStorage.setItem('usuarioCliente',   cliente.correo)
    localStorage.setItem('correoCliente',    cliente.correo)
    localStorage.setItem('telefonoCliente',  telefono)
    localStorage.setItem('clienteRegistrado','true')
    localStorage.setItem('cuponBienvenida',  JSON.stringify({ codigo, usado: false, descuento: 20 }))

    mostrarMensaje('registroMensaje', `¡Cuenta creada! Tu cupón de bienvenida: ${codigo} 🎉`, true)
    setTimeout(() => { redir("cliente.html") }, 1500)

  } catch (err) {
    mostrarMensaje('registroMensaje', 'Error de conexión. Intenta de nuevo.')
    console.error(err)
  }
}

// ─── MANEJO DE SESIÓN GOOGLE ─────────────
async function manejarSesionGoogle() {
  const hash = window.location.hash
  if (!hash || !hash.includes('access_token')) return

  const params = new URLSearchParams(hash.substring(1))
  const accessToken = params.get('access_token')
  if (!accessToken) return

  try {
    const res = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${accessToken}`
      }
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
      const codigo = generarCupon()
      const nombre = user.user_metadata?.full_name || user.email.split('@')[0]
      const crearRes = await fetch(`${SUPABASE_URL}/rest/v1/clientes`, {
        method: 'POST',
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        },
        body: JSON.stringify({ nombre, correo: user.email, password: '', telefono: '', cupon: codigo, cupon_usado: false })
      })
      const data = await crearRes.json()
      cliente = data[0]
      localStorage.setItem('cuponBienvenida', JSON.stringify({ codigo, usado: false, descuento: 20 }))
    }

    localStorage.setItem('clienteId',        cliente.id)
    localStorage.setItem('nombreCliente',    cliente.nombre)
    localStorage.setItem('usuarioCliente',   cliente.correo)
    localStorage.setItem('correoCliente',    cliente.correo)
    localStorage.setItem('telefonoCliente',  cliente.telefono || '')
    localStorage.setItem('clienteRegistrado','true')

    window.location.replace('cliente.html')
  } catch (err) {
    console.error('Error manejando sesión Google:', err)
  }
}

document.addEventListener('DOMContentLoaded', () => {
  manejarSesionGoogle()
})