/* ============================================================
   平面设计页 — interactions
   ============================================================ */
(function () {
  'use strict';
  gsap.registerPlugin(ScrollTrigger);

  /* ---------- Starfield ---------- */
  var canvas = document.getElementById('stars');
  var ctx = canvas.getContext('2d');
  var stars = [];
  function resizeStars() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    stars = [];
    var n = Math.floor((canvas.width * canvas.height) / 10000);
    for (var i = 0; i < n; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.3 + 0.3,
        a: Math.random() * 0.55 + 0.15,
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
      ctx.beginPath();
      ctx.arc(mt.x, mt.y, 1.6, 0, Math.PI * 2);
      ctx.fillStyle = head + (0.7 * mt.life) + ')';
      ctx.fill();
    }
    requestAnimationFrame(drawStars);
  })();

  /* ---------- Reveals ---------- */
  gsap.to('.g-hero .reveal', { opacity: 1, y: 0, duration: 1, stagger: 0.1, ease: 'power3.out', delay: 0.15 });
  document.querySelectorAll('.g-sec .reveal, .d-next .reveal').forEach(function (el) {
    gsap.to(el, {
      opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 88%', once: true }
    });
  });

  /* ---------- IP mascot float ---------- */
  var mascot = document.querySelector('.ip-mascot');
  if (mascot) gsap.to(mascot, { y: -16, duration: 3, yoyo: true, repeat: -1, ease: 'sine.inOut' });

  /* ---------- VI grid (10 pages, staggered scroll-in reveal) ---------- */
  var viGrid = document.getElementById('viGrid');
  if (viGrid) {
    var html = '';
    for (var i = 1; i <= 10; i++) {
      html += '<div class="vi-cell" data-hover><img loading="lazy" src="./assets/graphic/vi-' + (i < 10 ? '0' : '') + i + '.jpg" alt="VI 设计手册 第' + i + '页"></div>';
    }
    viGrid.innerHTML = html;
    gsap.from(viGrid.children, {
      opacity: 0, y: 42, scale: 0.9, duration: 0.7, ease: 'power3.out',
      stagger: { each: 0.06, from: 'start' },
      scrollTrigger: { trigger: viGrid, start: 'top 85%', once: true }
    });
  }

  /* ---------- VI Lightbox ---------- */
  var vlb = document.getElementById('viLightbox');
  var vlbImg = document.getElementById('vlbImg');
  var vlbCap = document.getElementById('vlbCaption');
  var vlbCnt = document.getElementById('vlbCounter');
  var viCells = [];
  var vlbIdx = 0;
  if (vlb && viGrid) {
    viCells = Array.from(viGrid.querySelectorAll('.vi-cell'));
    viCells.forEach(function (cell, idx) {
      cell.style.cursor = 'zoom-in';
      cell.addEventListener('click', function () { openVl(idx); });
    });
    document.getElementById('vlbClose').addEventListener('click', closeVl);
    document.getElementById('vlbCloseBtn').addEventListener('click', closeVl);
    document.getElementById('vlbPrev').addEventListener('click', function () { navigateVl(-1); });
    document.getElementById('vlbNext').addEventListener('click', function () { navigateVl(1); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeVl(); if (e.key === 'ArrowLeft') navigateVl(-1); if (e.key === 'ArrowRight') navigateVl(1); });
  }
  function openVl(idx) {
    vlbIdx = idx;
    showVl();
    vlb.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
  function closeVl() {
    vlb.classList.remove('active');
    document.body.style.overflow = '';
  }
  function navigateVl(dir) {
    vlbIdx = (vlbIdx + dir + viCells.length) % viCells.length;
    showVl();
  }
  function showVl() {
    var img = viCells[vlbIdx].querySelector('img');
    vlbImg.src = img.src;
    vlbCap.textContent = img.alt || ('VI 第 ' + (vlbIdx + 1) + ' 页');
    vlbCnt.textContent = (vlbIdx + 1) + ' / ' + viCells.length;
  }

  /* ---------- Sticker mosaic (错落有致) ---------- */
  var STICKERS = [
    '嗨.gif', '加油.gif', '开会.gif', '拜拜.gif', '收到.gif', '淡定.gif', '疑问.gif', '着急.gif', '谢谢.gif',
    '早安.gif', '晚安.gif', '比心.gif', '求带.gif', '惊吓.gif', '调皮.gif', '钱来.gif', 'emo.gif',
    '霸气.gif', '下班啦.gif', '不不不.gif', '加急中.gif', '哈哈哈.gif', '在线等.gif', '客气啦.gif', '忙忙忙.gif',
    '新年好.gif', '月底了.gif', '没问题.gif', '不错不错.gif', '戴好口罩.gif', '新年快乐.gif', '看好你哦.gif',
    '节日快乐.gif', '谢谢老板.gif', '赞大拇指.gif', '达成共识.gif', '送你花花.gif', '开心到飞起.gif', '拜年啦.gif'
  ];
  /* size pattern: B=big 2x2, W=wide 2x1, .=1x1 */
  var PATTERN = ['B', '.', '.', 'W', '.', '.', '.', 'B', '.', 'W', '.', '.', '.', '.', 'W', '.', 'B', '.', '.', 'W', '.', '.', '.', 'B', '.', '.', 'W', '.', '.', '.', 'B', '.', 'W', '.', '.', '.', '.', 'W', '.'];
  var mosaic = document.getElementById('stickerMosaic');
  if (mosaic) {
    var html2 = '';
    STICKERS.forEach(function (name, i) {
      var size = PATTERN[i % PATTERN.length];
      var cls = size === 'B' ? 'sm-big' : (size === 'W' ? 'sm-wide' : '');
      var color = 'sm-c' + ((i % 6) + 1);
      html2 += '<div class="sm-tile ' + cls + ' ' + color + '" data-hover><img loading="lazy" src="./assets/stickers/' +
        encodeURIComponent(name) + '" alt="表情包 ' + name.replace('.gif', '') + '"></div>';
    });
    mosaic.innerHTML = html2;
    /* scroll-in stagger */
    gsap.from(mosaic.children, {
      opacity: 0, y: 44, scale: 0.85, duration: 0.7, ease: 'back.out(1.6)',
      stagger: { each: 0.045, from: 'random' },
      scrollTrigger: { trigger: mosaic, start: 'top 86%', once: true }
    });
  }

  /* ---------- Smooth anchor offset ---------- */
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
})();
