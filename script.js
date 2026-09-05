
const products = {
  lvset:{
    brand:"LOUIS VUITTON • РЕПЛИКА",
    title:"Чёрный комплект",
    desc:"Комплект из футболки и низа в чёрном цвете. Фактурный узор тон-в-тон, аккуратные детали и минималистичная подача.",
    variants:["Комплект","Чёрный","Размеры — уточняйте"],
    images:["assets/lv_black_1.jpg","assets/lv_black_2.jpg","assets/lv_black_3.jpg","assets/lv_black_4.jpg"]
  },
  lvbrown:{
    brand:"LOUIS VUITTON • РЕПЛИКА",
    title:"Коричневая футболка",
    desc:"Однотонный корпус и рельефный Monogram-узор на рукавах. Спокойная модель с акцентом на фактуру.",
    variants:["Коричневый","Короткий рукав","Размеры — уточняйте"],
    images:["assets/lv_brown_1.jpg","assets/lv_brown_2.jpg","assets/lv_brown_3.jpg","assets/lv_brown_4.jpg"]
  },
  prada:{
    brand:"PRADA • РЕПЛИКА",
    title:"Чёрный джемпер",
    desc:"Минималистичный чёрный трикотажный джемпер с небольшим контрастным логотипом на груди.",
    variants:["Чёрный","Трикотаж","На фото размер 50"],
    images:["assets/prada_1.jpg","assets/prada_2.jpg","assets/prada_3.jpg","assets/prada_4.jpg"]
  },
  lvbasic:{
    brand:"LOUIS VUITTON • РЕПЛИКА",
    title:"Футболка с LV-эмблемой",
    desc:"Минималистичная трикотажная футболка с небольшой объёмной LV-эмблемой на груди. Два цвета.",
    variants:["White","Navy","На фото размер L"],
    images:["assets/lv_basic_white.jpg","assets/lv_basic_navy.jpg","assets/lv_basic_detail.jpg","assets/lv_basic_tags.jpg"]
  }
};

function openProduct(id){
  const p = products[id];
  document.getElementById('modalBrand').textContent = p.brand;
  document.getElementById('modalTitle').textContent = p.title;
  document.getElementById('modalDesc').textContent = p.desc;
  document.getElementById('mainImage').src = p.images[0];
  document.getElementById('variants').innerHTML = p.variants.map(v=>`<span class="variant">${v}</span>`).join('');
  document.getElementById('thumbs').innerHTML = p.images.map(src=>`<button onclick="document.getElementById('mainImage').src='${src}'"><img src="${src}" alt=""></button>`).join('');
  document.getElementById('modal').classList.add('show');
  document.body.style.overflow='hidden';
}
function closeModal(){
  document.getElementById('modal').classList.remove('show');
  document.body.style.overflow='';
}
document.querySelectorAll('.filter').forEach(btn=>{
  btn.addEventListener('click',()=>{
    document.querySelectorAll('.filter').forEach(x=>x.classList.remove('active'));
    btn.classList.add('active');
    const f=btn.dataset.filter;
    document.querySelectorAll('.product').forEach(p=>p.style.display=(f==='all'||p.dataset.category===f)?'':'none');
  })
});
document.addEventListener('keydown',e=>{if(e.key==='Escape') closeModal()});
