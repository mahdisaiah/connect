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
    'nav.stories':'Stories','nav.debates':'Débats','nav.learn':'Apprendre',
    'nav.explore':'Explorer','nav.chat':'Chat','nav.offline':'Hors-ligne',
    'nav.ai':'IA','nav.pro':'Pro','nav.about':'À propos','nav.contact':'Contact',

    'hero.tagline':'Une app sociale pensée pour la vraie conversation · iOS · Mai 2026',
    'hero.cta1':'Voir l\'app','hero.cta2':'Lire le manifeste','hero.scroll':'Défiler',

    'connect.label':'Produit mobile','connect.meta':'iOS — Mai 2026',
    'connect.title':'Une app sociale pensée pour la vraie conversation.',
    'connect.lead':"Connect est une plateforme sociale moderne où l'on partage des posts, des stories et des débats autour de contenus réels. Elle privilégie l'interaction plutôt que la consommation.",
    'connect.lead2':"Un design épuré et immersif. Connect transforme le réseau social en un espace d'expression, de conversation et d'engagement réel.",
    'connect.m1.label':'Plateforme','connect.m1.val':'iOS à la sortie · Android bientôt',
    'connect.m2.label':'Sortie','connect.m2.val':'31 Mai · 2026',
    'connect.m3.label':'Compte à rebours',
    'connect.cap1':'Accueil','connect.cap2':'Story','connect.cap3':'Profil',
    'connect.phone1.text':"Un fil en temps réel où posts, stories et réactions cohabitent.",
    'connect.phone2.text':"Stories qui disparaissent en 24h. Les réponses restent liées au moment partagé.",
    'connect.phone3.text':"Une identité pensée pour l'expression, pas pour les métriques.",

    'debates.label':'Débats','debates.meta':'Pour / Contre · taggés par l\'IA',
    'debates.title':'Des débats taggés par un agent.',
    'debates.lead':"Trois à cinq slugs de taxonomie écrits sur chaque débat. Un graphe de sujets voisins l'envoie aux personnes que ça intéresse.",
    'debates.cap1':'Centre','debates.cap2':'Vote','debates.cap3':'Détail','debates.cap4':'Fil',
    'debates.p1':"La grille du centre des débats. Tous les sujets ouverts.",
    'debates.p2':"Pour / Contre, voté en direct. Les côtés se rééquilibrent toutes les heures.",
    'debates.p3':"Détail d'un sujet, avec ses débats associés via les sujets voisins.",
    'debates.p4':"Réactions du fil. Les commentaires sont ouverts mais limités à 280 caractères.",

    'learn.label':'Intérêts & Apprendre','learn.meta':'Quiz adaptatifs · 3-5 questions',
    'learn.title':'Choisis tes sujets. Apprends pendant que tu regardes.',
    'learn.lead':"Au démarrage, tu choisis tes intérêts dans une taxonomie partagée. Le fil s'adapte. Et à la fin de chaque vidéo, un petit quiz t'aide à retenir.",
    'learn.cap1':'Intérêts','learn.cap2':'Lecteur','learn.cap3':'Quiz','learn.cap4':'Réponse',
    'learn.p1':"Choisis tes intérêts. Pas de hashtags à inventer, juste une taxonomie partagée.",
    'learn.p2':"Le lecteur vidéo embarqué. Les vidéos sont importées depuis YouTube, Vimeo ou liens directs.",
    'learn.p3':"À la fin de chaque vidéo, un quiz généré par l'IA. Trois à cinq questions.",
    'learn.p4':"Réponse adaptative. Le quiz suivant ajuste sa difficulté.",

    'explore.label':'Explorer','explore.meta':'Carte · signaux d\'humeur',
    'explore.title':'Trouve les gens près de toi. Réponds à une humeur, pas à un profil.',
    'explore.lead':"La carte montre les utilisateurs autour de toi avec leur dernier signal d'humeur. Un tap, et tu réponds à l'humeur directement, sans passer par le profil.",
    'explore.cap1':'Carte','explore.cap2':'Réponse',
    'explore.p1':"Un utilisateur apparaît sur la carte. Distance approximative, humeur récente.",
    'explore.p2':"Tu réponds à son humeur. Pas de demande d'ami, pas de DM bloqué.",

    'chat.label':'Chat','chat.meta':'Voix · musique · privé',
    'chat.title':'Conversations privées, comme elles devraient être.',
    'chat.lead':"Messages texte, vocaux et partage de musique iTunes. Pas de tracking de lecture, pas de signalement de présence si tu ne veux pas. Les médias expirent par défaut au bout d'une semaine.",
    'chat.fact1':'Vocaux','chat.fact1v':'Enregistrement et lecture scrubble',
    'chat.fact2':'Musique','chat.fact2v':'Partage depuis ta bibliothèque iTunes',
    'chat.fact3':'Médias','chat.fact3v':'Expirent automatiquement en 7 jours',
    'chat.fact4':'Présence','chat.fact4v':'Coupable, par défaut activée à \'aucune\'',

    'offline.label':'Hors-ligne','offline.meta':'On-device · sans serveur',
    'offline.title':'Quand le réseau tombe, une petite pièce s\'ouvre.',
    'offline.lead':"Quatre jeux. Pas de comptes, pas de serveurs, pas de score au-delà de ce qui est à l'écran. Ils tournent quand le reste de l'app ne peut pas.",
    'offline.cap1':'Net.','offline.cap2':'Tide.','offline.cap3':'Spin.','offline.cap4':'Faker.',
    'offline.p1':"Tourner pour réparer le réseau. Une grille procédurale, sans fin.",
    'offline.p2':"Respirer avec un inconnu. Pacer de résonance à 6 BPM, cliniquement validé.",
    'offline.p3':"Une roue qui ratchete sous ton pouce. Vérité ou action, pour 2 à 10 autour d'un téléphone.",
    'offline.p4':"L'un de vous ne sait rien. Jeu de dessin pour 4 à 10 partageant un téléphone.",

    'ai.label':'IA','ai.meta':'Outils, pas fonctionnalités',
    'ai.title':"L'IA fait le travail ennuyeux.",
    'ai.lead':"Six endroits où l'IA tourne, en arrière-plan. Aucun n'est marketé comme une feature. C'est juste de la maintenance, faite mieux.",
    'ai.pull':"L'IA ne fabrique pas les conversations. Elle nettoie le sol entre deux d'entre elles.",
    'ai.f1.t':'Recherche','ai.f1.p':"Recherche en langage naturel sur tout le fil. \"Les débats de la semaine sur l'urbanisme où quelqu'un a changé d'avis.\" La requête tourne sur le même modèle d'embeddings que le classement de la home.",
    'ai.f2.t':'Tri des signalements','ai.f2.p':"Chaque signalement passe d'abord par un agent Groq. Il classe la sévérité (faible / moyen / urgent), catégorise (harcèlement / spam / usurpation / menace), pré-remplit un résumé et route vers le bon modérateur.",
    'ai.f3.t':'Vérification','ai.f3.p':"Un pipeline de fact-check. Les déclarations qui ressemblent à des citations sont recoupées avec une base de connaissances. Une puce s'affiche : vérifié, contesté, ou pas d'éléments.",
    'ai.f4.t':'Tagging des débats','ai.f4.p':"Chaque débat passe par un agent sur llama-3.3-70b. Il écrit trois à cinq slugs de taxonomie du même ensemble qui pilote tes intérêts. Un graphe de sujets voisins propage le post aux pièces adjacentes.",
    'ai.f5.t':'Quiz des vidéos','ai.f5.p':"Les shorts et liens partagés produisent des quiz adaptatifs. Trois à cinq questions, sans remplissage. Sanitisés question par question.",
    'ai.f6.t':'Appariement d\'humeur','ai.f6.p':"Sur la carte Explorer, les signaux d'humeur viennent de tes derniers posts. Le matcher pèse les humeurs complémentaires, pas juste les distances.",

    'pro.label':'Tarif','pro.meta':'Optionnel · résiliable à tout moment',
    'pro.title':'Connect Pro. La même app, avec plus de place.',
    'pro.lead':"La pub finance le gratuit. Pro la coupe, et ouvre les surfaces qui ont besoin d'un peu plus de place. Rien d'essentiel n'est derrière le paywall.",
    'pro.free':'Gratuit','pro.pro':'Pro',

    'about.label':'Le créateur','about.meta':'Solo · Paris',
    'about.title':"Une petite app sociale, faite par une personne, avec intention.",
    'about.lead':"Construit par Mahdi, à Paris. Pas d'équipe, pas de pitch deck, pas de roadmap publique. Une chose à la fois.",
    'about.based':'Basé à','about.origin':'Origine','about.languages':'Langues',
    'about.statuslabel':'Statut','about.status':'Lancement le 31 Mai 2026',

    'contact.label':'Lien','contact.meta':"On reste en contact",
    'contact.title':"Pour parler du projet, ou attendre le lancement.",
    'contact.lead':"L'app sort le 31 mai 2026. Avant ça, écris si tu as une question, ou suis le projet en bas.",
    'contact.email':'Infos','contact.cv':'Portfolio','contact.available':'Lancement Mai 2026'
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
  if (siteHeader) siteHeader.classList.toggle('scrolled', window.scrollY > 40);
}
window.addEventListener('scroll', onScroll, { passive:true });
window.addEventListener('load', onScroll);
onScroll();

