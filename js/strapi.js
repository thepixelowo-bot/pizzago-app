function cargarMenuEstatico() {
  const gridPizzas = document.getElementById('grid-pizzas')
  if (gridPizzas) {
    gridPizzas.innerHTML = `
      <article class="mn-card">
        <div class="mn-card-img"><img src="img/hawaiana.png" alt="Hawaiana"><span class="mn-badge">Favorita</span></div>
        <div class="mn-card-body">
          <div class="mn-card-top"><h3>Hawaiana</h3><span class="mn-precio">$99</span></div>
          <p>Combinación perfecta de jamón, piña y queso mozzarella fundido sobre salsa de tomate.</p>
          <button class="mn-btn-agregar" onclick="abrirPizzaModal('img/hawaiana.png','Pizza Hawaiana','Combinación perfecta de jamón, piña y queso mozzarella fundido sobre salsa de tomate artesanal.')">Ver detalles</button>
        </div>
      </article>
      <article class="mn-card">
        <div class="mn-card-img"><img src="img/vegetariana.jpg" alt="Vegetariana"></div>
        <div class="mn-card-body">
          <div class="mn-card-top"><h3>Vegetariana</h3><span class="mn-precio">$99</span></div>
          <p>Pimientos verdes, cebolla morada, champiñones frescos, aceitunas negras y jitomate.</p>
          <button class="mn-btn-agregar" onclick="abrirPizzaModal('img/vegetariana.jpg','Pizza Vegetariana','Pimientos verdes, cebolla morada, champiñones frescos, aceitunas negras y jitomate sobre cama de queso.')">Ver detalles</button>
        </div>
      </article>
      <article class="mn-card">
        <div class="mn-card-img"><img src="img/jamon.jpg" alt="Clásica de Jamón"></div>
        <div class="mn-card-body">
          <div class="mn-card-top"><h3>Clásica de Jamón</h3><span class="mn-precio">$99</span></div>
          <p>La favorita de todos. Doble porción de jamón de pierna y una generosa capa de queso.</p>
          <button class="mn-btn-agregar" onclick="abrirPizzaModal('img/jamon.jpg','Pizza Clásica de Jamón','La favorita de todos. Doble porción de jamón de pierna y una generosa capa de queso artesanal.')">Ver detalles</button>
        </div>
      </article>
      <article class="mn-card">
        <div class="mn-card-img"><img src="img/pepperoni.png" alt="Pepperoni"></div>
        <div class="mn-card-body">
          <div class="mn-card-top"><h3>Pepperoni Especial</h3><span class="mn-precio">$99</span></div>
          <p>Pepperoni americano de alta calidad, ligeramente crujiente con toque de chile y orégano.</p>
          <button class="mn-btn-agregar" onclick="abrirPizzaModal('img/pepperoni.png','Pizza Pepperoni Especial','Pepperoni americano de alta calidad, ligeramente crujiente, con un toque de chile y orégano.')">Ver detalles</button>
        </div>
      </article>
      <article class="mn-card">
        <div class="mn-card-img"><img src="img/mexicana.png" alt="Mexicana"></div>
        <div class="mn-card-body">
          <div class="mn-card-top"><h3>Mexicana</h3><span class="mn-precio">$99</span></div>
          <p>Chorizo artesanal, jalapeños, frijoles refritos, cebolla y toque de cilantro fresco.</p>
          <button class="mn-btn-agregar" onclick="abrirPizzaModal('img/mexicana.png','Pizza Mexicana','Chorizo artesanal, jalapeños, frijoles refritos, cebolla y un toque de cilantro fresco sobre masa crujiente.')">Ver detalles</button>
        </div>
      </article>
      <article class="mn-card">
        <div class="mn-card-img"><img src="img/carnes.png" alt="Carnes Frías"></div>
        <div class="mn-card-body">
          <div class="mn-card-top"><h3>Carnes Frías</h3><span class="mn-precio">$99</span></div>
          <p>Para los amantes de la carne: jamón, pepperoni, salchicha italiana y tocino ahumado.</p>
          <button class="mn-btn-agregar" onclick="abrirPizzaModal('img/carnes.png','Pizza Carnes Frías','Para los amantes de la carne: jamón, pepperoni, salchicha italiana y tocino ahumado sobre extra queso mozzarella.')">Ver detalles</button>
        </div>
      </article>`
  }

  const gridBebidas = document.getElementById('grid-bebidas')
  if (gridBebidas) {
    const bebidas = [
      {n:'Coca-Cola', p:25, img:'cocacola.jpg', d:'Bebida clásica para acompañar cualquier pizza.'},
      {n:'Pepsi', p:25, img:'pepsi.jpg', d:'Refresco de cola refrescante para acompañar tu pizza favorita.'},
      {n:'Sprite', p:25, img:'sprite.jpg', d:'Refresco ligero y refrescante para tu pedido.'},
      {n:'Fanta', p:25, img:'fanta.jpg', d:'Refresco sabor naranja perfecto para compartir.'},
      {n:'Mundet', p:25, img:'mundet.jpg', d:'Refresco sabor manzana para acompañar tu pizza favorita.'},
      {n:'Sangría Casera', p:25, img:'sangria.jpg', d:'Refresco con un sabor distintivo y muy popular.'}
    ]
    gridBebidas.innerHTML = bebidas.map(b => `
      <article class="mn-card">
        <div class="mn-card-img"><img src="img/${b.img}" alt="${b.n}"></div>
        <div class="mn-card-body">
          <div class="mn-card-top"><h3>${b.n}</h3><span class="mn-precio">$${b.p}</span></div>
          <p>${b.d}</p>
          <button class="mn-btn-agregar" onclick="agregarCarrito('${b.n}', ${b.p})">🛒 Agregar</button>
        </div>
      </article>`).join('')
  }

  const gridExtras = document.getElementById('grid-extras')
  if (gridExtras) {
    const extras = [
      {n:'Aros de cebolla', p:55, img:'aros.jpg', d:'Complemento crujiente y delicioso.'},
      {n:'Papas fritas', p:69, img:'papas.jpg', d:'Perfectas para compartir y acompañar tu pizza.'},
      {n:'Nuggets de pollo', p:75, img:'nuggets.jpg', d:'Porción ideal para compartir o acompañar tu combo.'},
      {n:'Dedos de queso', p:79, img:'dedos.jpg', d:'Queso derretido con empanizado crujiente.'},
      {n:'Nachos con queso', p:60, img:'nachos.jpg', d:'Un extra delicioso para acompañar el pedido.'}
    ]
    gridExtras.innerHTML = extras.map(e => `
      <article class="mn-card">
        <div class="mn-card-img"><img src="img/${e.img}" alt="${e.n}"></div>
        <div class="mn-card-body">
          <div class="mn-card-top"><h3>${e.n}</h3><span class="mn-precio">$${e.p}</span></div>
          <p>${e.d}</p>
          <button class="mn-btn-agregar" onclick="agregarCarrito('${e.n}', ${e.p})">🛒 Agregar</button>
        </div>
      </article>`).join('')
  }
}

