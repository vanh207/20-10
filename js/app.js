/**
 * Quà 20/10 - Gửi người phụ nữ đặc biệt 💐
 * Standalone HTML5 / CSS3 / Vanilla JavaScript Application
 */

const GIFT_DATA = {
  herName: "em yêu",
  signature: "Anh",
  palette: "pink",
  cover: {
    greeting: "Gửi em,",
    line: "nhân ngày 20 tháng 10",
    button: "Chạm để mở quà"
  },
  garden: {
    big: "20 · 10",
    line: "Giữa cả một rừng hoa, em vẫn là đoá đẹp nhất",
    photo: "gif/photo/p01.jpg"
  },
  chapters: [
    {
      sprig: "Những bông này, cho nụ cười của em",
      photos: [
        { src: "gif/photo/p01.jpg", wish: "Chúc em ngày nào cũng cười thật tươi như thế này." },
        { src: "gif/photo/p02.jpg", wish: "" },
        { src: "gif/photo/p03.jpg", wish: "" },
        { src: "gif/photo/p04.jpg", wish: "" },
        { src: "gif/photo/p05.jpg", wish: "" },
        { src: "gif/photo/p06.jpg", wish: "" }
      ]
    },
    {
      sprig: "Và những bông này, cho những ngày bình yên của em",
      photos: [
        { src: "gif/photo/p07.jpg", wish: "" },
        { src: "gif/photo/p08.jpg", wish: "" },
        { src: "gif/photo/p09.jpg", wish: "" },
        { src: "gif/photo/p10.jpg", wish: "" },
        { src: "gif/photo/p11.jpg", wish: "" },
        { src: "gif/photo/p12.jpg", wish: "Chúc em luôn khoẻ mạnh, bình an và được yêu thương thật nhiều." }
      ]
    }
  ],
  bouquet: {
    intro: "Anh gói tặng em một bó hoa…",
    tag: "Gửi em, 20.10",
    line: "Hoa ngoài tiệm sẽ héo. Bó này, anh giữ cho em mãi."
  },
  letter: {
    prompt: "Còn một điều anh muốn nói…",
    greeting: "Em,",
    paragraphs: [
      "Hôm nay ai cũng tặng hoa cho phụ nữ. Anh cũng muốn tặng em, nhưng anh nghĩ em xứng đáng được nghe nhiều hơn một câu “chúc em xinh đẹp”.",
      "Anh để ý hết đấy. Em hay nhường anh miếng ngon nhất. Em mệt nhưng vẫn hỏi anh ăn cơm chưa. Em lo cho ba mẹ, lo cho công việc, mà ít khi lo cho chính mình.",
      "Cảm ơn em vì đã chọn ở bên một người vụng về như anh. Và xin lỗi vì có những lúc anh vô tâm, làm em buồn mà không biết.",
      "Anh không hứa điều gì lớn lao. Anh chỉ hứa, từ nay mỗi ngày đều là 20/10 của em."
    ],
    closing: "Thương em,",
    photo: "gif/photo/p01.jpg",
    stamp: "gif/photo/p01.jpg",
    postmark: "20.10.2026"
  },
  ending: {
    line: "Hoa ngoài kia sẽ héo. Còn em, anh sẽ tưới mỗi ngày.",
    photo: "gif/photo/p09.jpg"
  },
  blooms: [
    "growing-garden/pink/bloom-cream-daisy-head-md-02.webp",
    "growing-garden/pink/bloom-cream-daisy-head-md-03.webp",
    "growing-garden/pink/bloom-peach-cosmos-head-md-02.webp",
    "growing-garden/pink/bloom-pink-clematis-head-md-01.webp",
    "growing-garden/pink/bloom-pink-daisy-head-md-01.webp",
    "growing-garden/pink/bloom-soft-pink-zinnia-head-md-02.webp",
    "growing-garden/pink/bloom-white-hibiscus-head-lg-01.webp"
  ],
  petals: [
    "growing-garden/pink/petal-blush-broad-02.webp",
    "growing-garden/pink/petal-coral-curved-01.webp",
    "growing-garden/pink/petal-cream-pink-blush-01.webp",
    "growing-garden/pink/petal-muted-rose-long-01.webp"
  ]
};