/* ----- Phone parallax (generalised to every stage) ----- */
const hoverable = matchMedia('(hover:hover)').matches;
document.querySelectorAll('.phone-stage, .phone-stage-4, .phone-pair').forEach((stage)=>{
  if (!hoverable) return;
  const cols = stage.querySelectorAll('.phone-col');
  stage.addEventListener('pointermove', (e)=>{
    const rect = stage.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - .5;
    const y = (e.clientY - rect.top) / rect.height - .5;
    cols.forEach((col)=>{
      const center = col.classList.contains('center') || col.classList.contains('p2') || col.classList.contains('p3');
      const depth = center ? 1 : .7;
      const baseRot = parseFloat(col.dataset.rot || (col.classList.contains('left')?'-4':col.classList.contains('right')?'4':col.classList.contains('p1')?'-7':col.classList.contains('p4')?'7':col.classList.contains('p2')?'-2':col.classList.contains('p3')?'2':'0'));
      const baseY = parseFloat(col.dataset.y || (col.classList.contains('center')?'-18':col.classList.contains('p2')||col.classList.contains('p3')?'4':col.classList.contains('p1')||col.classList.contains('p4')?'36':'24'));
      col.style.transform = `translate(${x*14*depth}px, ${baseY + y*10*depth}px) rotate(${baseRot + x*3}deg)`;
    });
  });
  stage.addEventListener('pointerleave', ()=>{
    cols.forEach(c=>{ c.style.transform = ''; });
  });
});

