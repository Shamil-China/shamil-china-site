
/* =========================================================
   SHAMIL | CHINA
   STORE FRONTEND
========================================================= */

const SUPABASE_URL =
  'https://pnsldiahjlnazouskkxk.supabase.co';

const SUPABASE_PUBLISHABLE_KEY =
  'sb_publishable_b212Q_Wc9-7C97UlreEj8A_O3JEcoJQ';


/* =========================================================
   РЕЗЕРВНЫЕ ТОВАРЫ
   Используются только если Supabase временно недоступен
========================================================= */

const fallbackProducts = {

  lvset: {
    rawBrand: 'Louis Vuitton',
    brand: 'LOUIS VUITTON • РЕПЛИКА',
    section: 'clothes',
    title: 'Чёрный комплект',
    desc:
      'Комплект из футболки и низа в чёрном цвете. Фактурный узор тон-в-тон, аккуратные детали и минималистичная подача.',
    variants: [
      'Комплект',
      'Чёрный',
      'Размеры — уточняйте'
    ],
    price: 'Уточняйте',
    images: [
      'lv_black_1.jpg',
      'lv_black_2.jpg',
      'lv_black_3.jpg',
      'lv_black_4.jpg'
    ]
  },

  lvbrown: {
    rawBrand: 'Louis Vuitton',
    brand: 'LOUIS VUITTON • РЕПЛИКА',
    section: 'clothes',
    title: 'Коричневая футболка',
    desc:
      'Однотонный корпус и рельефный Monogram-узор на рукавах. Спокойная модель с акцентом на фактуру.',
    variants: [
      'Коричневый',
      'Короткий рукав',
      'Размеры — уточняйте'
    ],
    price: 'Уточняйте',
    images: [
      'lv_brown_1.jpg',
      'lv_brown_2.jpg',
      'lv_brown_3.jpg',
      'lv_brown_4.jpg'
    ]
  },

  prada: {
    rawBrand: 'Prada',
    brand: 'PRADA • РЕПЛИКА',
    section: 'clothes',
    title: 'Чёрный джемпер',
    desc:
      'Минималистичный чёрный трикотажный джемпер с небольшим контрастным логотипом на груди.',
    variants: [
      'Чёрный',
      'Трикотаж',
      'На фото размер 50'
    ],
    price: 'Уточняйте',
    images: [
      'prada_1.jpg',
      'prada_2.jpg',
      'prada_3.jpg',
      'prada_4.jpg'
    ]
  },

  lvbasic: {
    rawBrand: 'Louis Vuitton',
    brand: 'LOUIS VUITTON • РЕПЛИКА',
    section: 'clothes',
    title: 'Футболка с LV-эмблемой',
    desc:
      'Минималистичная трикотажная футболка с небольшой объёмной LV-эмблемой на груди. Два цвета.',
    variants: [
      'White',
      'Navy',
      'На фото размер L'
    ],
    price: 'Уточняйте',
    images: [
      'lv_basic_white.jpg',
      'lv_basic_navy.jpg',
      'lv_basic_detail.jpg',
      'lv_basic_tags.jpg'
    ]
  }

};


let products = { ...fallbackProducts };

let selectedBrand = '';

const sectionFromUrl =
  new URLSearchParams(window.location.search)
    .get('section');

const allowedSections = [
  'clothes',
  'shoes',
  'accessories'
];

const selectedSection =
  allowedSections.includes(sectionFromUrl)
    ? sectionFromUrl
    : '';


/* =========================================================
   ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
========================================================= */

function escapeHtml(value = '') {

  return String(value).replace(
    /[&<>'"]/g,
    ch => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[ch])
  );

}


function normalize(value = '') {

  return String(value)
    .trim()
    .toLowerCase();

}


function displayBrand(product) {

  const brand =
    (product.brand || '').trim();

  if(
    product.is_replica &&
    !/реплика/i.test(brand)
  ) {
    return brand
      ? `${brand} • РЕПЛИКА`
      : 'РЕПЛИКА';
  }

  return brand;

}