// Bouquet layout slots (x, y normalized coordinates)
const BOUQUET_SLOTS = [
  { x: 0.22, y: 0.17, scale: 0.95 },
  { x: 0.41, y: 0.11, scale: 1.05 },
  { x: 0.59, y: 0.11, scale: 1.05 },
  { x: 0.78, y: 0.17, scale: 0.95 },
  { x: 0.10, y: 0.33, scale: 0.88 },
  { x: 0.30, y: 0.27, scale: 1.00 },
  { x: 0.50, y: 0.25, scale: 1.10 },
  { x: 0.70, y: 0.27, scale: 1.00 },
  { x: 0.90, y: 0.33, scale: 0.88 },
  { x: 0.30, y: 0.44, scale: 0.95 },
  { x: 0.50, y: 0.42, scale: 1.05 },
  { x: 0.70, y: 0.44, scale: 0.95 },
  { x: 0.50, y: 0.05, scale: 0.80 },
  { x: 0.32, y: 0.08, scale: 0.75 },
  { x: 0.68, y: 0.08, scale: 0.75 },
  { x: 0.18, y: 0.22, scale: 0.75 },
  { x: 0.82, y: 0.22, scale: 0.75 }
];

class App {
  constructor() {
    this.appEl = document.getElementById('app');
    this.currentScene = 'cover';
    this.audioPlaying = false;
    this.audio = null;
    this.gardenTimeouts = [];
    this.bouquetTimeouts = [];
    this.letterTimeouts = [];

    this.initPetals();
    this.initMotes();
    this.initAudio();
    this.bindEvents();
  }

  // ================= BACKGROUND PARTICLES =================
  initPetals() {
    const container = document.getElementById('petal-field');
    if (!container) return;
    const petalImages = GIFT_DATA.petals;
    const count = 18;

    for (let i = 0; i < count; i++) {
      const img = document.createElement('img');
      img.src = petalImages[i % petalImages.length];
      img.className = 'floating-petal';
      const size = 20 + Math.random() * 26;
      img.style.width = `${size}px`;
      img.style.left = `${Math.random() * 100}%`;
      img.style.opacity = (0.4 + Math.random() * 0.45).toFixed(2);
      if (Math.random() > 0.6) {
        img.style.filter = 'blur(1.2px)';
      }

      const dur = 10 + Math.random() * 10;
      const delay = -Math.random() * 15;
      const startRot = Math.random() * 360;
      const endRot = startRot + (Math.random() > 0.5 ? 360 : -360);
      const sway = (Math.random() - 0.5) * 80;

      img.animate([
        { transform: `translate3d(0, 0, 0) rotate(${startRot}deg)` },
        { transform: `translate3d(${sway}px, 60vh, 0) rotate(${startRot + 180}deg)`, offset: 0.5 },
        { transform: `translate3d(${-sway / 2}px, 118vh, 0) rotate(${endRot}deg)` }
      ], {
        duration: dur * 1000,
        delay: delay * 1000,
        iterations: Infinity,
        easing: 'linear'
      });

      container.appendChild(img);
    }
  }

  initMotes() {
    const container = document.getElementById('mote-field');
    if (!container) return;
    const count = 14;

    for (let i = 0; i < count; i++) {
      const mote = document.createElement('div');
      mote.className = 'mote-particle';
      const size = 3 + Math.random() * 4;
      mote.style.width = `${size}px`;
      mote.style.height = `${size}px`;
      mote.style.left = `${10 + Math.random() * 80}%`;
      mote.style.bottom = `${5 + Math.random() * 25}%`;
      mote.style.background = 'radial-gradient(circle, #fffbe8 0%, #ffd9a0 55%, rgba(255, 210, 150, 0) 80%)';
      mote.style.boxShadow = '0 0 6px rgba(255, 220, 160, 0.7)';

      const dur = 4 + Math.random() * 4;
      const delay = Math.random() * 5;
      mote.style.setProperty('--max-op', (0.3 + Math.random() * 0.4).toFixed(2));
      mote.style.setProperty('--rise-y', `-${150 + Math.random() * 250}px`);
      mote.style.setProperty('--drift-x', `${(Math.random() - 0.5) * 60}px`);
      mote.style.animationDuration = `${dur}s`;
      mote.style.animationDelay = `${delay}s`;

      container.appendChild(mote);
    }
  }

