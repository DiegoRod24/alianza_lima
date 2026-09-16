(()=>{
  const qs=(s,r=document)=>r.querySelector(s), qsa=(s,r=document)=>[...r.querySelectorAll(s)];
  const isMobile=()=>window.matchMedia('(max-width:700px)').matches;

  /* Marca principal */
  document.title='ParaTodaLaVida | Hinchas por siempre';
  const metaDesc=qs('meta[name="description"]');
  if(metaDesc)metaDesc.content='ParaTodaLaVida: polos, telas, banderolas y pedidos personalizados con identidad de barrio y tribuna.';
  let favicon=qs('link[rel="icon"]');
  if(!favicon){favicon=document.createElement('link');favicon.rel='icon';document.head.appendChild(favicon)}
  favicon.href='assets/brand/paratodalavida-mark.svg';
  qs('.brand')?.setAttribute('aria-label','ParaTodaLaVida - Hinchas por siempre');

  /* Showcase visual usando trabajos reales existentes */
  const ticker=qs('.ticker');
  if(ticker&&!qs('.mobile-showcase')){
    const section=document.createElement('section');
    section.className='mobile-showcase';
    section.innerHTML=`
      <div class="showcase-heading reveal visible">
        <div><p>PARATODALAVIDA · HINCHAS POR SIEMPRE</p><h2>HECHO PARA VERSE<br>EN LA CALLE.</h2></div>
        <div class="showcase-controls"><button type="button" data-showcase-prev aria-label="Anterior">←</button><button type="button" data-showcase-next aria-label="Siguiente">→</button></div>
      </div>
      <div class="showcase-track" id="showcaseTrack">
        ${[4,1,8,12,18].map((n,i)=>`<button type="button" class="showcase-card${i===0?' is-active':''}" data-src="assets/galeria/trabajo-${String(n).padStart(2,'0')}.webp"><img loading="lazy" src="assets/galeria/trabajo-${String(n).padStart(2,'0')}.webp" alt="Trabajo destacado ${i+1}"><span class="showcase-meta"><small>${i===0?'DESDE LA TRIBUNA':i===1?'HECHO POR NOSOTROS':i===2?'BARRIO Y PASIÓN':i===3?'TRABAJO REAL':'IDENTIDAD GRONE'}</small><strong>${i===0?'PARA TODA LA VIDA':i===1?'TU IDEA HECHA REAL':i===2?'PARA TU GENTE':i===3?'HECHO A PEDIDO':'LLEVA TU HISTORIA'}</strong></span></button>`).join('')}
      </div>
      <div class="showcase-dots" id="showcaseDots"></div>`;
    ticker.insertAdjacentElement('afterend',section);

    const track=qs('#showcaseTrack'), cards=qsa('.showcase-card',track), dots=qs('#showcaseDots');
    dots.innerHTML=cards.map((_,i)=>`<button type="button" aria-label="Ir al destacado ${i+1}" class="${i===0?'active':''}"></button>`).join('');
    const dotBtns=qsa('button',dots);
    const go=i=>{const card=cards[(i+cards.length)%cards.length];card.scrollIntoView({behavior:'smooth',inline:'center',block:'nearest'});};
    qs('[data-showcase-prev]').onclick=()=>go(Math.max(0,cards.findIndex(c=>c.classList.contains('is-active'))-1));
    qs('[data-showcase-next]').onclick=()=>go(Math.min(cards.length-1,cards.findIndex(c=>c.classList.contains('is-active'))+1));
    dotBtns.forEach((b,i)=>b.onclick=()=>go(i));
    const obs=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting&&e.intersectionRatio>.62){cards.forEach(c=>c.classList.remove('is-active'));dotBtns.forEach(d=>d.classList.remove('active'));e.target.classList.add('is-active');const i=cards.indexOf(e.target);dotBtns[i]?.classList.add('active')}}),{root:track,threshold:[.62,.75,.9]});
    cards.forEach(c=>obs.observe(c));
    let timer=setInterval(()=>{if(!document.hidden&&isMobile()){const i=cards.findIndex(c=>c.classList.contains('is-active'));go((i+1)%cards.length)}},5200);
    track.addEventListener('pointerdown',()=>{clearInterval(timer)},{once:true});
    cards.forEach(c=>c.addEventListener('click',()=>openImage(c.dataset.src)));
  }

  /* Controles para carruseles existentes en móvil */
  const makeControls=(el,label)=>{
    if(!el||el.dataset.rhgControls)return;
    el.dataset.rhgControls='1';
    const shell=document.createElement('div');shell.className='rhg-carousel-shell';
    el.parentNode.insertBefore(shell,el);shell.appendChild(el);
    const ctr=document.createElement('div');ctr.className='rhg-carousel-controls';
    ctr.innerHTML=`<button type="button" aria-label="Anterior">‹</button><span class="rhg-carousel-label">1 / 1</span><button type="button" aria-label="Siguiente">›</button>`;
    shell.appendChild(ctr);
    const [prev,,next]=ctr.children,labelEl=qs('.rhg-carousel-label',ctr);
    const items=()=>[...el.children].filter(x=>getComputedStyle(x).display!=='none');
    const centerIndex=()=>{const arr=items();if(!arr.length)return 0;const center=el.scrollLeft+el.clientWidth/2;let best=0,dist=Infinity;arr.forEach((it,i)=>{const d=Math.abs((it.offsetLeft+it.offsetWidth/2)-center);if(d<dist){dist=d;best=i}});return best};
    const update=()=>{const arr=items();labelEl.textContent=arr.length?`${centerIndex()+1} / ${arr.length}`:'0 / 0'};
    const step=dir=>{const arr=items();if(!arr.length)return;const i=Math.max(0,Math.min(arr.length-1,centerIndex()+dir));arr[i].scrollIntoView({behavior:'smooth',inline:'center',block:'nearest'})};
    prev.onclick=()=>step(-1);next.onclick=()=>step(1);el.addEventListener('scroll',()=>requestAnimationFrame(update),{passive:true});
    new MutationObserver(()=>setTimeout(update,50)).observe(el,{childList:true,subtree:false});
    setTimeout(update,80);
  };
  makeControls(qs('.history-line'),'Historia');
  makeControls(qs('.mystique-grid'),'Mística');
  makeControls(qs('#productGrid'),'Productos');
  makeControls(qs('#gallery'),'Trabajos');

  /* Mejora visual de filtros */
  qs('#filters')?.addEventListener('click',e=>{
    if(e.target.tagName!=='BUTTON')return;
    e.target.classList.add('rhg-tap');setTimeout(()=>e.target.classList.remove('rhg-tap'),340);
    setTimeout(()=>{const grid=qs('#productGrid');if(isMobile()&&grid)grid.scrollTo({left:0,behavior:'smooth'})},80);
  });

  /* Feedback táctil para botones */
  document.addEventListener('click',e=>{
    const b=e.target.closest('.btn,.product-buy button,.cart,.sound,.filters button');
    if(!b)return;b.classList.remove('rhg-tap');void b.offsetWidth;b.classList.add('rhg-tap');setTimeout(()=>b.classList.remove('rhg-tap'),340);
  });

  /* Lightbox con flechas y swipe */
  const lightbox=qs('#lightbox'), lightboxImg=qs('#lightboxImg');
  if(lightbox&&lightboxImg&&!qs('.lightbox-counter',lightbox)){
    const counter=document.createElement('div');counter.className='lightbox-counter';lightbox.appendChild(counter);
    const prev=document.createElement('button');prev.className='lightbox-arrow lightbox-prev';prev.type='button';prev.textContent='‹';prev.setAttribute('aria-label','Imagen anterior');lightbox.appendChild(prev);
    const next=document.createElement('button');next.className='lightbox-arrow lightbox-next';next.type='button';next.textContent='›';next.setAttribute('aria-label','Imagen siguiente');lightbox.appendChild(next);
    let current=0;
    const files=Array.from({length:49},(_,i)=>`assets/galeria/trabajo-${String(i+1).padStart(2,'0')}.webp`);
    const show=i=>{current=(i+files.length)%files.length;lightbox.classList.add('swiping');setTimeout(()=>{lightboxImg.src=files[current];counter.textContent=`${current+1} / ${files.length}`;lightbox.classList.remove('swiping')},110)};
    const originalOpen=qs('#gallery');
    originalOpen?.addEventListener('click',e=>{const b=e.target.closest('.gallery-item');if(!b)return;const idx=files.indexOf(b.dataset.src);if(idx>=0){current=idx;counter.textContent=`${current+1} / ${files.length}`}},true);
    const showFromSrc=src=>{const idx=files.indexOf(src);if(idx>=0){current=idx;counter.textContent=`${current+1} / ${files.length}`;lightboxImg.src=src;lightbox.classList.add('open')}};
    window.openImage=showFromSrc;
    prev.onclick=e=>{e.stopPropagation();show(current-1)};next.onclick=e=>{e.stopPropagation();show(current+1)};
    let sx=0,sy=0;
    lightbox.addEventListener('touchstart',e=>{sx=e.touches[0].clientX;sy=e.touches[0].clientY},{passive:true});
    lightbox.addEventListener('touchend',e=>{const dx=e.changedTouches[0].clientX-sx,dy=e.changedTouches[0].clientY-sy;if(Math.abs(dx)>55&&Math.abs(dx)>Math.abs(dy)*1.15)show(current+(dx<0?1:-1))},{passive:true});
    document.addEventListener('keydown',e=>{if(!lightbox.classList.contains('open'))return;if(e.key==='ArrowRight')show(current+1);if(e.key==='ArrowLeft')show(current-1)});
  } else {
    window.openImage=src=>{if(lightbox&&lightboxImg){lightboxImg.src=src;lightbox.classList.add('open')}};
  }

  /* Tilt / profundidad del card 3D */
  const hero3d=qs('.hero-3d');
  if(hero3d){
    const reset=()=>hero3d.style.transform='perspective(1200px) rotateX(0deg) rotateY(0deg)';
    hero3d.addEventListener('pointermove',e=>{if(isMobile())return;const r=hero3d.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;hero3d.style.transform=`perspective(1200px) rotateX(${-y*4}deg) rotateY(${x*5}deg)`});
    hero3d.addEventListener('pointerleave',reset);
    let tx=.5,ty=.5;
    hero3d.addEventListener('touchmove',e=>{const t=e.touches[0],r=hero3d.getBoundingClientRect();tx=(t.clientX-r.left)/r.width-.5;ty=(t.clientY-r.top)/r.height-.5;hero3d.style.transform=`perspective(1100px) rotateX(${-ty*2.5}deg) rotateY(${tx*3}deg)`},{passive:true});
    hero3d.addEventListener('touchend',reset,{passive:true});
  }

  /* Pausa autoplay visual cuando pestaña no está visible */
  document.addEventListener('visibilitychange',()=>document.body.classList.toggle('page-hidden',document.hidden));
})();