/* =========================================================
   КАРТОЧКА ТОВАРА / MODAL
========================================================= */

function openProduct(id) {

  const product = products[id];

  if (!product) {
    return;
  }

  const modal =
    document.getElementById('modal');

  if (!modal) {
    return;
  }

  const brandEl =
    document.getElementById('modalBrand');

  const titleEl =
    document.getElementById('modalTitle');

  const descEl =
    document.getElementById('modalDesc');

  const mainImage =
    document.getElementById('mainImage');

  const variantsEl =
    document.getElementById('variants');

  const thumbsEl =
    document.getElementById('thumbs');

  if (brandEl) {
    brandEl.textContent =
      product.brand || '';
  }

  if (titleEl) {
    titleEl.textContent =
      product.title || '';
  }

  if (descEl) {
    descEl.textContent =
      product.desc || '';
  }

  const images =
    Array.isArray(product.images)
      ? product.images.filter(Boolean)
      : [];

  let currentImageIndex = 0;
  let touchStartX = 0;

  if (mainImage) {
    mainImage.src =
      images[0] || '';
  }

  if (variantsEl) {
    variantsEl.innerHTML =
      (product.variants || [])
        .filter(Boolean)
        .map(
          variant =>
            `<span class="variant">${escapeHtml(variant)}</span>`
        )
        .join('');
  }

  function showImage(index) {

    if (!mainImage || !images.length) {
      return;
    }

    currentImageIndex =
      (index + images.length) %
      images.length;

    mainImage.classList.add('fade-image');

setTimeout(() => {
  mainImage.src =
    images[currentImageIndex];

  mainImage.classList.remove('fade-image');
}, 120);

    if (thumbsEl) {
      thumbsEl
        .querySelectorAll('button')
        .forEach((button, i) => {
          button.classList.toggle(
            'active',
            i === currentImageIndex
          );
        });
    }
  }

  if (thumbsEl) {

    thumbsEl.innerHTML =
      images.map(
        (src, index) => `
          <button
            type="button"
            data-img-index="${index}"
          >
            <img
              src="${escapeHtml(src)}"
              alt=""
            >
          </button>
        `
      ).join('');

    thumbsEl
      .querySelectorAll('button')
      .forEach(button => {

        button.addEventListener(
          'click',
          () => {

            const index =
              Number(
                button.dataset.imgIndex
              );

            showImage(index);
          }
        );

      });
  }

  if (
    mainImage &&
    images.length > 1
  ) {

    mainImage.ontouchstart =
      event => {

        touchStartX =
          event.touches[0].clientX;
      };

    mainImage.ontouchend =
      event => {

        const touchEndX =
          event.changedTouches[0].clientX;

        const distance =
          touchEndX - touchStartX;

        if (
          Math.abs(distance) < 40
        ) {
          return;
        }

        if (distance < 0) {
          showImage(
            currentImageIndex + 1
          );
        } else {
          showImage(
            currentImageIndex - 1
          );
        }
      };
  }

  const priceEl =
    document.querySelector(
      '.price-line b'
    );

  if (priceEl) {
    priceEl.textContent =
      product.price || 'Уточняйте';
  }

  modal.classList.add('show');

  document.body.style.overflow =
    'hidden';
}


/* =========================================================
   ФИЛЬТРАЦИЯ КАТАЛОГА
   БРЕНД + РАЗДЕЛ
========================================================= */

function applyCatalogFilters() {

  const cards =
    document.querySelectorAll(
      '.product'
    );


  cards.forEach(card => {

    const cardBrand =
      normalize(
        card.dataset.brand || ''
      );

    const cardSection =
      card.dataset.section ||
      'clothes';


    const brandMatches =
      !selectedBrand ||
      cardBrand ===
        normalize(selectedBrand);


    const sectionMatches =
      !selectedSection ||
      cardSection ===
        selectedSection;


    card.style.display =
      brandMatches &&
      sectionMatches
        ? ''
        : 'none';

  });

}


/* =========================================================
   ДИНАМИЧЕСКИЕ БРЕНДЫ
========================================================= */