  // ================= AUDIO =================
  initAudio() {
    this.musicBtn = document.getElementById('music-btn');
    if (!this.musicBtn) return;

    // Check if audio file exists or fallback
    try {
      this.audio = new Audio('music/intro.m4a');
      this.audio.loop = true;
    } catch (e) {
      this.audio = null;
    }

    this.musicBtn.addEventListener('click', () => {
      this.toggleAudio();
    });
  }

  toggleAudio() {
    if (!this.audio) {
      this.audioPlaying = !this.audioPlaying;
      this.updateAudioButton();
      return;
    }

    if (this.audioPlaying) {
      this.audio.pause();
      this.audioPlaying = false;
    } else {
      this.audio.play().then(() => {
        this.audioPlaying = true;
        this.updateAudioButton();
      }).catch(() => {
        this.audioPlaying = false;
        this.updateAudioButton();
      });
    }
    this.updateAudioButton();
  }

  updateAudioButton() {
    if (!this.musicBtn) return;
    if (this.audioPlaying) {
      this.musicBtn.textContent = '🎵';
      this.musicBtn.classList.add('playing');
      this.musicBtn.setAttribute('aria-label', 'Tắt nhạc');
    } else {
      this.musicBtn.textContent = '🔇';
      this.musicBtn.classList.remove('playing');
      this.musicBtn.setAttribute('aria-label', 'Bật nhạc');
    }
  }

  startAudioIfAllowed() {
    if (this.audio && !this.audioPlaying) {
      this.audio.play().then(() => {
        this.audioPlaying = true;
        this.updateAudioButton();
      }).catch(() => {
        // Autoplay blocked, wait for user click
      });
    }
  }

  // ================= EVENTS & NAVIGATION =================
  bindEvents() {
    const btnOpenCover = document.getElementById('btn-open-cover');
    if (btnOpenCover) {
      btnOpenCover.addEventListener('click', () => {
        this.startAudioIfAllowed();
        this.goToScene('garden');
      });
    }

    const btnBouquetNext = document.getElementById('btn-bouquet-next');
    if (btnBouquetNext) {
      btnBouquetNext.addEventListener('click', () => {
        this.goToScene('letter');
      });
    }

    const btnReplay = document.getElementById('btn-replay');
    if (btnReplay) {
      btnReplay.addEventListener('click', () => {
        this.goToScene('garden');
      });
    }
  }

  goToScene(sceneName) {
    this.currentScene = sceneName;
    document.querySelectorAll('.scene').forEach(el => el.classList.remove('active'));

    const targetEl = document.getElementById(`scene-${sceneName}`);
    if (targetEl) {
      targetEl.classList.add('active');
    }

    if (sceneName === 'cover' || sceneName === 'garden') {
      this.appEl.classList.remove('light-mode');
    } else {
      this.appEl.classList.add('light-mode');
    }

    if (sceneName === 'garden') {
      this.startGardenScene();
    } else if (sceneName === 'bouquet') {
      this.startBouquetScene();
    } else if (sceneName === 'letter') {
      this.startLetterScene();
    } else if (sceneName === 'ending') {
      this.startEndingScene();
    }
  }