// ═══════════════════════════════════════
// STRAPI — Carga dinámica del menú
// ═══════════════════════════════════════
const STRAPI_URL = 'http://localhost:1337'

function strapiImgUrl(imagen) {
  if (!imagen) return 'img/pizza.png'
  return STRAPI_URL + (imagen.url || imagen.formats?.medium?.url || imagen.formats?.small?.url || '')
}

function renderCardPizza(p) {
  const img = strapiImgUrl(p.imagen)
  const badge = p.badge ? `<span class="mn-badge">${p.badge}</span>` : ''
  return `
    <article class="mn-card">
      <div class="mn-card-img">
        <img src="${img}" alt="${p.nombre}" onerror="this.src='img/pizza.png'">
        ${badge}
      </div>
      <div class="mn-card-body">
        <div class="mn-card-top"><h3>${p.nombre}</h3><span class="mn-precio">$${p.precio}</span></div>
        <p>${p.descripcion || ''}</p>
        <button class="mn-btn-agregar" onclick="abrirPizzaModal('${img}', 'Pizza ${p.nombre}', '${(p.descripcion||'').replace(/'/g,"\\'")}')">Ver detalles</button>
      </div>
    </article>`
}

function renderCardSimple(item, tipo) {
  const img = strapiImgUrl(item.imagen)
  return `
    <article class="mn-card">
      <div class="mn-card-img">
        <img src="${img}" alt="${item.nombre}" onerror="this.src='img/pizza.png'">
      </div>
      <div class="mn-card-body">
        <div class="mn-card-top"><h3>${item.nombre}</h3><span class="mn-precio">$${item.precio}</span></div>
        <p>${item.descripcion || ''}</p>
        <button class="mn-btn-agregar" onclick="agregarCarrito('${item.nombre}', ${item.precio})">🛒 Agregar</button>
      </div>
    </article>`
}

