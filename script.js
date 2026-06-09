/* =========================================================
   Connect. — site interactions
   Mirrors mahdisaiah.github.io interactions (B&W version).
   ========================================================= */

/* ----- Image fallback (graceful placeholder until real assets land) ----- */
(function imageFallback(){
  const PLACEHOLDER = 'images/placeholder.svg';
  document.querySelectorAll('img').forEach((img)=>{
    img.addEventListener('error', ()=>{
      if (img.dataset.fellBack === '1') return;
      img.dataset.fellBack = '1';
      img.src = PLACEHOLDER;
    }, { once:true });
  });
})();

/* ----- i18n ----- */
const translations = {
  fr: {
    'nav.stories':'Stories','nav.debates':'Débats','nav.tide':'Tide',
    'nav.offline':'Hors-ligne','nav.pro':'Pro','nav.about':'À propos','nav.contact':'Contact',

    'hero.tagline':'Une app sociale pensée pour la vraie conversation — iOS · Mai 2026',
    'hero.cta1':'Voir l\'app','hero.cta2':'Lire le manifeste','hero.scroll':'Défiler',

    'connect.label':'Produit mobile','connect.meta':'iOS — Mai 2026',
    'connect.title':'Une app sociale pensée pour la vraie conversation.',
    'connect.lead':"Connect est une plateforme sociale moderne où l'on partage des posts, des moments et des débats autour de contenus réels du web. Elle privilégie l'interaction plutôt que la consommation : réagir, discuter et challenger les idées au lieu de simplement scroller.",
    'connect.lead2':"Un design épuré et immersif. Connect transforme le réseau social en un espace d'expression, de conversation et d'engagement réel.",
    'connect.m1.label':'Plateforme','connect.m1.val':'iOS à la sortie · Android bientôt',
    'connect.m2.label':'Sortie','connect.m2.val':'31 Mai · 2026',
    'connect.m3.label':'Compte à rebours',
    'connect.cap1':'Accueil','connect.cap2':'Débat','connect.cap3':'Profil',
    'connect.phone1.text':"Un fil en temps réel où posts, instants et réactions cohabitent.",
    'connect.phone2.text':"Des arènes Pour/Contre. Les idées se confrontent, pas juste likées.",
    'connect.phone3.text':"Une identité pensée pour l'expression, pas pour les métriques.",

    'debates.label':'Débats','debates.title':'Un agent qui lit chaque débat et le tague.',
    'debates.lead':"Trois à cinq slugs de taxonomie écrits sur chaque débat. Un graphe de sujets voisins l'envoie aux personnes que ça intéresse vraiment.",
    'debates.v1':'Grille du centre des débats','debates.v2':'Vote Pour/Contre','debates.v3':'Détail d\'un sujet','debates.v4':'Réactions du fil',

    'tide.label':'Bien-être','tide.title':'Tide. Un pacer de respiration de résonance.',
    'tide.lead':"Cinq secondes d'inspiration, cinq secondes d'expiration. Six respirations par minute. Le protocole le plus puissant connu pour la variabilité cardiaque.",
    'tide.piece':'Image',

    'offline.label':'Hors-ligne','offline.title':'Quand le réseau tombe, une petite pièce s\'ouvre.',
    'offline.lead':"Quatre jeux. Pas de comptes, pas de serveurs, pas de score au-delà de ce qui est à l'écran. Ils tournent quand le reste de l'app ne peut pas.",
    'offline.net.t':'Net.','offline.net.p':"Tourner pour réparer le réseau.",
    'offline.tide.t':'Tide.','offline.tide.p':"Respirer avec un inconnu.",
    'offline.spin.t':'Spin.','offline.spin.p':"Une roue décide qui doit répondre.",
    'offline.faker.t':'Faker.','offline.faker.p':"L'un de vous ne sait rien.",

    'pro.label':'Tarif','pro.title':'Connect Pro. La même app, avec plus de place.',
    'pro.lead':"La pub finance le gratuit. Pro la coupe, et ouvre les surfaces qui ont besoin d'un peu plus de place.",
    'pro.free':'Gratuit','pro.pro':'Pro',

    'about.label':'Créateur','about.title':"Une petite app sociale, faite par une personne, avec intention.",
    'about.lead':"Mahdi, basé à Paris. Connect a commencé comme un projet personnel, et le reste. Pas d'équipe, pas de pitch deck, pas de roadmap publique.",
    'about.based':'Basé à','about.origin':'Origine','about.languages':'Langues',
    'about.statuslabel':'Statut','about.status':'Lancement le 31 Mai 2026',

    'contact.label':'Lien','contact.title':"Reste au courant pour le lancement.",
    'contact.lead':"Pré-inscription par mail. Ou suivez le projet via les liens ci-dessous.",
    'contact.email':'Email','contact.cv':'Pré-inscription','contact.available':'Lancement Mai 2026'
  },
  en: {}
};

