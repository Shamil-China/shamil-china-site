
const SUPABASE_URL = 'https://pnsldiahjlnazouskkxk.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_b212Q_Wc9-7C97UlreEj8A_O3JEcoJQ';

const fallbackProducts = {
  lvset:{
    brand:'LOUIS VUITTON • РЕПЛИКА', title:'Чёрный комплект',
    desc:'Комплект из футболки и низа в чёрном цвете. Фактурный узор тон-в-тон, аккуратные детали и минималистичная подача.',
    variants:['Комплект','Чёрный','Размеры — уточняйте'],
    price:'Уточняйте',
    images:['lv_black_1.jpg','lv_black_2.jpg','lv_black_3.jpg','lv_black_4.jpg']
  },
  lvbrown:{
    brand:'LOUIS VUITTON • РЕПЛИКА', title:'Коричневая футболка',
    desc:'Однотонный корпус и рельефный Monogram-узор на рукавах. Спокойная модель с акцентом на фактуру.',
    variants:['Коричневый','Короткий рукав','Размеры — уточняйте'],
    price:'Уточняйте',
    images:['lv_brown_1.jpg','lv_brown_2.jpg','lv_brown_3.jpg','lv_brown_4.jpg']
  },
  prada:{
    brand:'PRADA • РЕПЛИКА', title:'Чёрный джемпер',
    desc:'Минималистичный чёрный трикотажный джемпер с небольшим контрастным логотипом на груди.',
    variants:['Чёрный','Трикотаж','На фото размер 50'],
    price:'Уточняйте',
    images:['prada_1.jpg','prada_2.jpg','prada_3.jpg','prada_4.jpg']
  },
  lvbasic:{
    brand:'LOUIS VUITTON • РЕПЛИКА', title:'Футболка с LV-эмблемой',
    desc:'Минималистичная трикотажная футболка с небольшой объёмной LV-эмблемой на груди. Два цвета.',
    variants:['White','Navy','На фото размер L'],
    price:'Уточняйте',
    images:['lv_basic_white.jpg','lv_basic_navy.jpg','lv_basic_detail.jpg','lv_basic_tags.jpg']
  }
};

let products = { ...fallbackProducts };

function escapeHtml(value='') {
  return String(value).replace(/[&<>'"]/g, ch => ({
    '&':'&amp;',
    '<':'&lt;',
    '>':'&gt;',
    "'":'&#39;',
    '"':'&quot;'
  }[ch]));
}

function displayBrand(p){
  const brand = (p.brand || '').trim();
  return p.is_replica && !/реплика/i.test(brand)
    ? `${brand} • РЕПЛИКА`
    : brand;
}

function openProduct(id){
  const p = products[id];
  if (!p) return;

  document.getElementById('modalBrand').textContent = p.brand || '';
  document.getElementById('modalTitle').textContent = p.title || '';
  document.getElementById('modalDesc').textContent = p.desc || '';

  const images = p.images?.length ? p.images : [];

  document.getElementById('mainImage').src = images[0] || '';

  document.getElementById('variants').innerHTML =
    (p.variants || [])
      .filter(Boolean)
      .map(v => `<span class="variant">${escapeHtml(v)}</span>`)
      .join('');

  document.getElementById('thumbs').innerHTML =
    images
      .map((src, i) => `
        <button type="button" data-img-index="${i}">
          <img src="${escapeHtml(src)}" alt="">
        </button>
      `)
      .join('');

  document.querySelectorAll('#thumbs button').forEach(btn => {
    btn.addEventListener('click', () => {
      document.getElementById('mainImage').src =
        images[Number(btn.dataset.imgIndex)] || '';
    });
  });

  const priceEl = document.querySelector('.price-line b');
  if (priceEl) {
    priceEl.textContent = p.price || 'Уточняйте';
  }

  document.getElementById('modal').classList.add('show');
  document.body.style.overflow = 'hidden';
}

function closeModal(){
  document.getElementById('modal').classList.remove('show');
  document.body.style.overflow = '';
}

function setupFilters(){
  document.querySelectorAll('.filter').forEach(btn => {
    btn.onclick = () => {
      document.querySelectorAll('.filter')
        .forEach(x => x.classList.remove('active'));

      btn.classList.add('active');

      const f = btn.dataset.filter;

      document.querySelectorAll('.product').forEach(p => {
        p.style.display =
          (f === 'all' || p.dataset.category === f)
            ? ''
            : 'none';
      });
    };
  });
}

function renderDatabaseProducts(rows){
  const grid = document.querySelector('.product-grid');
  if (!grid || !rows?.length) return;

  products = {};
  grid.innerHTML = '';

  rows.forEach((row, index) => {
    const id = row.id || `db-${index}`;

    const images =
      Array.isArray(row.image_urls)
        ? row.image_urls.filter(Boolean)
        : [];

    const variants = [
      ...(Array.isArray(row.colors) ? row.colors : []),
      ...(Array.isArray(row.sizes)
        ? row.sizes.map(s => `Размер: ${s}`)
        : [])
    ];

    products[id] = {
      brand: displayBrand(row),
      title: row.title,
      desc: row.description || '',
      variants,
      price: row.price_text || 'Уточняйте',
      images
    };

    const article = document.createElement('article');

    article.className = 'product';
    article.dataset.category = row.category || 'other';

    const replicaTag =
      row.is_replica ? 'РЕПЛИКА' : 'NEW';

    article.innerHTML = `
      <button class="gallery" type="button">
        ${
          images[0]
            ? `<img src="${escapeHtml(images[0])}" alt="${escapeHtml(row.title)}">`
            : '<div style="height:100%;display:grid;place-items:center;background:#eee7dc;color:#777">Нет фото</div>'
        }
        <span class="tag">${replicaTag}</span>
      </button>

      <div class="product-meta">
        <div>
          <h3>${escapeHtml(row.title)}</h3>
          <p>
            ${escapeHtml(
              [row.brand, row.price_text]
                .filter(Boolean)
                .join(' • ')
            )}
          </p>
        </div>

        <button class="smallbtn" type="button">
          Подробнее
        </button>
      </div>
    `;

    article
      .querySelector('.gallery')
      .addEventListener('click', () => openProduct(id));

    article
      .querySelector('.smallbtn')
      .addEventListener('click', () => openProduct(id));

    grid.appendChild(article);
  });

  setupFilters();
}

async function loadProductsFromSupabase(){
  try {
    const endpoint =
      `${SUPABASE_URL}/rest/v1/products` +
      `?select=*` +
      `&is_published=eq.true` +
      `&order=sort_order.asc,created_at.desc`;

    const res = await fetch(endpoint, {
      headers: {
        apikey: SUPABASE_PUBLISHABLE_KEY,
        Authorization: `Bearer ${SUPABASE_PUBLISHABLE_KEY}`
      }
    });

    if (!res.ok) {
      throw new Error(`Supabase ${res.status}`);
    }

    const rows = await res.json();

    if (Array.isArray(rows) && rows.length) {
      renderDatabaseProducts(rows);
    }
  } catch (err) {
    console.warn(
      'Каталог Supabase временно недоступен, показан резервный каталог.',
      err
    );
  }
}

setupFilters();

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    closeModal();
  }
});

loadProductsFromSupabase();
function openMenu() {
  document.getElementById('sideMenu')?.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeMenu() {
  document.getElementById('sideMenu')?.classList.remove('open');
  document.body.style.overflow = '';
}
function toggleCatalogMenu(){
  const sub = document.getElementById('menuSubcatalog');
  const btn = document.querySelector('.menu-catalog-toggle');

  sub?.classList.toggle('open');
  btn?.classList.toggle('open');
}
