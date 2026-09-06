
async function loadCatalogBrands() {
  const filters = document.getElementById('brandFilters');

  if (!filters) return;

  try {
    const response = await fetch(
      'https://pnsldiahjlnazouskkxk.supabase.co/rest/v1/brands?select=name,slug&order=name.asc',
      {
        headers: {
          apikey: 'sb_publishable_b212Q_Wc9-7C97UlreEj8A_O3JEcoJQ',
          Authorization: 'Bearer sb_publishable_b212Q_Wc9-7C97UlreEj8A_O3JEcoJQ'
        }
      }
    );

    const brands = await response.json();

    filters.innerHTML = `
      <button class="filter active" data-brand="">
        Все
      </button>
      ${brands.map(brand => `
        <button
          class="filter"
          data-brand="${escapeHtml(brand.name)}"
        >
          ${escapeHtml(brand.name)}
        </button>
      `).join('')}
    `;

    filters.querySelectorAll('.filter').forEach(button => {
      button.addEventListener('click', () => {

        filters.querySelectorAll('.filter').forEach(btn => {
          btn.classList.remove('active');
        });

        button.classList.add('active');

        const selectedBrand = button.dataset.brand || '';

        document.querySelectorAll('.product').forEach(card => {
          const cardBrand = card.dataset.brand || '';

          card.style.display =
            !selectedBrand || cardBrand === selectedBrand
              ? ''
              : 'none';
        });
      });
    });

  } catch (error) {
    console.error('Ошибка загрузки брендов:', error);
  }
}

loadCatalogBrands();