let lang = localStorage.getItem('lang') || 'en';
const langToggle = document.getElementById('langToggle');

function applyLang(){
  document.documentElement.lang = lang;
  document.querySelectorAll('[data-i18n]').forEach((el)=>{
    const key = el.dataset.i18n;
    const txt = translations[lang]?.[key];
    if (txt) el.textContent = txt;
  });
  if (langToggle){
    const cur = langToggle.querySelector('.lang-current');
    const nxt = langToggle.querySelector('.lang-next');
    if (cur && nxt){
      cur.textContent = lang.toUpperCase();
      nxt.textContent = lang === 'en' ? 'FR' : 'EN';
    }
  }
  localStorage.setItem('lang', lang);
}

if (langToggle){
  langToggle.addEventListener('click', ()=>{
    lang = lang === 'en' ? 'fr' : 'en';
    applyLang();
    tickCountdown();
  });
}
applyLang();

/* ----- Footer year ----- */
const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();

/* ----- Countdown to May 31 2026 ----- */
const countdown = document.getElementById('countdown');
function tickCountdown(){
  if (!countdown) return;
  const target = new Date('2026-05-31T00:00:00');
  const ms = target - new Date();
  if (ms <= 0){
    countdown.textContent = lang === 'fr' ? 'Lancé' : 'Launched';
    return;
  }
  const d = Math.floor(ms/86400000);
  const h = Math.floor((ms%86400000)/3600000);
  const m = Math.floor((ms%3600000)/60000);
  const dL = lang === 'fr' ? 'j' : 'd';
  countdown.textContent = `${d}${dL} ${String(h).padStart(2,'0')}h ${String(m).padStart(2,'0')}m`;
}
tickCountdown();
setInterval(tickCountdown, 60000);

/* ----- Mobile menu ----- */
const siteHeader = document.getElementById('siteHeader');
const navMenuBtn = document.getElementById('navMenuBtn');
const mobilePanel = document.getElementById('mobilePanel');

if (navMenuBtn && siteHeader && mobilePanel){
  navMenuBtn.addEventListener('click', ()=>{
    const isOpen = siteHeader.classList.toggle('menu-open');
    navMenuBtn.setAttribute('aria-expanded', String(isOpen));
    mobilePanel.setAttribute('aria-hidden', String(!isOpen));
  });
  document.querySelectorAll('.mobile-link').forEach((link)=>{
    link.addEventListener('click', ()=>{
      siteHeader.classList.remove('menu-open');
      navMenuBtn.setAttribute('aria-expanded', 'false');
      mobilePanel.setAttribute('aria-hidden', 'true');
    });
  });
  window.addEventListener('keydown', (e)=>{
    if (e.key === 'Escape'){
      siteHeader.classList.remove('menu-open');
      navMenuBtn.setAttribute('aria-expanded', 'false');
      mobilePanel.setAttribute('aria-hidden', 'true');
    }
  });
}

/* ----- Active nav + scrolled header ----- */
const sectionsForNav = Array.from(document.querySelectorAll('section[id]'));

function onScroll(){
  if (sectionsForNav.length){
    let currentId = sectionsForNav[0].id;
    sectionsForNav.forEach((s)=>{
      const r = s.getBoundingClientRect();
      if (r.top <= 180) currentId = s.id;
    });
    document.querySelectorAll('.nav-link').forEach((link)=>{
      link.classList.toggle('active', link.getAttribute('href') === `#${currentId}`);
    });
  }
  if (siteHeader){
    siteHeader.classList.toggle('scrolled', window.scrollY > 40);
  }
}
window.addEventListener('scroll', onScroll, { passive:true });
window.addEventListener('load', onScroll);
onScroll();

