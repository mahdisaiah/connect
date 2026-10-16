/* Connect, For Real · the "Ask about Connect" guide on the help pages.
   Same guide as getconnectapp.github.io: it talks to Connect's site-guide
   function, and answers a few common questions on its own if that's offline. */
(function () {
  'use strict';
  var URL_ = 'https://fndvwtzlbgjwslcmrexr.supabase.co/functions/v1/site-guide';
  var root = document.documentElement;
  var base = root.getAttribute('data-base') || '';
  var section = root.getAttribute('data-guide') || 'support';
  var SPRITE = base + 'assets/sprite.svg#';
  var fr = function () { return root.lang === 'fr'; };
  var L = function (en, frs) { return fr() ? frs : en; };
  var ico = function (n) { return '<svg class="i"><use href="' + SPRITE + n + '"/></svg>'; };

  var launch = document.createElement('button');
  launch.className = 'g-launch'; launch.type = 'button'; launch.setAttribute('aria-expanded', 'false');
  launch.innerHTML = '<span class="mk"><svg viewBox="0 0 240 240"><use href="' + SPRITE + 'mk"/></svg></span><span class="g-lbl"></span>';
  var box = document.createElement('aside');
  box.className = 'guide'; box.hidden = true; box.setAttribute('role', 'dialog');
  box.innerHTML =
    '<div class="g-head"><span class="g-av"><svg viewBox="0 0 240 240"><use href="' + SPRITE + 'mk"/></svg></span>' +
    '<div><b class="g-t"></b><small><i></i><span class="g-s"></span></small></div>' +
    '<button class="g-x" type="button" aria-label="Close">' + ico('x') + '</button></div>' +
    '<div class="g-log" aria-live="polite"></div><div class="g-chips"></div>' +
    '<form class="g-form"><textarea rows="1" aria-label="Your question"></textarea><button class="g-send" type="submit" aria-label="Send">' + ico('arrow-up') + '</button></form>' +
    '<p class="g-note"></p>';
  document.body.append(launch, box);
  var log = box.querySelector('.g-log'), chipsEl = box.querySelector('.g-chips'), input = box.querySelector('textarea'), send = box.querySelector('.g-send');
  var turns = [], busy = false, ctl = null, started = false, lastChips = null;

  function labels() {
    launch.querySelector('.g-lbl').textContent = L('Ask about Connect', 'Une question ?');
    box.setAttribute('aria-label', L('Connect guide', 'Guide Connect'));
    box.querySelector('.g-t').textContent = L('Connect guide', 'Guide Connect');
    box.querySelector('.g-s').textContent = L('Answers about the app, made by AI', "Répond sur l'app, fait par l'IA");
    box.querySelector('.g-note').textContent = L('The guide is an AI and can make mistakes.', "Le guide est une IA et peut se tromper.");
    input.placeholder = L('Ask about Connect…', 'Pose ta question sur Connect…');
    if (!busy) renderChips();
  }

  var esc = function (s) { return s.replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  function md(text) {
    var link = function (s) {
      return s.replace(/\bhttps?:\/\/[^\s<)]+[^\s<).,;:!?]/g, function (u) { return '<a href="' + u + '" target="_blank" rel="noopener">' + u.replace(/^https?:\/\//, '').replace(/\/$/, '') + '</a>'; })
        .replace(/(^|[\s(>])([\w.+-]+@[\w-]+\.[\w.]+\w)/g, function (m, a, e) { return a + '<a href="mailto:' + e + '">' + e + '</a>'; });
    };
    var fmt = function (s) { return link(s.replace(/\*\*(.+?)\*\*/g, '<b>$1</b>')); };
    var bullet = function (l) { return /^\s*[-•]\s+/.test(l); };
    return esc(text.replace(/\s*—\s*/g, ', ')).trim().split(/\n{2,}/).map(function (b) {
      var out = [], para = [], list = [];
      var flushP = function () { if (para.length) out.push('<p>' + para.map(fmt).join('<br>') + '</p>'); para = []; };
      var flushL = function () { if (list.length) out.push('<ul>' + list.map(function (l) { return '<li><span>' + fmt(l.replace(/^\s*[-•]\s+/, '')) + '</span></li>'; }).join('') + '</ul>'); list = []; };
      b.split('\n').filter(function (l) { return l.trim(); }).forEach(function (l) { if (bullet(l)) { flushP(); list.push(l); } else { flushL(); para.push(l.trim()); } });
      flushP(); flushL();
      return out.join('');
    }).join('');
  }
  var meta = /^\s*(SHOW|CHIPS)\s*:/i;
  function visible(t) {
    var lines = t.split('\n');
    if (/^\s*(S|SH|SHO|SHOW|C|CH|CHI|CHIP|CHIPS)\s*$/i.test(lines[lines.length - 1])) lines.pop();
    return lines.filter(function (l) { return !meta.test(l); }).join('\n');
  }
  function scroll() { log.scrollTop = log.scrollHeight; }
  function addMe(t) { var d = document.createElement('div'); d.className = 'm m--me'; d.textContent = t; log.append(d); scroll(); }
  function addBot() { var d = document.createElement('div'); d.className = 'm m--bot'; d.innerHTML = '<div class="sk" aria-label="Thinking"><i></i><i></i><i></i></div>'; log.append(d); scroll(); return d; }

  var START = {
    support: [['How do I contact support?', "Comment je contacte l'aide ?"], ['I forgot my password', "J'ai oublié mon mot de passe"], ['Who made Connect?', 'Qui a créé Connect ?']],
    privacy: [['Is my data sold?', 'Mes données sont vendues ?'], ['What happens with my AI questions?', 'Que deviennent mes questions à l’IA ?'], ['How do I delete my account?', 'Comment supprimer mon compte ?']],
    open: [['What is Connect?', "C'est quoi Connect ?"], ['Is it free?', "C'est gratuit ?"], ['Is it on Android?', 'Il existe sur Android ?']]
  };
  function renderChips(list) {
    if (list !== undefined) lastChips = list;
    chipsEl.innerHTML = '';
    (lastChips || (START[section] || START.support).map(function (p) { return L(p[0], p[1]); })).forEach(function (q) {
      var b = document.createElement('button'); b.type = 'button'; b.textContent = q; b.onclick = function () { ask(q); }; chipsEl.append(b);
    });
  }

  /* Offline answers, used only when the guide's server can't be reached. */
  var LOCAL = [
    [/who (made|created|built|founded|owns|is behind)|cr[ée]ateur|fondateur|qui a (cr[ée]|fait|lanc[ée]|con[cç]u)|owner|founder|mahdi|saiah/i,
      'Connect was designed and launched by **Mahdi Saiah**, a product designer and product owner in Paris. His portfolio: https://mahdisaiah.github.io',
      "Connect a été conçue et lancée par **Mahdi Saiah**, product designer et product owner à Paris. Son portfolio : https://mahdisaiah.github.io"],
    [/password|mot de passe/i, "On the login screen, tap **Forgot password?** and enter your account's email: you'll get a reset link, valid for 60 minutes. Check your spam folder if it doesn't arrive.",
      "Sur l'écran de connexion, touche **Mot de passe oublié ?** et entre l'e-mail de ton compte : tu reçois un lien de réinitialisation, valable 60 minutes. Regarde dans tes spams s'il n'arrive pas."],
    [/delete|supprim/i, 'In the app: Settings, Delete account, then confirm. Your profile, posts and messages go with it.',
      "Dans l'app : Paramètres, Supprimer le compte, puis confirme. Ton profil, tes publications et tes messages partent avec."],
    [/sell|vend|data|donn[ée]e|privacy|confidential|\bai\b|\bia\b/i, "Connect never sells your personal data, and doesn't train AI on your content. Plain-words details: https://mahdisaiah.github.io/connect/privacy.html",
      "Connect ne vend jamais tes données personnelles et n'entraîne pas d'IA sur tes contenus. Les détails : https://mahdisaiah.github.io/connect/privacy.html"],
    [/free|gratuit|price|prix|pay/i, 'Connect is completely free. No paid plan, nothing to buy.', "Connect est entièrement gratuit. Pas d'abonnement, rien à acheter."],
    [/android|google play/i, 'Not yet: Connect is on iPhone today, and Android is coming to Google Play.', "Pas encore : Connect est sur iPhone aujourd'hui, et Android arrive sur Google Play."],
    [/what is connect|c'est quoi|connect\s*\?/i, 'A social app where every video teaches you something: a summary, a quiz and answers to your questions, then you share it with friends. Free on iPhone, 18+. https://getconnectapp.github.io',
      "Une app sociale où chaque vidéo t'apprend quelque chose : un résumé, un quiz et des réponses à tes questions, puis tu le partages avec tes potes. Gratuite sur iPhone, 18+. https://getconnectapp.github.io"]
  ];
  var looksFrench = function (q) { return /[éèàùçêôœ]|\b(je|tu|j'|c'est|comment|quoi|pourquoi|est-ce|les|des|une|peux|gratuit|ça|mon|mes)\b/i.test(q); };
  function localAnswer(q, d) {
    var f = looksFrench(q), hit = null;
    for (var i = 0; i < LOCAL.length; i++) if (LOCAL[i][0].test(q)) { hit = LOCAL[i]; break; }
    d.innerHTML = md(hit ? (f ? hit[2] : hit[1]) : (f
      ? "Écris à **connectappfr@gmail.com** ou ouvre la page d'aide : https://mahdisaiah.github.io/connect/support.html . On répond en général sous 2 jours ouvrés."
      : 'Write to **connectappfr@gmail.com** or open Support: https://mahdisaiah.github.io/connect/support.html . Replies usually come within 2 business days.'));
    renderChips(null); scroll();
  }

  async function ask(q) {
    q = (q || '').trim(); if (!q || busy) return;
    open_();
    addMe(q); input.value = ''; fit();
    var d = addBot();
    busy = true; chipsEl.innerHTML = ''; setBusy();
    turns.push({ role: 'user', content: q }); turns = turns.slice(-12);
    ctl = new AbortController();
    try {
      var res = await fetch(URL_, { method: 'POST', headers: { 'content-type': 'application/json' }, signal: ctl.signal,
        body: JSON.stringify({ messages: turns, lang: root.lang === 'fr' ? 'fr' : 'en', section: section }) });
      if (!res.ok || !res.body) throw new Error('upstream');
      var reader = res.body.getReader(), dec = new TextDecoder(), text = '';
      for (;;) { var r = await reader.read(); if (r.done) break; text += dec.decode(r.value, { stream: true }); var v = visible(text); if (v.trim()) { d.innerHTML = md(v); scroll(); } }
      if (!text.trim()) throw new Error('empty');
      turns.push({ role: 'assistant', content: text });
      d.innerHTML = md(visible(text));
      var ch = (text.match(/^\s*CHIPS\s*:\s*(.+)$/im) || [])[1];
      renderChips(ch ? ch.split('|').map(function (s) { return s.trim(); }).filter(Boolean).slice(0, 3) : null);
    } catch (e) {
      turns.pop();
      if (e && e.name === 'AbortError') d.innerHTML = md(L('Stopped.', 'Arrêté.')); else localAnswer(q, d);
    } finally { busy = false; ctl = null; setBusy(); }
  }
  function setBusy() {
    send.innerHTML = ico(busy ? 'stop-fill' : 'arrow-up');
    send.setAttribute('aria-label', busy ? 'Stop' : 'Send');
    send.disabled = !busy && !input.value.trim();
  }
  function fit() { input.style.height = 'auto'; input.style.height = Math.min(input.scrollHeight, 120) + 'px'; setBusy(); }

  function welcome() {
    var d = addBot();
    d.innerHTML = md(L("Hi, I'm Connect's guide. Ask me anything about the app, getting help, or who made it.",
      "Salut, je suis le guide de Connect. Demande-moi n'importe quoi sur l'app, l'aide, ou qui l'a créée."));
    renderChips(null);
  }
  function open_() {
    box.hidden = false; launch.classList.add('is-hidden'); launch.setAttribute('aria-expanded', 'true');
    if (!started) { started = true; welcome(); }
    if (innerWidth >= 700) setTimeout(function () { input.focus({ preventScroll: true }); }, 60);
  }
  function close_() { box.hidden = true; launch.classList.remove('is-hidden'); launch.setAttribute('aria-expanded', 'false'); launch.focus(); }

  launch.addEventListener('click', open_);
  box.querySelector('.g-x').addEventListener('click', close_);
  addEventListener('keydown', function (e) { if (e.key === 'Escape' && !box.hidden) close_(); });
  input.addEventListener('input', fit);
  input.addEventListener('keydown', function (e) { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); if (!busy) ask(input.value); } });
  box.querySelector('.g-form').addEventListener('submit', function (e) { e.preventDefault(); if (busy) { if (ctl) ctl.abort(); } else ask(input.value); });
  document.addEventListener('connect:lang', function () { lastChips = null; labels(); });
  document.querySelectorAll('[data-open-guide]').forEach(function (b) { b.addEventListener('click', open_); });
  labels(); setBusy();
})();