/* ----- Lightbox (click any phone screenshot to expand) ----- */
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const closeLightbox = document.getElementById('closeLightbox');

if (lightbox && lightboxImg){
  document.querySelectorAll('.phone-frameless img').forEach((img)=>{
    img.style.cursor = 'zoom-in';
    img.addEventListener('click', (e)=>{
      e.preventDefault();
      lightboxImg.src = img.src;
      lightbox.classList.add('open');
    });
  });
  if (closeLightbox) closeLightbox.addEventListener('click', ()=>lightbox.classList.remove('open'));
  lightbox.addEventListener('click', (e)=>{ if (e.target === lightbox) lightbox.classList.remove('open'); });
  window.addEventListener('keydown', (e)=>{ if (e.key === 'Escape') lightbox.classList.remove('open'); });
}

/* ----- Reveal on scroll ----- */
(() => {
  const revealItems = document.querySelectorAll('.s-head, .head-grid, .connect-head, .phone-col, .ai-row, .ai-intro, .career-col, .portrait, .about-copy, .contact-cards, .phone-solo .solo-copy');
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
   WebGL nebula background (grayscale)
   ========================================================= */

const canvas = document.getElementById('shader');
const gl = canvas?.getContext('webgl', { antialias:false, premultipliedAlpha:false, powerPreference:'high-performance' });

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
    gl.shaderSource(shader, src); gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)){ console.error(gl.getShaderInfoLog(shader)); return null; }
    return shader;
  }

  const vs = compile(VERT, gl.VERTEX_SHADER);
  const fs = compile(FRAG, gl.FRAGMENT_SHADER);

  if (vs && fs){
    const program = gl.createProgram();
    gl.attachShader(program, vs); gl.attachShader(program, fs);
    gl.bindAttribLocation(program, 0, 'a'); gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)){ console.error(gl.getProgramInfoLog(program)); }

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
