/* ============================================================
   CHEN YUN · PORTFOLIO — interactions
   ============================================================ */
(function () {
  'use strict';
  gsap.registerPlugin(ScrollTrigger);

  /* Always open at the top (homepage) — don't restore a previous scroll position */
  if ('scrollRestoration' in history) { history.scrollRestoration = 'manual'; }

  /* ---------- Snap mode (?snap=1): skip motion, show everything — used for visual QA ---------- */
  var SNAP = /[?&]snap=1/.test(location.search);

  /* ---------- Loader ---------- */
  var loader = document.getElementById('loader');
  var loaderBar = document.getElementById('loaderBar');
  var loaderPct = document.getElementById('loaderPct');
  if (SNAP) {
    loader.classList.add('done');
    gsap.set('.reveal', { opacity: 1, y: 0 });
    document.querySelectorAll('.count').forEach(function (el) { el.textContent = el.dataset.to; });
  }
  var prog = 0;
  var ldrTimer = setInterval(function () {
    if (SNAP) { clearInterval(ldrTimer); return; }
    prog = Math.min(prog + Math.random() * 16, 100);
    loaderBar.style.width = prog + '%';
    loaderPct.textContent = Math.floor(prog) + '%';
    if (prog >= 100) {
      clearInterval(ldrTimer);
      setTimeout(function () {
        loader.classList.add('done');
        heroIntro();
      }, 350);
    }
  }, 120);

  function heroIntro() {
    gsap.to('#hero .reveal', {
      opacity: 1, y: 0, duration: 1, stagger: 0.1, ease: 'power3.out', delay: 0.1
    });
  }
  /* safety: never leave hero content invisible */
  setTimeout(function () {
    gsap.set('#hero .reveal', { opacity: 1, y: 0 });
  }, 4500);

  /* ---------- Custom cursor ---------- */
  var dot = document.getElementById('cursorDot');
  var ring = document.getElementById('cursorRing');
  var mx = -100, my = -100, rx = -100, ry = -100;
  window.addEventListener('mousemove', function (e) { mx = e.clientX; my = e.clientY; });
  (function cursorLoop() {
    rx += (mx - rx) * 0.16;
    ry += (my - ry) * 0.16;
    dot.style.transform = 'translate(' + (mx - 4) + 'px,' + (my - 4) + 'px)';
    ring.style.left = rx + 'px';
    ring.style.top = ry + 'px';
    requestAnimationFrame(cursorLoop);
  })();
  document.addEventListener('mouseover', function (e) {
    if (e.target.closest('[data-hover]')) ring.classList.add('hovering');
  });
  document.addEventListener('mouseout', function (e) {
    if (e.target.closest('[data-hover]')) ring.classList.remove('hovering');
  });

  /* ---------- Starfield ---------- */
  var canvas = document.getElementById('stars');
  var ctx = canvas.getContext('2d');
  var stars = [];
  function resizeStars() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    stars = [];
    var n = Math.floor((canvas.width * canvas.height) / 9000);
    for (var i = 0; i < n; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.4 + 0.3,
        a: Math.random() * 0.6 + 0.15,
        tw: Math.random() * 0.02 + 0.004,
        ph: Math.random() * Math.PI * 2,
        cyan: Math.random() < 0.18
      });
    }
  }
  window.addEventListener('resize', resizeStars);
  resizeStars();
  /* subtle shooting stars */
  var meteors = [];
  var nextMeteorAt = performance.now() + 2500;
  function spawnMeteor(now) {
    meteors.push({
      x: canvas.width * (0.15 + Math.random() * 0.7),
      y: canvas.height * Math.random() * 0.3,
      vx: -(5 + Math.random() * 3.5),
      vy: 2.5 + Math.random() * 2,
      life: 1,
      decay: 0.011 + Math.random() * 0.008,
      cyan: Math.random() < 0.4
    });
    nextMeteorAt = now + 4500 + Math.random() * 5500;
  }
  (function drawStars() {
    var now = performance.now();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (var i = 0; i < stars.length; i++) {
      var s = stars[i];
      s.ph += s.tw;
      var alpha = s.a * (0.6 + 0.4 * Math.sin(s.ph));
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = s.cyan ? 'rgba(45,226,230,' + alpha + ')' : 'rgba(220,230,255,' + alpha + ')';
      ctx.fill();
    }
    /* meteors */
    if (now > nextMeteorAt && meteors.length < 2) spawnMeteor(now);
    for (var m = meteors.length - 1; m >= 0; m--) {
      var mt = meteors[m];
      mt.x += mt.vx;
      mt.y += mt.vy;
      mt.life -= mt.decay;
      if (mt.life <= 0 || mt.x < -80 || mt.y > canvas.height + 80) { meteors.splice(m, 1); continue; }
      var tail = 90 * mt.life;
      var grad = ctx.createLinearGradient(mt.x, mt.y, mt.x - mt.vx / 8 * tail, mt.y - mt.vy / 8 * tail);
      var head = mt.cyan ? 'rgba(45,226,230,' : 'rgba(235,242,255,';
      grad.addColorStop(0, head + (0.5 * mt.life) + ')');
      grad.addColorStop(1, head + '0)');
      ctx.strokeStyle = grad;
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(mt.x, mt.y);
      ctx.lineTo(mt.x - mt.vx / 8 * tail, mt.y - mt.vy / 8 * tail);
      ctx.stroke();
      /* glowing head */
      ctx.beginPath();
      ctx.arc(mt.x, mt.y, 1.6, 0, Math.PI * 2);
      ctx.fillStyle = head + (0.7 * mt.life) + ')';
      ctx.fill();
    }
    requestAnimationFrame(drawStars);
  })();

  /* ---------- Nav ---------- */
  var nav = document.getElementById('nav');
  window.addEventListener('scroll', function () {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });
  var burger = document.getElementById('navBurger');
  var navLinks = document.getElementById('navLinks');
  burger.addEventListener('click', function () { navLinks.classList.toggle('open'); });
  navLinks.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') navLinks.classList.remove('open');
  });

  /* ---------- Ticker: duplicate content for seamless loop ---------- */
  var ticker = document.getElementById('tickerTrack');
  ticker.innerHTML += ticker.innerHTML;

  /* ---------- Hero figures: float + mouse parallax ---------- */
  document.querySelectorAll('[data-float]').forEach(function (el, i) {
    gsap.to(el, {
      y: i % 2 ? 18 : -18,
      duration: 3 + i * 0.6,
      yoyo: true,
      repeat: -1,
      ease: 'sine.inOut'
    });
  });
  var heroFigL = document.querySelector('.hero-figure-l');
  var heroFigR = document.querySelector('.hero-figure-r');
  document.getElementById('hero').addEventListener('mousemove', function (e) {
    var cx = (e.clientX / window.innerWidth - 0.5);
    var cy = (e.clientY / window.innerHeight - 0.5);
    gsap.to(heroFigL, { x: cx * 26, rotate: cx * 4, duration: 0.8, ease: 'power2.out' });
    gsap.to(heroFigR, { x: cx * -30, rotate: cx * -4, duration: 0.8, ease: 'power2.out' });
  });

  /* ---------- Counters ---------- */
  document.querySelectorAll('.count').forEach(function (el) {
    var to = parseInt(el.dataset.to, 10);
    ScrollTrigger.create({
      trigger: el,
      start: 'top 92%',
      once: true,
      onEnter: function () {
        gsap.fromTo(el, { innerText: 0 }, {
          innerText: to, duration: 1.8, ease: 'power2.out', snap: { innerText: 1 },
          onUpdate: function () { el.textContent = Math.floor(gsap.getProperty(el, 'innerText')); }
        });
      }
    });
  });

  /* ---------- Generic reveals ---------- */
  document.querySelectorAll('section .reveal, .timeline .reveal').forEach(function (el) {
    if (el.closest('#hero')) return; // hero handled by loader intro
    gsap.to(el, {
      opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 88%', once: true }
    });
  });

  /* ---------- Fan cards entrance ---------- */
  if (!SNAP) {
    gsap.from('.fcard-l', {
      scrollTrigger: { trigger: '.fan', start: 'top 75%', once: true },
      rotate: -24, y: 90, opacity: 0, duration: 1.1, ease: 'power3.out'
    });
    gsap.from('.fcard-c', {
      scrollTrigger: { trigger: '.fan', start: 'top 75%', once: true },
      y: 120, opacity: 0, duration: 1.1, delay: 0.15, ease: 'power3.out'
    });
    gsap.from('.fcard-r', {
      scrollTrigger: { trigger: '.fan', start: 'top 75%', once: true },
      rotate: 24, y: 90, opacity: 0, duration: 1.1, delay: 0.3, ease: 'power3.out'
    });
  }

  /* ============================================================
     BOOKSHELF + FLIPBOOK MODAL (albums)
     ============================================================ */
  var ALBUMS = {
    youlefeng: { prefix: 'youlefeng', pages: 20, name: '优乐蜂画册', spread: '1190/807' },
    hema: { prefix: 'hema', pages: 28, name: '荷马企业画册', spread: '2/1' },
    changtian: { prefix: 'changtian', pages: 16, name: '长天快运画册', spread: '1190/807' },
    chengwen: { prefix: 'chengwen', pages: 36, name: '成文画册', spread: '2/1' }
  };
  var flipbook = document.getElementById('flipbook');
  var book = document.getElementById('book');
  var bookPage = document.getElementById('bookPage');
  var bookProgress = document.getElementById('bookProgress');
  var flipTitle = document.getElementById('flipTitle');
  var flipAutoBtn = document.getElementById('flipAuto');
  var prevBtn = document.getElementById('flipPrev');
  var nextBtn = document.getElementById('flipNext');
  var currentAlbum = null;
  var flippedCount = 0;
  var sheetEls = [];
  var autoTimer = null;
  var autoOn = true;

  function pad(n) { return (n < 10 ? '0' : '') + n; }

  function buildBook(key) {
    var alb = ALBUMS[key];
    book.innerHTML = '';
    sheetEls = [];
    flippedCount = 0;
    var baseL = document.createElement('div');
    baseL.className = 'bpage-base base-left';
    baseL.innerHTML = '<span>BRAND<br>ALBUM</span><em>' + alb.name + '</em>';
    var baseR = document.createElement('div');
    baseR.className = 'bpage-base base-right';
    baseR.innerHTML = '<span>THANKS<br>FOR READING</span><em>陈云 · 品牌画册设计</em>';
    book.appendChild(baseL);
    book.appendChild(baseR);
    var sheets = Math.ceil(alb.pages / 2);
    for (var i = 1; i <= sheets; i++) {
      var pf = 2 * i - 1;
      var pb = 2 * i;
      var sheet = document.createElement('div');
      sheet.className = 'bpage';
      sheet.style.zIndex = sheets - i + 2;
      sheet.dataset.z = sheets - i + 2;
      var front = document.createElement('div');
      front.className = 'face front';
      front.innerHTML = pf <= alb.pages ? '<img src="./assets/albums/' + alb.prefix + '-' + pad(pf) + '.jpg" alt="' + alb.name + ' 第' + pf + '页">' : '';
      var back = document.createElement('div');
      back.className = 'face back';
      back.innerHTML = pb <= alb.pages ? '<img src="./assets/albums/' + alb.prefix + '-' + pad(pb) + '.jpg" alt="' + alb.name + ' 第' + pb + '页">' : '';
      sheet.appendChild(front);
      sheet.appendChild(back);
      book.appendChild(sheet);
      sheetEls.push(sheet);
    }
    updateBookUI();
  }

  function updateBookUI() {
    var alb = ALBUMS[currentAlbum];
    var shown = Math.min(flippedCount * 2 + 1, alb.pages);
    bookPage.textContent = pad(shown) + ' / ' + pad(alb.pages);
    bookProgress.style.width = (flippedCount / sheetEls.length * 100) + '%';
    prevBtn.disabled = flippedCount === 0;
    nextBtn.disabled = flippedCount >= sheetEls.length;
  }

  function flipNext() {
    if (flippedCount >= sheetEls.length) { stopAuto(); return; }
    var sheet = sheetEls[flippedCount];
    flippedCount++;
    sheet.style.zIndex = sheetEls.length + flippedCount + 2;
    gsap.to(sheet, { rotationY: -180, duration: 0.9, ease: 'power2.inOut' });
    updateBookUI();
    if (flippedCount >= sheetEls.length) stopAuto();
  }

  function flipPrev() {
    if (flippedCount <= 0) return;
    flippedCount--;
    var sheet = sheetEls[flippedCount];
    gsap.to(sheet, {
      rotationY: 0, duration: 0.9, ease: 'power2.inOut',
      onComplete: function () { sheet.style.zIndex = sheet.dataset.z; }
    });
    updateBookUI();
  }

  function startAuto() {
    stopAuto();
    autoOn = true;
    flipAutoBtn.textContent = '暂停自动翻页';
    flipAutoBtn.classList.remove('paused');
    autoTimer = setInterval(flipNext, 2600);
  }
  function stopAuto() {
    autoOn = false;
    if (autoTimer) { clearInterval(autoTimer); autoTimer = null; }
    if (flipAutoBtn) {
      flipAutoBtn.textContent = '继续自动翻页';
      flipAutoBtn.classList.add('paused');
    }
  }

  function openFlipbook(key) {
    currentAlbum = key;
    flipTitle.textContent = ALBUMS[key].name;
    /* real page ratio: book spread = two pages side by side */
    var bw = document.querySelector('.modal-book');
    if (bw) bw.style.aspectRatio = ALBUMS[key].spread;
    buildBook(key);
    flipbook.classList.add('open');
    flipbook.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    startAuto();
  }
  function closeFlipbook() {
    stopAuto();
    flipbook.classList.remove('open');
    flipbook.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  document.getElementById('shelf').addEventListener('click', function (e) {
    var btn = e.target.closest('.sbook');
    if (btn) openFlipbook(btn.dataset.album);
  });
  nextBtn.addEventListener('click', function () { stopAuto(); flipNext(); });
  prevBtn.addEventListener('click', function () { stopAuto(); flipPrev(); });
  flipAutoBtn.addEventListener('click', function () { autoOn ? stopAuto() : startAuto(); });
  document.getElementById('flipClose').addEventListener('click', closeFlipbook);
  flipbook.querySelector('[data-flip-close]').addEventListener('click', closeFlipbook);
  /* click left/right zones of the book to flip */
  book.addEventListener('click', function (e) {
    var r = book.getBoundingClientRect();
    stopAuto();
    if (e.clientX - r.left < r.width / 2) flipPrev(); else flipNext();
  });
  window.addEventListener('keydown', function (e) {
    if (!flipbook.classList.contains('open')) return;
    if (e.key === 'Escape') closeFlipbook();
    if (e.key === 'ArrowRight') { stopAuto(); flipNext(); }
    if (e.key === 'ArrowLeft') { stopAuto(); flipPrev(); }
  });

  /* ============================================================
     Sticker wall
     ============================================================ */
  var STICKERS = [
    '嗨.gif', '加油.gif', '开会.gif', '拜拜.gif', '收到.gif', '淡定.gif', '疑问.gif', '着急.gif', '谢谢.gif',
    '早安.gif', '晚安.gif', '比心.gif', '求带.gif', '惊吓.gif', '调皮.gif', '钱来.gif', 'emo.gif',
    '霸气.gif', '下班啦.gif', '不不不.gif', '加急中.gif', '哈哈哈.gif', '在线等.gif', '客气啦.gif', '忙忙忙.gif',
    '新年好.gif', '月底了.gif', '没问题.gif', '不错不错.gif', '戴好口罩.gif', '新年快乐.gif', '看好你哦.gif',
    '节日快乐.gif', '谢谢老板.gif', '赞大拇指.gif', '达成共识.gif', '送你花花.gif', '开心到飞起.gif', '拜年啦.gif'
  ];
  function fillStickerRow(rowEl, list) {
    var html = '';
    // duplicate list twice for seamless marquee
    for (var k = 0; k < 2; k++) {
      list.forEach(function (name) {
        html += '<div class="sticker-cell" data-hover><img loading="lazy" src="./assets/stickers/' + encodeURIComponent(name) + '" alt="表情包 ' + name.replace('.gif', '') + '"></div>';
      });
    }
    rowEl.innerHTML = html;
  }
  var sRow1 = document.getElementById('stickerRow1');
  var sRow2 = document.getElementById('stickerRow2');
  if (sRow1 && sRow2) {
    fillStickerRow(sRow1, STICKERS.slice(0, 19));
    fillStickerRow(sRow2, STICKERS.slice(19));
  }

  /* ============================================================
     Contact form -> mailto draft
     ============================================================ */
  document.getElementById('contactForm').addEventListener('submit', function (e) {
    e.preventDefault();
    var name = document.getElementById('fName').value.trim();
    var mail = document.getElementById('fMail').value.trim();
    var subject = document.getElementById('fSubject').value.trim();
    var msg = document.getElementById('fMsg').value.trim();
    var body = '姓名：' + name + '\n邮箱：' + mail + '\n\n' + msg;
    window.location.href = 'mailto:1294396008@qq.com?subject=' +
      encodeURIComponent('[官网咨询] ' + subject) + '&body=' + encodeURIComponent(body);
    document.getElementById('formTip').hidden = false;
  });

  /* ---------- Smooth anchor offset for fixed nav ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = a.getAttribute('href');
      if (id.length < 2) return;
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 70, behavior: 'smooth' });
    });
  });

  window.addEventListener('load', function () {
    ScrollTrigger.refresh();
    var m = location.search.match(/scroll=([a-z]+)/);
    if (m) {
      var t = document.getElementById(m[1]);
      if (t) {
        document.documentElement.style.scrollBehavior = 'auto';
        window.scrollTo({ top: t.getBoundingClientRect().top + window.scrollY - 60, behavior: 'instant' });
      }
    }
  });
})();