/* ----- Phone parallax ----- */
const phoneStage = document.getElementById('phoneStage');
if (phoneStage && matchMedia('(hover:hover)').matches){
  const cols = phoneStage.querySelectorAll('.phone-col');
  phoneStage.addEventListener('pointermove', (e)=>{
    const rect = phoneStage.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - .5;
    const y = (e.clientY - rect.top) / rect.height - .5;
    cols.forEach((col)=>{
      const depth = col.classList.contains('center') ? 1 : .7;
      const baseRot = col.classList.contains('left') ? -4 : col.classList.contains('right') ? 4 : 0;
      const baseY = col.classList.contains('center') ? -18 : 24;
      col.style.transform = `translate(${x*14*depth}px, ${baseY + y*10*depth}px) rotate(${baseRot + x*3}deg)`;
    });
  });
  phoneStage.addEventListener('pointerleave', ()=>{
    cols.forEach(c=>{ c.style.transform = ''; });
  });
}

/* ----- Carousel ----- */
function buildCarousel(rootId, opts={}){
  const root = document.getElementById(rootId);
  if (!root) return;
  const slides = Array.from(root.querySelectorAll('.carousel-slide'));
  const prev = root.querySelector('.car-btn.prev');
  const next = root.querySelector('.car-btn.next');
  const thumbsRoot = root.querySelector('.carousel-thumbs, .thumb-grid');
  const thumbs = thumbsRoot ? Array.from(thumbsRoot.querySelectorAll('.thumb')) : [];

  const dotsRoot = opts.dotsId ? document.getElementById(opts.dotsId) : null;
  if (dotsRoot){
    dotsRoot.innerHTML = '';
    slides.forEach((_, idx)=>{
      const d = document.createElement('i');
      if (idx === 0) d.classList.add('active');
      dotsRoot.appendChild(d);
    });
  }
  const dots = dotsRoot ? Array.from(dotsRoot.querySelectorAll('i')) : [];

  let i = 0;

  function render(){
    slides.forEach((s, idx)=>s.classList.toggle('active', idx === i));
    thumbs.forEach((t, idx)=>t.classList.toggle('active', idx === i));
    dots.forEach((d, idx)=>d.classList.toggle('active', idx === i));
    if (opts.isVideo){
      slides.forEach((s, idx)=>{
        const v = s.querySelector('video');
        if (!v) return;
        if (idx === i){ v.play().catch(()=>{}); }
        else { v.pause(); try { v.currentTime = 0; } catch(_){} }
      });
    }
    if (opts.onChange) opts.onChange(i);
  }

  if (prev) prev.addEventListener('click', ()=>{ i = (i - 1 + slides.length) % slides.length; render(); });
  if (next) next.addEventListener('click', ()=>{ i = (i + 1) % slides.length; render(); });
  thumbs.forEach((t)=>{
    t.addEventListener('click', ()=>{
      const idx = Number(t.dataset.index);
      i = Number.isFinite(idx) ? idx : thumbs.indexOf(t);
      render();
    });
  });

  const stage = root.querySelector('.carousel-stage');
  let startX = 0, startY = 0, dragging = false;
  if (stage){
    stage.addEventListener('pointerdown', (e)=>{
      if (e.target.closest('.car-btn')) return;
      startX = e.clientX; startY = e.clientY; dragging = true;
    });
    stage.addEventListener('pointerup', (e)=>{
      if (!dragging) return;
      const dx = e.clientX - startX, dy = e.clientY - startY;
      if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy)){
        if (dx < 0 && next) next.click();
        else if (dx > 0 && prev) prev.click();
      }
      dragging = false;
    });
    stage.addEventListener('pointercancel', ()=>{ dragging = false; });
  }

  render();
}

/* Build thumbs for Tide image carousel */
(function buildTideThumbs(){
  const grid = document.getElementById('tideThumbs');
  if (!grid) return;
  const slides = document.querySelectorAll('#tideTrack .carousel-slide img');
  slides.forEach((img, idx)=>{
    const b = document.createElement('button');
    b.className = 'thumb' + (idx === 0 ? ' active' : '');
    b.dataset.index = String(idx);
    b.setAttribute('aria-label', `Tide ${idx+1}`);
    b.innerHTML = `<img src="${img.src}" alt="">`;
    grid.appendChild(b);
  });
})();