async function loadCatalogBrands() {

  const filters =
    document.getElementById(
      'brandFilters'
    );


  if(!filters){
    return;
  }


  let brands = [];


  try {

    const endpoint =
      `${SUPABASE_URL}/rest/v1/brands?select=name,slug&order=name.asc`;


    const response =
      await fetch(
        endpoint,
        {
          headers: {

            apikey:
              SUPABASE_PUBLISHABLE_KEY,

            Authorization:
              `Bearer ${SUPABASE_PUBLISHABLE_KEY}`

          }
        }
      );


    if(!response.ok){

      throw new Error(
        `Supabase ${response.status}`
      );

    }


    brands =
      await response.json();

  }
  catch(error) {

    console.warn(
      'Не удалось загрузить список брендов.',
      error
    );

  }


  /*
   Если таблица brands по какой-либо причине
   не загрузилась — собираем бренды из товаров.
  */

  if(
    !Array.isArray(brands) ||
    !brands.length
  ) {

    const names =
      new Set();


    document
      .querySelectorAll('.product')
      .forEach(card => {

        const brand =
          (
            card.dataset.brand || ''
          ).trim();

        if(brand){
          names.add(brand);
        }

      });


    brands =
      [...names]
        .sort()
        .map(name => ({
          name
        }));

  }


  /*
   Полностью пересоздаём кнопки.
  */

  filters.innerHTML = '';


  const allButton =
    document.createElement(
      'button'
    );

  allButton.type =
    'button';

  allButton.className =
    'filter active';

  allButton.textContent =
    'Все';

  allButton.dataset.brand =
    '';

  filters.appendChild(
    allButton
  );


  brands.forEach(brand => {

    if(!brand?.name){
      return;
    }


    const button =
      document.createElement(
        'button'
      );

    button.type =
      'button';

    button.className =
      'filter';

    button.textContent =
      brand.name;

    button.dataset.brand =
      brand.name;


    filters.appendChild(
      button
    );

  });


  filters
    .querySelectorAll('.filter')
    .forEach(button => {

      button.addEventListener(
        'click',
        () => {

          filters
            .querySelectorAll(
              '.filter'
            )
            .forEach(btn => {

              btn
                .classList
                .remove('active');

            });


          button
            .classList
            .add('active');


          selectedBrand =
            button.dataset.brand || '';


          applyCatalogFilters();

        }
      );

    });


  applyCatalogFilters();

}


/* =========================================================
   ОТРИСОВКА ТОВАРОВ ИЗ SUPABASE
========================================================= */