  // ================= SCENE 2: GARDEN =================
  startGardenScene() {
    this.gardenTimeouts.forEach(t => clearTimeout(t));
    this.gardenTimeouts = [];

    const container = document.getElementById('garden-canvas-container');
    if (!container) return;
    container.innerHTML = '';

    const photoWrap = document.getElementById('garden-photo-wrap');
    const bigDate = document.getElementById('garden-big-date');
    const gardenLine = document.getElementById('garden-line');

    if (photoWrap) photoWrap.classList.remove('show');
    if (bigDate) bigDate.classList.remove('show');
    if (gardenLine) gardenLine.classList.remove('show');

    const W = window.innerWidth;
    const H = window.innerHeight;
    const centerX = W / 2;
    const centerY = H * 0.46;
    const flowerCount = W < 600 ? 18 : 32;

    const stemColors = ['#869377', '#7c8b6e', '#94917c', '#9aab86'];
    const leafShapes = [
      "M0 0 C 4.5 -4.2 4.9 4.8 0 10 C -4.9 4.8 -4.5 -4.2 0 0 Z",
      "M0 0 C 3.1 -5.4 3.1 6.4 0 11.6 C -3.1 6.4 -3.1 -5.4 0 0 Z"
    ];

    const flowerNodes = [];

    for (let i = 0; i < flowerCount; i++) {
      const angle = (i / flowerCount) * Math.PI * 2 + (Math.random() - 0.5) * 0.2;
      const radius = Math.min(W, H) * (0.35 + Math.random() * 0.32);
      const targetX = centerX + Math.cos(angle) * radius;
      const targetY = centerY + Math.sin(angle) * radius;

      const group = document.createElement('div');
      group.className = 'flower-stem-group';
      group.style.left = `${targetX}px`;
      group.style.top = `${targetY}px`;

      // SVG stem
      const stemLen = radius * 1.1;
      const boxW = Math.max(30, radius * 0.18);
      const curveX = (Math.random() - 0.5) * boxW * 0.8;
      const angleDeg = (Math.atan2(-(targetX - centerX), targetY - centerY) * 180) / Math.PI;

      group.style.transform = `rotate(${angleDeg}deg)`;

      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('width', boxW);
      svg.setAttribute('height', stemLen);
      svg.setAttribute('viewBox', `0 0 ${boxW} ${stemLen}`);
      svg.style.position = 'absolute';
      svg.style.left = `${-boxW / 2}px`;
      svg.style.top = '0';
      svg.style.overflow = 'visible';

      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      const startX = boxW / 2;
      const d = `M${startX} ${stemLen} C ${startX + curveX * 0.5} ${stemLen * 0.7}, ${startX + curveX} ${stemLen * 0.32}, ${startX + curveX * 0.3} 0`;
      path.setAttribute('d', d);
      path.setAttribute('fill', 'none');
      path.setAttribute('stroke', stemColors[i % stemColors.length]);
      path.setAttribute('stroke-width', Math.max(1.8, radius * 0.012));
      path.setAttribute('stroke-linecap', 'round');
      path.style.opacity = '0';
      path.style.transition = 'opacity 0.8s ease';
      svg.appendChild(path);

      // Leaves
      const leafCount = Math.random() > 0.4 ? 2 : 1;
      for (let l = 0; l < leafCount; l++) {
        const side = l % 2 === 0 ? 1 : -1;
        const leafY = stemLen * (0.35 + l * 0.3);
        const leafG = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        const leafRot = side * (35 + Math.random() * 25);
        leafG.setAttribute('transform', `translate(${startX + curveX * 0.3 * (leafY / stemLen)} ${leafY}) rotate(${leafRot}) scale(1.2)`);

        const leafPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        leafPath.setAttribute('d', leafShapes[l % leafShapes.length]);
        leafPath.setAttribute('fill', stemColors[(i + l) % stemColors.length]);
        leafPath.style.opacity = '0';
        leafPath.style.transition = 'opacity 0.6s ease';
        leafG.appendChild(leafPath);
        svg.appendChild(leafG);
      }

      group.appendChild(svg);

      // Bloom head
      const bloomImg = document.createElement('img');
      const bloomSrc = GIFT_DATA.blooms[i % GIFT_DATA.blooms.length];
      bloomImg.src = bloomSrc;
      bloomImg.draggable = false;
      const headPx = Math.min(W, H) * (0.11 + Math.random() * 0.08);
      bloomImg.style.width = `${headPx}px`;
      bloomImg.style.height = 'auto';
      bloomImg.style.position = 'absolute';
      bloomImg.style.left = '0';
      bloomImg.style.top = '0';
      bloomImg.style.transform = 'translate(-50%, -50%) scale(0)';
      bloomImg.style.filter = 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.28))';
      bloomImg.style.transition = 'transform 1s cubic-bezier(0.3, 1.18, 0.5, 1), opacity 0.6s ease';
      bloomImg.style.opacity = '0';

