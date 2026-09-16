const products=[
{id:'p1',name:'Polo Grone Personalizado',cat:'polo',price:45,desc:'Nombre, frase y talla a pedido.',img:'assets/polo-grone.jpg'},
{id:'p2',name:'Banderola de Barrio',cat:'banderola',price:95,desc:'Formato personalizado para grupo, viaje o tribuna.',img:'assets/banderola-barrio.jpg'},
{id:'p3',name:'Tela Íntima',cat:'tela',price:80,desc:'Diseño, medidas y acabados coordinados por pedido.',img:'assets/tela-intima.jpg'},
{id:'p4',name:'Pack de Grupo',cat:'custom',price:160,desc:'Polo + tela o banderola para tu gente.',img:'assets/pack-grupo.jpg'},
{id:'p5',name:'Polo Tribuna',cat:'polo',price:40,desc:'Modelo ligero para estadio y calle.',img:'assets/polo-tribuna.jpg'},
{id:'p6',name:'Banderola Especial',cat:'banderola',price:120,desc:'Formato grande, frase y diseño a medida.',img:'assets/banderola-especial.jpg'}
];
const money=n=>`S/ ${n.toFixed(0)}`;
let cart=JSON.parse(localStorage.getItem('rhg_cart')||'[]');
const grid=document.getElementById('productGrid');
function renderProducts(filter='all'){
 grid.innerHTML=products.filter(p=>filter==='all'||p.cat===filter).map(p=>`<article class="product-card reveal visible"><div class="product-media"><img src="${p.img}" alt="${p.name}" onerror="this.remove();this.parentElement.innerHTML='<div class=\'product-placeholder\'>RINCÓN<br>GRONE</div>'"></div><div class="product-info"><small>${p.cat.toUpperCase()}</small><h3>${p.name}</h3><p>${p.desc}</p><div class="product-buy"><strong>Desde ${money(p.price)}</strong><button onclick="addCart('${p.id}')">Reservar</button></div></div></article>`).join('');
}
window.addCart=id=>{const p=products.find(x=>x.id===id);const item=cart.find(x=>x.id===id);item?item.qty++:cart.push({...p,qty:1});saveCart();openCart();};
function saveCart(){localStorage.setItem('rhg_cart',JSON.stringify(cart));document.getElementById('cartCount').textContent=cart.reduce((a,b)=>a+b.qty,0);renderCart();}
function renderCart(){const root=document.getElementById('cartItems');if(!cart.length){root.innerHTML='<p style="color:#8292aa">Tu pedido todavía está vacío.</p>';}else root.innerHTML=cart.map((x,i)=>`<div class="cart-row"><div><b>${x.name}</b><small>${x.qty} × ${money(x.price)}</small></div><button onclick="removeCart(${i})">Quitar</button></div>`).join('');document.getElementById('cartTotal').textContent=money(cart.reduce((a,b)=>a+b.price*b.qty,0));}
window.removeCart=i=>{cart.splice(i,1);saveCart();};
const drawer=document.getElementById('drawer'),overlay=document.getElementById('overlay');
function openCart(){drawer.classList.add('open');overlay.classList.add('open');drawer.setAttribute('aria-hidden','false');}
function closeCart(){drawer.classList.remove('open');overlay.classList.remove('open');drawer.setAttribute('aria-hidden','true');}
document.getElementById('cartBtn').onclick=openCart;document.getElementById('closeCart').onclick=closeCart;overlay.onclick=closeCart;
document.getElementById('filters').addEventListener('click',e=>{if(e.target.tagName!=='BUTTON')return;[...e.currentTarget.children].forEach(b=>b.classList.remove('active'));e.target.classList.add('active');renderProducts(e.target.dataset.filter);});
document.getElementById('sendOrder').onclick=()=>{if(!cart.length)return;const lines=cart.map(x=>`• ${x.name} x${x.qty}`).join('\n');const total=money(cart.reduce((a,b)=>a+b.price*b.qty,0));shareWhatsApp(`Hola, quiero reservar este pedido en Rincón del Hincha Grone:\n${lines}\nTotal referencial: ${total}\n¿Me confirman disponibilidad y precio final?`)};
function shareWhatsApp(text){window.open(`https://wa.me/?text=${encodeURIComponent(text)}`,'_blank','noopener');}
document.getElementById('customForm').addEventListener('submit',e=>{e.preventDefault();const txt=`Hola, quiero cotizar un pedido personalizado en Rincón del Hincha Grone.\nNombre: ${name.value}\nProducto: ${type.value}\nCantidad: ${qty.value}\nMedidas/talla: ${size.value||'por definir'}\nIdea: ${idea.value}`;shareWhatsApp(txt);});
const menuBtn=document.getElementById('menuBtn'),nav=document.getElementById('mainNav');menuBtn.onclick=()=>nav.classList.toggle('open');nav.querySelectorAll('a').forEach(a=>a.onclick=()=>nav.classList.remove('open'));
const reveals=document.querySelectorAll('.reveal');const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible')}),{threshold:.1});reveals.forEach(el=>io.observe(el));
const soundBtn=document.getElementById('soundBtn'),audio=document.getElementById('ambientAudio');let soundOn=false;soundBtn.onclick=async()=>{try{if(soundOn){audio.pause();soundOn=false;soundBtn.textContent='🔇 Ambiente de tribuna';}else{await audio.play();soundOn=true;soundBtn.textContent='🔊 Sonando · tocar para silenciar';}}catch{soundBtn.textContent='🎵 Agrega un audio autorizado en /assets/audio/';}};
const chants=[['Tribuna blanquiazul','Aquí podremos conectar canciones o audios propios/licenciados sin reproducirlos automáticamente.'],['Viaje y barrio','Una sección para mostrar telas, fechas, grupos y pedidos especiales de viaje.'],['Día de partido','Puede convertirse en repertorio, avisos de entrega y reservas para recoger antes de entrar.']];let ci=0;function chant(){chantTitle.textContent=chants[ci][0];chantText.textContent=chants[ci][1]}chantPrev.onclick=()=>{ci=(ci-1+chants.length)%chants.length;chant()};chantNext.onclick=()=>{ci=(ci+1)%chants.length;chant()};
renderProducts();saveCart();document.getElementById('year').textContent=new Date().getFullYear();