const debateTitleEl = document.getElementById('debateTitle');
const debateIndexEl = document.getElementById('debateIndex');
const tideIndexEl = document.getElementById('tideIndex');
const debateTitles = ['debates.v1','debates.v2','debates.v3','debates.v4'];
const debateTitlesEn = ['Debate center grid','For / Against voting','Topic detail','Thread reactions'];

buildCarousel('debateCarousel', {
  dotsId:'debateDots',
  onChange:(i)=>{
    if (debateIndexEl) debateIndexEl.textContent = String(i+1).padStart(2,'0');
    if (debateTitleEl){
      const key = debateTitles[i];
      const txt = translations[lang]?.[key] || debateTitlesEn[i];
      debateTitleEl.textContent = txt;
      debateTitleEl.setAttribute('data-i18n', key);
    }
  }
});

buildCarousel('tideCarousel', {
  dotsId:'tideDots',
  onChange:(i)=>{ if (tideIndexEl) tideIndexEl.textContent = String(i+1).padStart(2,'0'); }
});

/* ----- Lightbox (double-click to expand) ----- */
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const closeLightbox = document.getElementById('closeLightbox');

if (lightbox && lightboxImg){
  document.querySelectorAll('.carousel-slide img').forEach((img)=>{
    img.addEventListener('dblclick', ()=>{
      lightboxImg.src = img.src;
      lightbox.classList.add('open');
    });
    img.style.cursor = 'zoom-in';
  });
  if (closeLightbox) closeLightbox.addEventListener('click', ()=>lightbox.classList.remove('open'));
  lightbox.addEventListener('click', (e)=>{ if (e.target === lightbox) lightbox.classList.remove('open'); });
  window.addEventListener('keydown', (e)=>{ if (e.key === 'Escape') lightbox.classList.remove('open'); });
}

/* ----- Reveal on scroll ----- */
(() => {
  const revealItems = document.querySelectorAll('.s-head, .head-grid, .connect-head, .phone-col, .carousel, .skill-row, .career-col, .portrait, .about-copy, .contact-cards');
  revealItems.forEach(el=>el.setAttribute('data-reveal',''));
  if ('IntersectionObserver' in window){
    const io = new IntersectionObserver((entries)=>{
      entries.forEach(en=>{
        if (en.isIntersecting){
          en.target.classList.add('visible');
          io.unobserve(en.target);
        }
      });
    }, { rootMargin:'0px 0px -8% 0px', threshold:0.1 });
    revealItems.forEach(el=>io.observe(el));
  } else {
    revealItems.forEach(el=>el.classList.add('visible'));
  }
})();

/* =========================================================
   WebGL nebula background (grayscale version)
   ========================================================= */

const canvas = document.getElementById('shader');
const gl = canvas?.getContext('webgl', {
  antialias:false,
  premultipliedAlpha:false,
  powerPreference:'high-performance'
});