function renderDatabaseProducts(rows) {

  const grid =
    document.querySelector(
      '.product-grid'
    );


  if(!grid){
    return;
  }


  products = {};

  grid.innerHTML = '';


  if(
    !Array.isArray(rows) ||
    !rows.length
  ) {

    grid.innerHTML =
      '<p style="padding:20px 0">В этом разделе пока нет товаров.</p>';

    return;

  }


  rows.forEach(
    (row, index) => {

      const id =
        row.id ||
        `db-${index}`;


      const images =
        Array.isArray(
          row.image_urls
        )
          ? row.image_urls
              .filter(Boolean)
          : [];


      const variants = [

        ...(
          Array.isArray(
            row.colors
          )
            ? row.colors
            : []
        ),

        ...(
          Array.isArray(
            row.sizes
          )
            ? row.sizes.map(
                size =>
                  `Размер: ${size}`
              )
            : []
        )

      ];


      products[id] = {

        rawBrand:
          row.brand || '',

        brand:
          displayBrand(row),

        section:
          row.section ||
          'clothes',

        title:
          row.title || '',

        desc:
          row.description || '',

        variants,

        price:
          row.price_text ||
          'Уточняйте',

        images

      };


      const article =
        document.createElement(
          'article'
        );


      article.className =
        'product';


      /*
       Вот эти два поля нужны
       для фильтрации.
      */

      article.dataset.brand =
        row.brand || '';

      article.dataset.section =
        row.section ||
        'clothes';


      const replicaTag =
        row.is_replica
          ? 'РЕПЛИКА'
          : 'NEW';


      article.innerHTML = `

        <button
          class="gallery"
          type="button"
        >

          ${
            images[0]
              ? `
                <img
                  src="${escapeHtml(images[0])}"
                  alt="${escapeHtml(row.title || '')}"
                >
              `
              : `
                <div
                  style="
                    height:100%;
                    display:grid;
                    place-items:center;
                    background:#eee7dc;
                    color:#777;
                  "
                >
                  Нет фото
                </div>
              `
          }

          <span class="tag">
            ${escapeHtml(replicaTag)}
          </span>

        </button>


        <div class="product-meta">

          <div>

            <h3>
              ${escapeHtml(row.title || '')}
            </h3>

            <p>
              ${escapeHtml(
                [
                  row.brand,
                  row.price_text
                ]
                  .filter(Boolean)
                  .join(' • ')
              )}
            </p>

          </div>


          <button
            class="smallbtn"
            type="button"
          >
            Подробнее
          </button>

        </div>

      `;


      const galleryButton =
        article.querySelector(
          '.gallery'
        );


      const detailsButton =
        article.querySelector(
          '.smallbtn'
        );


      if(galleryButton){

        galleryButton
          .addEventListener(
            'click',
            () => openProduct(id)
          );

      }


      if(detailsButton){

        detailsButton
          .addEventListener(
            'click',
            () => openProduct(id)
          );

      }


      grid.appendChild(
        article
      );

    }
  );


  applyCatalogFilters();

}


/* =========================================================
   ЗАГРУЗКА ТОВАРОВ
========================================================= */

async function loadProductsFromSupabase() {

  const grid =
    document.querySelector(
      '.product-grid'
    );


  /*
   На главной страницы каталога нет,
   поэтому там ничего не загружаем.
  */

  if(!grid){
    return;
  }


  try {

    const endpoint =
      `${SUPABASE_URL}/rest/v1/products?select=*&is_published=eq.true&order=sort_order.asc,created_at.desc`;


    const response =
      await fetch(
        endpoint,
        {
          headers: {

            apikey:
              SUPABASE_PUBLISHABLE_KEY,

            Authorization:
              `Bearer ${SUPABASE_PUBLISHABLE_KEY}`

          }
        }
      );


    if(!response.ok){

      throw new Error(
        `Supabase ${response.status}`
      );

    }


    const rows =
      await response.json();


    renderDatabaseProducts(
      rows
    );

  }
  catch(error) {

    console.warn(
      'Каталог Supabase временно недоступен.',
      error
    );

  }

}


/* =========================================================
   БОКОВОЕ МЕНЮ
========================================================= */

function openMenu() {

  const menu =
    document.getElementById(
      'sideMenu'
    );

  if(menu){
    menu.classList.add('open');
  }

  document.body.style.overflow =
    'hidden';

}


function closeMenu() {

  const menu =
    document.getElementById(
      'sideMenu'
    );

  if(menu){
    menu.classList.remove('open');
  }

  document.body.style.overflow =
    '';

}


function toggleCatalogMenu() {

  const sub =
    document.getElementById(
      'menuSubcatalog'
    );

  const button =
    document.querySelector(
      '.menu-catalog-toggle'
    );


  if(sub){
    sub.classList.toggle(
      'open'
    );
  }


  if(button){
    button.classList.toggle(
      'open'
    );
  }

}


/* =========================================================
   ЗАПУСК
========================================================= */

document.addEventListener(
  'keydown',
  event => {

    if(event.key === 'Escape'){

      closeModal();

      closeMenu();

    }

  }
);


async function startStore() {

  /*
   Сначала товары.
   Потом бренды.
   Так фильтры точно знают,
   какие карточки существуют.
  */

  await loadProductsFromSupabase();

  await loadCatalogBrands();

  applyCatalogFilters();

}


startStore();

#mainImage {
  transition: opacity .22s ease;
}

#mainImage.fade-image {
  opacity: .35;
}
