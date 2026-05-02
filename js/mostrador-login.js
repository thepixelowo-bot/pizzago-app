function redir(page) {
  const base = window.location.href.substring(0, window.location.href.lastIndexOf('/') + 1)
  window.location.replace(base + page)
}

function mlTogglePass() {
  const input = document.getElementById("passwordMostrador")
  const btn   = document.querySelector(".ml-eye")
  if (input.type === "password") {
    input.type = "text"
    btn.style.opacity = "0.9"
  } else {
    input.type = "password"
    btn.style.opacity = "0.35"
  }
}

function mostrarMensaje(texto, ok = false) {
  const el = document.getElementById("mensajeMostrador")
  if (!el) return
  el.textContent = texto
  el.className = "ml-mensaje" + (ok ? " ok" : "")
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("mostradorLoginForm")
  if (!form) return

  form.addEventListener("submit", async (e) => {
    e.preventDefault()
    const usuario  = document.getElementById("usuarioMostrador").value.trim()
    const password = document.getElementById("passwordMostrador").value.trim()

    if (!usuario || !password) {
      mostrarMensaje("Completa todos los campos")
      return
    }

    mostrarMensaje("Verificando acceso...")

    try {
      // Buscar en Supabase por correo o empleado_id
      const res = await fetch(
        `${SUPABASE_URL}/rest/v1/usuarios_mostrador?or=(correo.eq.${encodeURIComponent(usuario)},empleado_id.eq.${encodeURIComponent(usuario)})&select=*`,
        {
          headers: {
            'apikey': SUPABASE_KEY,
            'Authorization': `Bearer ${SUPABASE_KEY}`
          }
        }
      )
      const admins = await res.json()
      const admin = admins.find(a => a.password === password)

      if (!admin) {
        mostrarMensaje("Usuario o contraseña incorrectos")
        return
      }

      localStorage.setItem("sesionMostrador", "activa")
      localStorage.setItem("adminActual", JSON.stringify({
        nombre:     admin.nombre,
        correo:     admin.correo,
        empleadoId: admin.empleado_id,
        rol:        admin.rol,
        fecha:      new Date(admin.creado_en).toLocaleDateString()
      }))

      mostrarMensaje("Acceso correcto. Entrando al panel...", true)
      setTimeout(() => { redir("mostrador.html") }, 900)

    } catch (err) {
      mostrarMensaje("Error de conexión. Intenta de nuevo.")
      console.error(err)
    }
  })
})