if (canvas && gl){
  const quad = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, quad);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW);

  const VERT = `attribute vec2 a;void main(){gl_Position=vec4(a,0.0,1.0);}`;

  const FRAG = `precision highp float;
uniform float u_time;uniform vec2 u_res;uniform vec2 u_mouse;uniform float u_intensity;uniform float u_scale;uniform float u_speed;
float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p);float a=hash(i),b=hash(i+vec2(1.,0.)),c=hash(i+vec2(0.,1.)),d=hash(i+vec2(1.,1.));vec2 u=f*f*(3.-2.*f);return mix(a,b,u.x)+(c-a)*u.y*(1.-u.x)+(d-b)*u.x*u.y;}
float fbm(vec2 p){float v=0.;float a=0.5;for(int i=0;i<5;i++){v+=a*noise(p);p*=2.03;a*=0.5;}return v;}
vec2 curl(vec2 p){float e=0.01;float n1=fbm(p+vec2(0.,e));float n2=fbm(p-vec2(0.,e));float n3=fbm(p+vec2(e,0.));float n4=fbm(p-vec2(e,0.));return vec2(n1-n2,-(n3-n4))/(2.0*e);}
void main(){
  vec2 fc=gl_FragCoord.xy;
  vec2 uv=(fc-0.5*u_res)/min(u_res.x,u_res.y);
  vec2 m=(u_mouse-0.5)*vec2(u_res.x/min(u_res.x,u_res.y),u_res.y/min(u_res.x,u_res.y));
  float t=u_time*0.18*u_speed;
  vec2 q=uv*u_scale*1.2;
  vec2 toMouse=(m-uv);
  vec2 flow=curl(q*0.9+t*0.5)*0.35+toMouse*0.05;
  for(int i=0;i<3;i++){q+=flow*0.25;flow=curl(q*0.9+t*0.5)*0.35+toMouse*0.05;}
  float n=fbm(q*1.2+t);
  float n2=fbm(q*2.4-t*0.7);
  float dens=smoothstep(0.16,0.95,n*0.72+n2*0.4);

  /* Grayscale palette */
  vec3 cBlack=vec3(0.005);
  vec3 cAsh  =vec3(0.16);
  vec3 cGrey =vec3(0.32);
  vec3 cBone =vec3(0.55);
  vec3 cBright=vec3(0.82);

  vec3 col=mix(cBlack,cAsh,smoothstep(0.25,0.85,n));
  col=mix(col,cGrey,smoothstep(0.45,0.95,n));
  col=mix(col,cBone,smoothstep(0.55,1.0,n2)*0.78);
  col*=dens;

  float r=length(uv-m);
  col+=cBright*exp(-r*r*2.4)*0.40;
  col+=cBone*exp(-r*r*0.6)*0.14;
  col+=vec3(0.006);
  col*=u_intensity;
  col=pow(col, vec3(0.95));
  gl_FragColor=vec4(col,1.0);
}`;

  function compile(src, type){
    const shader = gl.createShader(type);
    gl.shaderSource(shader, src);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)){
      console.error(gl.getShaderInfoLog(shader));
      return null;
    }
    return shader;
  }

  const vs = compile(VERT, gl.VERTEX_SHADER);
  const fs = compile(FRAG, gl.FRAGMENT_SHADER);

  if (vs && fs){
    const program = gl.createProgram();
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.bindAttribLocation(program, 0, 'a');
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)){
      console.error(gl.getProgramInfoLog(program));
    }

    const uniforms = {};
    ['u_time','u_res','u_mouse','u_intensity','u_scale','u_speed'].forEach((name)=>{
      uniforms[name] = gl.getUniformLocation(program, name);
    });

    let mouse = [0.5, 0.5];
    let target = [0.5, 0.5];
    let hidden = false;
    const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

    function resizeShader(){
      const small = innerWidth < 720;
      const dpr = Math.min(devicePixelRatio || 1, small ? 1.25 : 1.75);
      canvas.width = Math.floor(innerWidth * dpr);
      canvas.height = Math.floor(innerHeight * dpr);
      canvas.style.width = `${innerWidth}px`;
      canvas.style.height = `${innerHeight}px`;
      gl.viewport(0, 0, canvas.width, canvas.height);
    }

    addEventListener('resize', resizeShader, { passive:true });
    resizeShader();

    addEventListener('pointermove', (e)=>{
      target[0] = e.clientX / innerWidth;
      target[1] = 1 - e.clientY / innerHeight;
    }, { passive:true });

    document.addEventListener('visibilitychange', ()=>{ hidden = document.hidden; });

    function frame(now){
      if (!hidden){
        const t = reduceMotion ? 0 : now / 1000;
        mouse[0] += (target[0] - mouse[0]) * 0.08;
        mouse[1] += (target[1] - mouse[1]) * 0.08;

        gl.useProgram(program);
        gl.bindBuffer(gl.ARRAY_BUFFER, quad);
        gl.enableVertexAttribArray(0);
        gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
        gl.uniform1f(uniforms.u_time, t);
        gl.uniform2f(uniforms.u_res, canvas.width, canvas.height);
        gl.uniform2f(uniforms.u_mouse, mouse[0], mouse[1]);
        gl.uniform1f(uniforms.u_intensity, 0.85);
        gl.uniform1f(uniforms.u_scale, 1.0);
        gl.uniform1f(uniforms.u_speed, 1.0);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      }
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }
}