      group.appendChild(bloomImg);
      container.appendChild(group);

      flowerNodes.push({ group, path, bloomImg, svg });

      // Animate growth with staggered delays
      const growDelay = 400 + Math.random() * 1200;
      this.gardenTimeouts.push(setTimeout(() => {
        path.style.opacity = '0.7';
        svg.querySelectorAll('g path').forEach(lp => lp.style.opacity = '0.75');
        bloomImg.style.opacity = '1';
        bloomImg.style.transform = 'translate(-50%, -50%) scale(1)';
      }, growDelay));
    }

    // Overlay photo & text animations
    this.gardenTimeouts.push(setTimeout(() => {
      if (photoWrap) photoWrap.classList.add('show');
    }, 2800));

    this.gardenTimeouts.push(setTimeout(() => {
      if (bigDate) bigDate.classList.add('show');
    }, 3600));

    this.gardenTimeouts.push(setTimeout(() => {
      if (gardenLine) gardenLine.classList.add('show');
    }, 4500));

    // Transition to bouquet automatically after garden peak
    this.gardenTimeouts.push(setTimeout(() => {
      flowerNodes.forEach(({ group, bloomImg }) => {
        bloomImg.style.transform = 'translate(-50%, -50%) scale(0.4)';
        bloomImg.style.opacity = '0';
        group.style.opacity = '0';
      });
      if (photoWrap) photoWrap.classList.remove('show');
      if (bigDate) bigDate.classList.remove('show');
      if (gardenLine) gardenLine.classList.remove('show');
    }, 9500));

    this.gardenTimeouts.push(setTimeout(() => {
      this.goToScene('bouquet');
    }, 11000));
  }

  // ================= SCENE 3: BOUQUET =================
  startBouquetScene() {
    this.bouquetTimeouts.forEach(t => clearTimeout(t));
    this.bouquetTimeouts = [];

    const bloomsLayer = document.getElementById('bouquet-blooms-layer');
    const stemsSvg = document.getElementById('bouquet-stems-svg');
    const wrapContainer = document.getElementById('bouquet-wrap-container');
    const btnNext = document.getElementById('btn-bouquet-next');
    const cardEl = document.getElementById('polaroid-card');
    const toastEl = document.getElementById('chapter-toast');

    if (bloomsLayer) bloomsLayer.innerHTML = '';
    if (stemsSvg) stemsSvg.innerHTML = '';
    if (wrapContainer) wrapContainer.classList.remove('show');
    if (btnNext) btnNext.classList.remove('show');
    if (cardEl) cardEl.classList.remove('active', 'fold-anim');
    if (toastEl) toastEl.classList.remove('show');

    const stage = document.getElementById('bouquet-stage');
    const stageW = stage.clientWidth || 380;
    const stageH = stage.clientHeight || 520;
    const tiePoint = { x: stageW * 0.5, y: stageH * 0.88 };

    // Prepare list of photos and chapters
    const photosWithWish = [];
    GIFT_DATA.chapters.forEach((chap, cIdx) => {
      chap.photos.forEach(p => {
        photosWithWish.push({
          chapterIndex: cIdx,
          chapterTitle: chap.sprig,
          src: p.src,
          wish: p.wish || ""
        });
      });
    });

    let currentStep = 0;
    const totalSlots = Math.min(BOUQUET_SLOTS.length, photosWithWish.length);

    const showStep = () => {
      if (currentStep >= totalSlots) {
        // Complete bouquet
        if (wrapContainer) wrapContainer.classList.add('show');
        if (toastEl) toastEl.classList.remove('show');
        this.bouquetTimeouts.push(setTimeout(() => {
          if (btnNext) btnNext.classList.add('show');
        }, 1200));

        // Auto advance after 8s if user hasn't tapped
        this.bouquetTimeouts.push(setTimeout(() => {
          this.goToScene('letter');
        }, 8000));
        return;
      }

      const item = photosWithWish[currentStep];
      const slot = BOUQUET_SLOTS[currentStep];
      const targetX = slot.x * stageW;
      const targetY = slot.y * stageH;

      // Update chapter toast
      if (toastEl) {
        toastEl.textContent = item.chapterTitle;
        toastEl.classList.add('show');
      }

      // If item has a wish, display modal card
      if (item.wish && item.wish.trim()) {
        const cardImg = document.getElementById('polaroid-img');
        const cardWish = document.getElementById('polaroid-wish');
        if (cardImg) cardImg.src = item.src;
        if (cardWish) cardWish.textContent = item.wish;

        if (cardEl) {
          cardEl.classList.remove('fold-anim');
          cardEl.classList.add('active');
        }

        const advanceCard = () => {
          if (!cardEl.classList.contains('active')) return;
          cardEl.classList.remove('active');
          cardEl.classList.add('fold-anim');

          // Land flower into bouquet slot
          this.landFlower(stemsSvg, bloomsLayer, tiePoint, targetX, targetY, currentStep, slot.scale);

          currentStep++;
          this.bouquetTimeouts.push(setTimeout(showStep, 800));
        };

        // Click on card advances immediately
        cardEl.onclick = advanceCard;
        // Auto advance card after 3.8s
        this.bouquetTimeouts.push(setTimeout(advanceCard, 3800));
      } else {
        // Just flower landing directly
        this.landFlower(stemsSvg, bloomsLayer, tiePoint, targetX, targetY, currentStep, slot.scale);
        currentStep++;
        this.bouquetTimeouts.push(setTimeout(showStep, 350));
      }
    };

    // Intro toast
    if (toastEl) {
      toastEl.textContent = GIFT_DATA.bouquet.intro;
      toastEl.classList.add('show');
    }

    this.bouquetTimeouts.push(setTimeout(() => {
      showStep();
    }, 2000));
  }

  landFlower(stemsSvg, bloomsLayer, tie, targetX, targetY, index, scaleMultiplier = 1) {
    // Draw SVG stem
    if (stemsSvg) {
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      const midX = (tie.x + targetX) / 2 + (targetX - tie.x) * 0.15;
      const midY = (tie.y + targetY) / 2;
      const d = `M${tie.x} ${tie.y} Q ${midX} ${midY} ${targetX} ${targetY}`;
      path.setAttribute('d', d);
      path.setAttribute('fill', 'none');
      path.setAttribute('stroke', index % 2 === 0 ? '#6f8a5c' : '#7e9868');
      path.setAttribute('stroke-width', '4');
      path.setAttribute('stroke-linecap', 'round');
      path.style.strokeDasharray = '600';
      path.style.strokeDashoffset = '600';
      path.style.transition = 'stroke-dashoffset 0.7s ease-out';
      stemsSvg.appendChild(path);

      setTimeout(() => {
        path.style.strokeDashoffset = '0';
      }, 50);
    }

    // Add bloom
    if (bloomsLayer) {
      const bloomImg = document.createElement('img');
      bloomImg.src = GIFT_DATA.blooms[index % GIFT_DATA.blooms.length];
      bloomImg.className = 'bouquet-flower-bloom';
      bloomImg.draggable = false;
      const size = 68 * scaleMultiplier;
      bloomImg.style.width = `${size}px`;
      bloomImg.style.height = 'auto';
      bloomImg.style.left = `${targetX}px`;
      bloomImg.style.top = `${targetY}px`;
      bloomImg.style.zIndex = 10 + index;
      bloomsLayer.appendChild(bloomImg);

      setTimeout(() => {
        bloomImg.classList.add('landed');
      }, 200);
    }
  }

  // ================= SCENE 4: LETTER =================
  startLetterScene() {
    this.letterTimeouts.forEach(t => clearTimeout(t));
    this.letterTimeouts = [];

    const envelopeCard = document.getElementById('envelope-card');
    const envelopeFlap = document.getElementById('envelope-flap-top');
    const waxSeal = document.getElementById('wax-seal');
    const paperPreview = document.getElementById('envelope-paper-preview');
    const sprigs = document.getElementById('envelope-seal-sprigs');
    const readerContainer = document.getElementById('letter-reader-container');
    const btnOpenLetter = document.getElementById('btn-open-letter');
    const scrollContent = document.getElementById('letter-scroll-content');

    // Reset envelope states
    if (envelopeCard) envelopeCard.classList.remove('flipped');
    if (envelopeFlap) envelopeFlap.classList.remove('open');
    if (waxSeal) waxSeal.classList.remove('broken');
    if (paperPreview) paperPreview.classList.remove('slide-out');
    if (sprigs) sprigs.classList.remove('hidden');
    if (readerContainer) readerContainer.classList.remove('show');
    if (scrollContent) scrollContent.scrollTop = 0;

    // Flip to back after 2.2s so user sees front address first
    this.letterTimeouts.push(setTimeout(() => {
      if (envelopeCard) envelopeCard.classList.add('flipped');
    }, 2200));

    // Handle open letter interaction
    const openLetter = () => {
      if (envelopeFlap && envelopeFlap.classList.contains('open')) return;

      // 1. Break wax seal
      if (waxSeal) waxSeal.classList.add('broken');
      if (sprigs) sprigs.classList.add('hidden');

      // 2. Open flap
      this.letterTimeouts.push(setTimeout(() => {
        if (envelopeFlap) envelopeFlap.classList.add('open');
      }, 500));

      // 3. Paper slides out
      this.letterTimeouts.push(setTimeout(() => {
        if (paperPreview) paperPreview.classList.add('slide-out');
      }, 1000));

      // 4. Reveal full reading modal
      this.letterTimeouts.push(setTimeout(() => {
        if (readerContainer) readerContainer.classList.add('show');
        this.startLetterReadingScroll();
      }, 1800));
    };

    if (btnOpenLetter) btnOpenLetter.onclick = openLetter;
    if (waxSeal) waxSeal.onclick = openLetter;
    if (envelopeCard) {
      envelopeCard.onclick = () => {
        if (!envelopeCard.classList.contains('flipped')) {
          envelopeCard.classList.add('flipped');
        } else {
          openLetter();
        }
      };
    }

    const btnLetterDone = document.getElementById('btn-letter-done');
    if (btnLetterDone) {
      btnLetterDone.onclick = () => {
        this.goToScene('ending');
      };
    }
  }

  startLetterReadingScroll() {
    const scrollContent = document.getElementById('letter-scroll-content');
    if (!scrollContent) return;

    // Gentle reading auto-scroll
    let scrolled = 0;
    const maxScroll = scrollContent.scrollHeight - scrollContent.clientHeight;
    if (maxScroll <= 0) return;

    const scrollInterval = setInterval(() => {
      if (this.currentScene !== 'letter') {
        clearInterval(scrollInterval);
        return;
      }
      scrolled += 1;
      scrollContent.scrollTop = scrolled;
      if (scrolled >= maxScroll) {
        clearInterval(scrollInterval);
      }
    }, 45);

    // If user touches or scrolls manually, stop auto-scroll
    scrollContent.addEventListener('wheel', () => clearInterval(scrollInterval), { once: true });
    scrollContent.addEventListener('touchmove', () => clearInterval(scrollInterval), { once: true });
  }

  // ================= SCENE 5: ENDING =================
  startEndingScene() {
    const photoFrame = document.getElementById('ending-photo-frame');
    const preText = document.getElementById('ending-pre');
    const nameText = document.getElementById('ending-name');
    const quoteText = document.getElementById('ending-quote');
    const btnReplay = document.getElementById('btn-replay');

    if (photoFrame) photoFrame.classList.remove('show');
    if (preText) preText.classList.remove('show');
    if (nameText) nameText.classList.remove('show');
    if (quoteText) quoteText.classList.remove('show');
    if (btnReplay) btnReplay.classList.remove('show');

    setTimeout(() => {
      if (photoFrame) photoFrame.classList.add('show');
    }, 300);

    setTimeout(() => {
      if (preText) preText.classList.add('show');
    }, 800);

    setTimeout(() => {
      if (nameText) nameText.classList.add('show');
    }, 1400);

    setTimeout(() => {
      if (quoteText) quoteText.classList.add('show');
    }, 2000);

    setTimeout(() => {
      if (btnReplay) btnReplay.classList.add('show');
    }, 2800);
  }
}

// Initialize on DOMContentLoaded
window.addEventListener('DOMContentLoaded', () => {
  new App();
});