async function cargarMenuStrapi() {
  try {
    // Pizzas
    const resPizzas = await fetch(`${STRAPI_URL}/api/pizzas?populate=imagen&filters[activo][$eq]=true`)
    const jsonPizzas = await resPizzas.json()
    const gridPizzas = document.getElementById('grid-pizzas')
    if (gridPizzas) {
      if (jsonPizzas.data && jsonPizzas.data.length > 0) {
        gridPizzas.innerHTML = jsonPizzas.data.map(p => renderCardPizza(p)).join('')
      } else {
        gridPizzas.innerHTML = '<p style="color:#aaa;padding:20px">No hay pizzas disponibles.</p>'
      }
    }

    // Bebidas
    const resBebidas = await fetch(`${STRAPI_URL}/api/bebidas?populate=imagen&filters[activo][$eq]=true`)
    const jsonBebidas = await resBebidas.json()
    const gridBebidas = document.getElementById('grid-bebidas')
    if (gridBebidas) {
      if (jsonBebidas.data && jsonBebidas.data.length > 0) {
        gridBebidas.innerHTML = jsonBebidas.data.map(b => renderCardSimple(b, 'bebida')).join('')
      } else {
        gridBebidas.innerHTML = '<p style="color:#aaa;padding:20px">No hay bebidas disponibles.</p>'
      }
    }

    // Extras
    const resExtras = await fetch(`${STRAPI_URL}/api/extras?populate=imagen&filters[activo][$eq]=true`)
    const jsonExtras = await resExtras.json()
    const gridExtras = document.getElementById('grid-extras')
    if (gridExtras) {
      if (jsonExtras.data && jsonExtras.data.length > 0) {
        gridExtras.innerHTML = jsonExtras.data.map(e => renderCardSimple(e, 'extra')).join('')
      } else {
        gridExtras.innerHTML = '<p style="color:#aaa;padding:20px">No hay extras disponibles.</p>'
      }
    }

    // Complementos — usando la API de extras con tag complemento
    const resComp = await fetch(`${STRAPI_URL}/api/extras?populate=imagen&filters[activo][$eq]=true`)
    const jsonComp = await resComp.json()
    const gridComp = document.getElementById('grid-complementos')
    if (gridComp) {
      gridComp.innerHTML = '<p style="color:#aaa;padding:20px">No hay complementos disponibles.</p>'
    }

  } catch (err) {
    console.error('Error cargando menú desde Strapi:', err)
    cargarMenuEstatico()
  }
}

// Cargar combos en la página de inicio
async function cargarCombosStrapi() {
  try {
    const res = await fetch(`${STRAPI_URL}/api/combos?populate=imagen&filters[activo][$eq]=true`)
    const json = await res.json()
    if (!json.data || json.data.length === 0) return

    const row = document.querySelector('.pg-promos-row')
    if (!row) return

    row.innerHTML = json.data.map(c => {
      const img = strapiImgUrl(c.imagen)
      const precioAntes = c.precio_anterior ? `<span>$${c.precio_anterior}</span>` : ''
      const tagClass = {
        'DÚO': 'pg-tag-duo', 'FAMILIAR': 'pg-tag-familiar',
        'AHORRO': 'pg-tag-ahorro', 'NUEVO': 'pg-tag-custom'
      }[c.tag] || ''
      const accion = c.precio > 0
        ? `agregarCombo('${c.nombre}', ${c.precio})`
        : `mostrarSeccion('personalizar')`
      const btnLabel = c.precio > 0 ? 'ORDENA AQUÍ' : 'PERSONALIZAR'
      const precioTexto = c.precio > 0
        ? `${precioAntes}<strong>$${c.precio}</strong>`
        : `<strong>¡A tu gusto!</strong>`
      return `
        <div class="pg-promo-wide" onclick="${accion}">
          <div class="pg-promo-wide-img"><img src="${img}" alt="${c.nombre}" onerror="this.src='img/pizza.png'"></div>
          <div class="pg-promo-wide-body">
            ${c.tag ? `<span class="pg-promo-tag ${tagClass}">${c.tag}</span>` : ''}
            <h3>${c.nombre}</h3>
            <p>${c.descripcion || ''}</p>
            <div class="pg-promo-wide-precio">${precioTexto}</div>
          </div>
          <button class="pg-promo-wide-cta">${btnLabel}</button>
        </div>`
    }).join('')
  } catch (err) {
    console.error('Error cargando combos:', err)
  }
}

async function cargarOfertasStrapi() {
  try {
    const hoy = new Date().toISOString().split('T')[0]
    const res = await fetch(`${STRAPI_URL}/api/ofertas?populate=imagen&filters[activo][$eq]=true&filters[fecha_inicio][$lte]=${hoy}&filters[fecha_fin][$gte]=${hoy}`)
    const json = await res.json()
    if (!json.data || json.data.length === 0) return

    const col = document.querySelector('.pg-promos-col')
    if (!col) return

    col.innerHTML = json.data.map(o => {
      const img = strapiImgUrl(o.imagen)
      const tagClass = o.precio_anterior ? 'POPULAR' : ''
      return `
        <div class="pg-promo-card" onclick="agregarCombo('${o.nombre}', ${o.precio})">
          <div class="pg-promo-img"><img src="${img}" alt="${o.nombre}" onerror="this.src='img/pizza.png'"></div>
          <div class="pg-promo-info">
            <span class="pg-promo-tag">${tagClass}</span>
            <p>${o.descripcion || ''}<br><strong>${o.nombre}</strong></p>
            <div class="pg-promo-precio">
              ${o.precio_anterior ? `<span>$${o.precio_anterior}</span>` : ''}
              <strong>$${o.precio}</strong>
            </div>
            <button class="pg-promo-btn">ORDENA AQUÍ</button>
          </div>
        </div>`
    }).join('')
  } catch (err) {
    console.error('Error cargando ofertas:', err)
  }
}

document.addEventListener('DOMContentLoaded', () => {
  cargarMenuStrapi()
  cargarCombosStrapi()
  cargarOfertasStrapi()
})