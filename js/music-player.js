/**
 * Modern Floating Music Player & Playlist Manager
 * Includes:
 * 1. "Và Thế Giới Đã Mất Đi Một Người Cô Đơn" (marzuz x Gill)
 * 2. "Chờ Chút" (CONGB)
 */

(function () {
  const PLAYLIST = [
    {
      title: "Và Thế Giới Đã Mất Đi Một Người Cô Đơn",
      artist: "marzuz x Gill",
      src: "music/va-the-gioi-da-mat-di-mot-nguoi-co-don.webm"
    },
    {
      title: "Chờ Chút",
      artist: "CONGB",
      src: "music/cho-chut.webm"
    }
  ];

  let currentIndex = 0;
  let isPlaying = false;
  let userInteracted = false;

  const audio = new Audio();
  audio.preload = "auto";
  audio.src = PLAYLIST[currentIndex].src;

  // Auto next song when ended
  audio.addEventListener("ended", () => {
    nextTrack();
  });

  function playTrack(index) {
    if (index >= 0 && index < PLAYLIST.length) {
      currentIndex = index;
    }
    audio.src = PLAYLIST[currentIndex].src;
    audio.play().then(() => {
      isPlaying = true;
      updateUI();
      showToast(`Đang phát: ${PLAYLIST[currentIndex].title}`);
    }).catch(() => {
      isPlaying = false;
      updateUI();
    });
  }

  function togglePlay() {
    if (audio.paused) {
      audio.play().then(() => {
        isPlaying = true;
        updateUI();
      }).catch(() => {
        isPlaying = false;
        updateUI();
      });
    } else {
      audio.pause();
      isPlaying = false;
      updateUI();
    }
  }

  function nextTrack() {
    currentIndex = (currentIndex + 1) % PLAYLIST.length;
    playTrack(currentIndex);
  }

  function prevTrack() {
    currentIndex = (currentIndex - 1 + PLAYLIST.length) % PLAYLIST.length;
    playTrack(currentIndex);
  }

  // Create UI
  function createPlayerUI() {
    // Inject CSS
    const style = document.createElement("style");
    style.textContent = `
      #lovegift-player-wrap {
        position: fixed;
        top: 14px;
        right: 14px;
        z-index: 99999;
        display: flex;
        align-items: center;
        gap: 10px;
        font-family: 'Be Vietnam Pro', -apple-system, sans-serif;
      }
      .music-disc-btn {
        width: 44px;
        height: 44px;
        border-radius: 50%;
        border: 1.5px solid rgba(255, 255, 255, 0.45);
        background: rgba(255, 255, 255, 0.25);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        color: #fff;
        font-size: 19px;
        box-shadow: 0 4px 18px rgba(74, 28, 44, 0.25);
        transition: all 0.3s cubic-bezier(0.22, 1, 0.36, 1);
        position: relative;
      }
      .music-disc-btn:hover {
        transform: scale(1.08);
        background: rgba(255, 255, 255, 0.4);
      }
      .music-disc-btn.playing {
        animation: spinDisc 8s linear infinite;
        box-shadow: 0 0 18px rgba(255, 180, 200, 0.6);
        border-color: rgba(255, 210, 225, 0.8);
      }
      @keyframes spinDisc {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
      .music-panel-pill {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 6px 14px 6px 12px;
        border-radius: 999px;
        background: rgba(255, 255, 255, 0.35);
        backdrop-filter: blur(14px);
        -webkit-backdrop-filter: blur(14px);
        border: 1px solid rgba(255, 255, 255, 0.5);
        box-shadow: 0 6px 20px rgba(74, 28, 44, 0.15);
        color: #4a1c2c;
        transition: all 0.3s ease;
      }
      .music-info {
        display: flex;
        flex-direction: column;
        max-width: 170px;
        overflow: hidden;
      }
      .music-title {
        font-size: 11px;
        font-weight: 600;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        color: #5b1d30;
      }
      .music-artist {
        font-size: 9.5px;
        color: #7a3a4c;
        opacity: 0.85;
      }
      .music-ctrl-btn {
        background: none;
        border: none;
        cursor: pointer;
        padding: 4px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #5b1d30;
        font-size: 13px;
        border-radius: 50%;
        transition: transform 0.2s ease;
      }
      .music-ctrl-btn:hover {
        transform: scale(1.18);
      }
      .music-toast {
        position: fixed;
        bottom: 24px;
        left: 50%;
        transform: translateX(-50%) translateY(50px);
        background: rgba(74, 28, 44, 0.85);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        color: #fff;
        padding: 9px 20px;
        border-radius: 999px;
        font-size: 12.5px;
        font-weight: 500;
        pointer-events: none;
        opacity: 0;
        transition: all 0.5s cubic-bezier(0.22, 1, 0.36, 1);
        z-index: 999999;
        box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25);
      }
      .music-toast.show {
        transform: translateX(-50%) translateY(0);
        opacity: 1;
      }
      /* Wave bars */
      .music-wave {
        display: flex;
        align-items: flex-end;
        gap: 2px;
        height: 12px;
      }
      .music-wave span {
        width: 2px;
        height: 100%;
        background: #a52038;
        border-radius: 999px;
      }
      .playing .music-wave span:nth-child(1) { animation: waveAnim 0.8s ease-in-out infinite alternate; }
      .playing .music-wave span:nth-child(2) { animation: waveAnim 0.6s ease-in-out infinite 0.2s alternate; }
      .playing .music-wave span:nth-child(3) { animation: waveAnim 0.9s ease-in-out infinite 0.4s alternate; }
      @keyframes waveAnim {
        0% { height: 2px; }
        100% { height: 12px; }
      }
    `;
    document.head.appendChild(style);

    const wrap = document.createElement("div");
    wrap.id = "lovegift-player-wrap";

    wrap.innerHTML = `
      <div class="music-panel-pill" id="music-pill">
        <div class="music-wave" id="music-wave">
          <span></span><span></span><span></span>
        </div>
        <div class="music-info" id="music-info-btn" title="Chuyển bài hát" style="cursor: pointer;">
          <span class="music-title" id="player-track-title">${PLAYLIST[currentIndex].title}</span>
          <span class="music-artist" id="player-track-artist">${PLAYLIST[currentIndex].artist}</span>
        </div>
        <button type="button" class="music-ctrl-btn" id="player-play-btn" aria-label="Phát / Dừng">▶</button>
        <button type="button" class="music-ctrl-btn" id="player-next-btn" title="Bài tiếp theo" aria-label="Bài tiếp theo">⏭</button>
      </div>
      <button type="button" class="music-disc-btn" id="player-disc-btn" aria-label="Âm nhạc">🎵</button>
    `;

    document.body.appendChild(wrap);

    const toast = document.createElement("div");
    toast.className = "music-toast";
    toast.id = "music-toast-el";
    document.body.appendChild(toast);

    // Bind controls
    document.getElementById("player-disc-btn").onclick = togglePlay;
    document.getElementById("player-play-btn").onclick = togglePlay;
    document.getElementById("player-next-btn").onclick = nextTrack;
    document.getElementById("music-info-btn").onclick = nextTrack;

    // Hide original Next.js audio button if present to prevent overlap
    const origBtn = document.querySelector('button[aria-label="Tắt nhạc"], button[aria-label="Bật nhạc"], button.fixed.right-4.top-4');
    if (origBtn && origBtn !== document.getElementById("player-disc-btn")) {
      origBtn.style.display = "none";
    }
  }

  function updateUI() {
    const discBtn = document.getElementById("player-disc-btn");
    const playBtn = document.getElementById("player-play-btn");
    const titleEl = document.getElementById("player-track-title");
    const artistEl = document.getElementById("player-track-artist");
    const waveEl = document.getElementById("music-pill");

    if (titleEl) titleEl.textContent = PLAYLIST[currentIndex].title;
    if (artistEl) artistEl.textContent = PLAYLIST[currentIndex].artist;

    if (isPlaying) {
      if (discBtn) discBtn.classList.add("playing");
      if (waveEl) waveEl.classList.add("playing");
      if (playBtn) playBtn.textContent = "⏸";
    } else {
      if (discBtn) discBtn.classList.remove("playing");
      if (waveEl) waveEl.classList.remove("playing");
      if (playBtn) playBtn.textContent = "▶";
    }
  }

  function showToast(msg) {
    const toast = document.getElementById("music-toast-el");
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add("show");
    setTimeout(() => {
      toast.classList.remove("show");
    }, 2800);
  }

  // Auto start on first user interaction
  function handleFirstInteraction() {
    if (userInteracted) return;
    userInteracted = true;
    if (audio.paused) {
      playTrack(0);
    }
  }

  window.addEventListener("click", handleFirstInteraction, { once: true });
  window.addEventListener("touchstart", handleFirstInteraction, { once: true });

  if (document.readyState === "loading") {
    window.addEventListener("DOMContentLoaded", () => {
      createPlayerUI();
      updateUI();
    });
  } else {
    createPlayerUI();
    updateUI();
  }
})();
