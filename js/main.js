// ============ 확대(줌) 방지 ============
(function preventZoom() {
  document.addEventListener('gesturestart', (e) => e.preventDefault());
  let lastTouchEnd = 0;
  document.addEventListener('touchend', (e) => {
    const now = Date.now();
    if (now - lastTouchEnd <= 300) e.preventDefault();
    lastTouchEnd = now;
  }, { passive: false });
})();

// ============ 유틸 ============
function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str == null ? '' : String(str);
  return div.innerHTML;
}
function nl2br(str) {
  return escapeHtml(str).replace(/\n/g, '<br>');
}

let toastTimer = null;
function showToast(message) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 1800);
}

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
  } catch (e) {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
  }
}

// ============ 1. 히어로 ============
(function renderHero() {
  const hero = document.getElementById('hero');
  const c = CONFIG.intro;
  const style = c.heroStyle || (c.archFrame === false ? 'full' : c.archFrame ? 'arch' : 'vintage');

  if (style === 'vintage') {
    hero.classList.add('hero--vintage');
    const hasEnglishNames = c.groomNameEn && c.brideNameEn;
    const namesHtml = hasEnglishNames
      ? ''
      : `<p class="vintage-names vintage-names--kr serif-font">${escapeHtml(c.groomName)} · ${escapeHtml(c.brideName)}</p>`;
    const namesEnHtml = hasEnglishNames
      ? `<p class="vintage-names-en">${escapeHtml(c.groomNameEn)} &amp; ${escapeHtml(c.brideNameEn)}</p>`
      : '';
    const playBtn = CONFIG.video && CONFIG.video.enabled ? '<button class="vintage-play" id="heroPlayBtn" aria-label="영상 재생">▶</button>' : '';
    const frameSvg = '<svg class="frame-svg"><path fill="none" stroke="#fff"/></svg>';
    hero.innerHTML = `
      <div class="vintage-frame">
        ${frameSvg}
        <div class="vintage-frame__inner">
          ${frameSvg}
          <svg class="vintage-flourish" viewBox="0 0 220 34" aria-hidden="true">
            <path d="M110,17 C95,4 78,4 68,13 C60,20 68,27 76,22 C82,18 78,10 70,11" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
            <path d="M110,17 C125,4 142,4 152,13 C160,20 152,27 144,22 C138,18 142,10 150,11" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
            <circle cx="110" cy="17" r="2.5" fill="currentColor"/>
          </svg>
          <p class="vintage-frame__label">Happy Wedding Day</p>
          <div class="vintage-photo">
            <img src="${c.mainImage}" alt="메인 사진">
            ${playBtn}
          </div>
          ${namesHtml}
          ${namesEnHtml}
        </div>
      </div>`;
    const heroPlayBtn = document.getElementById('heroPlayBtn');
    if (heroPlayBtn) {
      heroPlayBtn.addEventListener('click', () => {
        document.getElementById('videoSection').scrollIntoView({ behavior: 'smooth' });
      });
    }

    // 네 모서리가 안쪽으로 오목하게 파인 곡선 프레임을 실제 렌더링 크기에 맞춰 그린다
    function drawConcaveFrame(container, radius, strokeWidth) {
      const svg = container.querySelector(':scope > .frame-svg');
      const path = svg.querySelector('path');
      path.setAttribute('stroke-width', strokeWidth);
      function update() {
        const w = container.clientWidth;
        const h = container.clientHeight;
        if (!w || !h) return;
        const r = Math.min(radius, w / 2 - 1, h / 2 - 1);
        const d = `M ${r} 0 L ${w - r} 0 A ${r} ${r} 0 0 0 ${w} ${r} L ${w} ${h - r} A ${r} ${r} 0 0 0 ${w - r} ${h} L ${r} ${h} A ${r} ${r} 0 0 0 0 ${h - r} L 0 ${r} A ${r} ${r} 0 0 0 ${r} 0 Z`;
        path.setAttribute('d', d);
      }
      update();
      if (window.ResizeObserver) new ResizeObserver(update).observe(container);
      else window.addEventListener('resize', update);
    }
    drawConcaveFrame(document.querySelector('.vintage-frame'), 30, 3);
    drawConcaveFrame(document.querySelector('.vintage-frame__inner'), 22, 3);
  } else if (style === 'arch') {
    hero.classList.add('hero--arch');
    hero.innerHTML = `
      <div class="hero__title serif-font">${escapeHtml(c.groomName)} · ${escapeHtml(c.brideName)}</div>
      <div class="hero__frame"><img src="${c.mainImage}" alt="메인 사진"></div>
      <div class="hero__info">
        <div>${escapeHtml(c.dateText)}</div>
        <div class="venue">${escapeHtml(c.venueShort)}</div>
      </div>`;
  } else {
    hero.classList.add('hero--full');
    hero.innerHTML = `
      <img src="${c.mainImage}" alt="메인 사진">
      <div class="hero__overlay"></div>
      <div class="hero__title">${escapeHtml(c.groomName)} · ${escapeHtml(c.brideName)}</div>
      <div class="hero__info">
        <div>${escapeHtml(c.dateText)}</div>
        <div class="venue">${escapeHtml(c.venueShort)}</div>
      </div>`;
  }
})();

// ============ 2. 인사말 ============
(function renderGreeting() {
  document.getElementById('greetingQuote').innerHTML = CONFIG.intro.message
    .map((para) => `<p>${nl2br(para)}</p>`)
    .join('');
  const p = CONFIG.parents;
  document.getElementById('greetingParents').innerHTML =
    `<p>${escapeHtml(p.groom.father)} · ${escapeHtml(p.groom.mother)} 의 ${escapeHtml(p.groom.relation)}&nbsp;&nbsp; <b>${escapeHtml(CONFIG.intro.groomName)}</b></p>` +
    `<p>${escapeHtml(p.bride.father)} · ${escapeHtml(p.bride.mother)} 의 ${escapeHtml(p.bride.relation)}&nbsp;&nbsp; <b>${escapeHtml(CONFIG.intro.brideName)}</b></p>`;
})();

// ============ 3. 캘린더 / 디데이 ============
(function renderCalendar() {
  const weddingDate = new Date(CONFIG.calendar.date);
  const grid = document.getElementById('calendarGrid');
  const ddayEl = document.getElementById('ddayText');
  if (!grid) return;

  const dateTextEl = document.getElementById('weddingDateText');
  const venueTextEl = document.getElementById('weddingVenueText');
  if (dateTextEl) dateTextEl.textContent = CONFIG.intro.dateText;
  if (venueTextEl) venueTextEl.innerHTML = nl2br(CONFIG.intro.venueShort);

  const year = weddingDate.getFullYear();
  const month = weddingDate.getMonth();
  const monthEl = document.getElementById('calendarMonth');
  if (monthEl) monthEl.textContent = `${month + 1}월`;

  const firstDay = new Date(year, month, 1).getDay();
  const lastDate = new Date(year, month + 1, 0).getDate();
  const dows = ['일', '월', '화', '수', '목', '금', '토'];

  let html = dows.map((d, i) => `<div class="dow${i === 0 ? ' dow--sun' : ''}">${d}</div>`).join('');
  for (let i = 0; i < firstDay; i++) html += '<div class="day empty"></div>';
  for (let d = 1; d <= lastDate; d++) {
    const isDday = d === weddingDate.getDate();
    html += `<div class="day${isDday ? ' dday' : ''}">${d}</div>`;
  }
  grid.innerHTML = html;

  function update() {
    const now = new Date();
    const diffDays = Math.ceil((weddingDate - now) / (1000 * 60 * 60 * 24));
    if (diffDays > 0) ddayEl.textContent = `결혼식이 ${diffDays}일 남았습니다.`;
    else if (diffDays === 0) ddayEl.textContent = '오늘, 두 사람이 하나가 됩니다.';
    else ddayEl.textContent = '결혼식이 있었습니다.';
  }
  update();
  setInterval(update, 1000 * 60 * 30);
})();

// ============ 4. 영상 ============
(function renderVideo() {
  const section = document.getElementById('videoSection');
  const v = CONFIG.video;
  if (!v.enabled || !v.youtubeUrl) return;
  const match = v.youtubeUrl.match(/(?:v=|youtu\.be\/)([\w-]{11})/);
  if (!match) return;
  document.getElementById('videoFrame').src = `https://www.youtube.com/embed/${match[1]}`;
  section.hidden = false;
})();

// ============ 5. 갤러리 ============
(function initGallery() {
  const images = CONFIG.gallery;
  const mainImg = document.getElementById('galleryMainImg');
  const thumbsWrap = document.getElementById('galleryThumbs');
  const mainPrevBtn = document.getElementById('galleryPrev');
  const mainNextBtn = document.getElementById('galleryNext');
  if (!mainImg || images.length === 0) return;

  let mainIndex = 0;

  thumbsWrap.innerHTML = images
    .map((src, i) => `<img src="${src}" data-index="${i}" alt="썸네일 ${i + 1}" loading="lazy">`)
    .join('');

  function shiftThumbStrip(index) {
    const thumbEl = thumbsWrap.firstElementChild;
    if (!thumbEl) return;
    const gapPx = parseFloat(getComputedStyle(thumbsWrap).gap) || 0;
    const slot = thumbEl.getBoundingClientRect().width + gapPx;
    if (!slot) return;
    const firstVisibleIndex = Math.round(thumbsWrap.scrollLeft / slot);
    const position = index - firstVisibleIndex + 1;
    const maxScroll = thumbsWrap.scrollWidth - thumbsWrap.clientWidth;
    let target = thumbsWrap.scrollLeft;
    if (position >= 5) target += slot;
    else if (position <= 4) target -= slot;
    target = Math.max(0, Math.min(maxScroll, target));
    thumbsWrap.scrollLeft = target;
  }

  function setMain(index, animate) {
    mainIndex = index;
    if (animate) {
      mainImg.style.transition = 'opacity 0.25s ease';
      mainImg.style.opacity = '0';
      setTimeout(() => {
        mainImg.src = images[mainIndex];
        mainImg.style.opacity = '1';
      }, 150);
    } else {
      mainImg.src = images[mainIndex];
    }
    thumbsWrap.querySelectorAll('img').forEach((t, i) => t.classList.toggle('active', i === mainIndex));
    shiftThumbStrip(mainIndex);
  }
  setMain(0, false);

  mainPrevBtn.addEventListener('click', () => setMain((mainIndex - 1 + images.length) % images.length, true));
  mainNextBtn.addEventListener('click', () => setMain((mainIndex + 1) % images.length, true));
  thumbsWrap.querySelectorAll('img').forEach((t) => {
    t.addEventListener('click', () => setMain(Number(t.dataset.index), true));
  });
  mainImg.addEventListener('click', () => openLightbox(mainIndex));

  let current = 0;
  const lightbox = document.getElementById('lightbox');
  const track = document.getElementById('lightboxTrack');
  const imgPrev = document.getElementById('lightboxImgPrev');
  const imgCurrent = document.getElementById('lightboxImgCurrent');
  const imgNext = document.getElementById('lightboxImgNext');
  const SWIPE_THRESHOLD = 50;
  const TRANSITION = 'transform 0.32s ease';

  function idx(offset) {
    return (current + offset + images.length) % images.length;
  }
  function syncSlides() {
    imgPrev.src = images[idx(-1)];
    imgCurrent.src = images[current];
    imgNext.src = images[idx(1)];
  }

  function openLightbox(index) {
    current = index;
    track.style.transition = 'none';
    track.style.transform = 'translateX(-33.3333%)';
    syncSlides();
    lightbox.hidden = false;
  }

  // 트랙(이전+현재+다음 3장)을 통째로 슬라이드시켜 사진끼리 자연스럽게 이어지도록 전환
  let isAnimating = false;
  function goToImage(direction) {
    if (isAnimating) return;
    isAnimating = true;
    track.style.transition = TRANSITION;
    track.style.transform = `translateX(${direction === 1 ? '-66.6666%' : '0%'})`;
    setTimeout(() => {
      current = idx(direction);
      syncSlides();
      track.style.transition = 'none';
      track.style.transform = 'translateX(-33.3333%)';
      isAnimating = false;
    }, 320);
  }

  function closeLightbox() { lightbox.hidden = true; }
  lightbox.addEventListener('click', (e) => {
    if (e.target.closest('#lightboxClose')) { closeLightbox(); return; }
    if (e.target.closest('#lightboxPrev')) { goToImage(-1); return; }
    if (e.target.closest('#lightboxNext')) { goToImage(1); return; }
    if (e.target === lightbox || e.target.classList.contains('lightbox__slide')) closeLightbox();
  });
  document.addEventListener('keydown', (e) => {
    if (lightbox.hidden) return;
    if (e.key === 'Escape') lightbox.hidden = true;
    if (e.key === 'ArrowRight') goToImage(1);
    if (e.key === 'ArrowLeft') goToImage(-1);
  });

  // 드래그(스와이프)로 넘기기 — 트랙 전체가 손가락을 따라 함께 이동
  let dragStartX = 0;
  let dragDeltaX = 0;
  let isDragging = false;

  function onDragStart(e) {
    if (isAnimating) return;
    isDragging = true;
    dragStartX = e.clientX;
    track.style.transition = 'none';
  }
  function onDragMove(e) {
    if (!isDragging) return;
    dragDeltaX = e.clientX - dragStartX;
    track.style.transform = `translateX(calc(-33.3333% + ${dragDeltaX}px))`;
  }
  function onDragEnd() {
    if (!isDragging) return;
    isDragging = false;
    if (Math.abs(dragDeltaX) > SWIPE_THRESHOLD) {
      goToImage(dragDeltaX < 0 ? 1 : -1);
    } else {
      track.style.transition = TRANSITION;
      track.style.transform = 'translateX(-33.3333%)';
    }
    dragDeltaX = 0;
  }
  track.addEventListener('pointerdown', onDragStart);
  track.addEventListener('pointermove', onDragMove);
  track.addEventListener('pointerup', onDragEnd);
  track.addEventListener('pointerleave', onDragEnd);
})();

// ============ 6. 오시는 길 ============
(function renderMap() {
  const m = CONFIG.map;
  document.getElementById('venueAddress').textContent = m.address;

  if (CONFIG.kakao && CONFIG.kakao.appKey) {
    const mapEl = document.getElementById('mapEmbed');
    mapEl.hidden = false;
    const script = document.createElement('script');
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${CONFIG.kakao.appKey}&autoload=false`;
    script.onload = () => {
      kakao.maps.load(() => {
        const position = new kakao.maps.LatLng(m.lat, m.lng);
        const map = new kakao.maps.Map(mapEl, { center: position, level: 5 });
        new kakao.maps.Marker({ position, map });
      });
    };
    document.head.appendChild(script);
  }

  const q = encodeURIComponent(m.name);
  document.getElementById('kakaoMapBtn').href = `kakaomap://route?ep=${m.lat},${m.lng}&by=car`;
  document.getElementById('naverMapBtn').href = `nmap://navigation?dlat=36.8478727&dlng=127.1590854&dname=${encodeURIComponent('비렌티 웨딩홀 & 뷔페')}&appname=wedding-invitation-kappa-three-94.vercel.app`;
  document.getElementById('tmapBtn').href = `tmap://route?goalname=${encodeURIComponent('비렌티')}&goalx=${m.lng}&goaly=${m.lat}`;

  const t = m.transport;
  const CIRCLED_NUMS = ['①', '②', '③', '④', '⑤', '⑥', '⑦', '⑧', '⑨', '⑩'];
  function transportGroup(label, data, subClass) {
    if (!data || !data.steps || !data.steps.length) return '';
    const stepItems = data.steps.map((step, i) => {
      const num = CIRCLED_NUMS[i] || `${i + 1}.`;
      const isObj = typeof step === 'object';
      const text = isObj ? step.text : step;
      const sub = isObj && step.sub ? `<div class="transport-sub${subClass ? ` ${subClass}` : ''}">${escapeHtml(step.sub)}</div>` : '';
      return `<li class="transport-step"><span class="transport-num">${num}</span>${escapeHtml(text)}${sub}</li>`;
    }).join('');
    const noteItems = (data.notes || []).map((n) => `<li class="transport-note">${escapeHtml(n)}</li>`).join('');
    return `<div class="transport-group"><b>${label}</b><ul class="transport-steplist">${stepItems}</ul>${noteItems ? `<ul class="transport-sublist">${noteItems}</ul>` : ''}</div>`;
  }
  const rows = [
    transportGroup('셔틀버스', t.shuttle, 'transport-sub--plain'),
    transportGroup('시내버스', t.bus),
  ].filter(Boolean);
  document.getElementById('transportList').innerHTML = rows.join('');
})();

// ============ 7. 안내사항 ============
(function renderInformation() {
  const list = CONFIG.information || [];
  const section = document.getElementById('informationSection');
  if (list.length === 0) { section.hidden = true; return; }
  document.getElementById('informationList').innerHTML = list
    .map((item) => `<div class="info-block">
      ${item.title ? `<p class="info-block__title">${escapeHtml(item.title)}</p>` : ''}
      <p class="info-block__content">${nl2br(item.content)}</p>
    </div>`)
    .join('');
})();

// ============ 8. 계좌 아코디언 ============
(function renderAccounts() {
  function row(a) {
    const payBtn = a.payUrl
      ? `<a class="btn-kakaopay-sm" href="${escapeHtml(a.payUrl)}" target="_blank" rel="noopener"><svg width="10" height="10" viewBox="0 0 20 20" aria-hidden="true"><path d="M10 3C5.6 3 2 5.9 2 9.5c0 2.3 1.5 4.3 3.7 5.5l-.9 3.3c-.1.3.2.6.5.4l3.9-2.6c.3 0 .5 0 .8 0 4.4 0 8-2.9 8-6.6S14.4 3 10 3z" fill="#391B1B"/></svg>pay</a>`
      : `<span class="btn-kakaopay-sm" style="visibility:hidden;" aria-hidden="true">pay</span>`;
    return `<div class="account-row">
      <div><span class="account-row__who">${escapeHtml(a.name)}</span><span class="account-row__num">${escapeHtml(a.bank)} ${escapeHtml(a.number)}</span></div>
      <div class="account-row__actions">
        <button type="button" class="btn-ghost-sm" data-copy-text="${escapeHtml(a.bank)} ${escapeHtml(a.number)}">복사</button>
        ${payBtn}
      </div>
    </div>`;
  }
  document.getElementById('accGroom').innerHTML = CONFIG.accounts.groom.map(row).join('');
  document.getElementById('accBride').innerHTML = CONFIG.accounts.bride.map(row).join('');

  document.querySelectorAll('.accordion__head').forEach((head) => {
    head.addEventListener('click', () => {
      const body = document.querySelector(head.dataset.target);
      if (body) body.hidden = !body.hidden;
    });
  });
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-copy-text]');
    if (!btn) return;
    copyText(btn.dataset.copyText);
    showToast('복사했습니다');
  });
})();

// ============ 9. RSVP ============
(function initRsvp() {
  const section = document.getElementById('rsvpSection');
  if (!CONFIG.rsvp.enabled) { section.hidden = true; return; }

  const form = document.getElementById('rsvpForm');
  const submitBtn = document.getElementById('rsvpSubmit');
  const state = { side: '신랑측', attend: '참석', meal: '식사 가능' };

  form.querySelectorAll('.toggle-group').forEach((group) => {
    const field = group.dataset.field;
    group.querySelectorAll('.toggle-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        group.querySelectorAll('.toggle-btn').forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        state[field] = btn.dataset.value;
      });
    });
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('rsvpName').value.trim();
    const count = document.getElementById('rsvpCount').value;
    const consent = document.getElementById('rsvpConsent').checked;
    if (!name || !consent) {
      showToast('필수 항목을 모두 입력해 주세요');
      return;
    }
    const payload = { ...state, name, count, submittedAt: new Date().toISOString() };

    if (!CONFIG.rsvp.endpoint) {
      showToast('RSVP 저장소가 아직 설정되지 않았어요 (README 참고)');
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = '제출 중...';
    try {
      await fetch(CONFIG.rsvp.endpoint, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload),
      });
      showToast('참석 여부가 전달되었습니다. 감사합니다!');
      form.reset();
    } catch (err) {
      showToast('전송에 실패했어요. 잠시 후 다시 시도해 주세요');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = '제출';
    }
  });
})();

// ============ 10. 공유 ============
(function initShare() {
  document.getElementById('copyLinkBtn').addEventListener('click', async () => {
    await copyText(location.href);
    showToast('링크를 복사했습니다');
  });

  const kakaoBtn = document.getElementById('kakaoShareBtn');
  if (CONFIG.kakao.appKey) {
    const script = document.createElement('script');
    script.src = 'https://developers.kakao.com/sdk/js/kakao.min.js';
    script.onload = () => {
      Kakao.init(CONFIG.kakao.appKey);
      kakaoBtn.hidden = false;
    };
    document.head.appendChild(script);

    kakaoBtn.addEventListener('click', () => {
      Kakao.Share.sendDefault({
        objectType: 'feed',
        content: {
          title: CONFIG.share.title,
          description: CONFIG.share.description,
          imageUrl: CONFIG.share.kakaoThumbnail,
          link: { mobileWebUrl: location.href, webUrl: location.href },
        },
        buttons: [
          {
            title: '청첩장 보기',
            link: { mobileWebUrl: location.href, webUrl: location.href },
          },
        ],
      });
    });
  }
})();

// ============ BGM ============
(function initBgm() {
  const toggle = document.getElementById('bgmToggle');
  if (!CONFIG.bgm.enabled) return;
  const audio = new Audio(CONFIG.bgm.src);
  audio.loop = true;
  toggle.hidden = false;

  function play() {
    audio.play().then(() => toggle.classList.add('playing')).catch(() => {});
  }
  function pause() {
    audio.pause();
    toggle.classList.remove('playing');
  }

  if (CONFIG.bgm.autoPlay) {
    play();
    const resumeOnce = () => { play(); document.removeEventListener('click', resumeOnce); document.removeEventListener('touchstart', resumeOnce); };
    document.addEventListener('click', resumeOnce, { once: true });
    document.addEventListener('touchstart', resumeOnce, { once: true });
  }

  toggle.addEventListener('click', () => {
    if (toggle.classList.contains('playing')) pause(); else play();
  });
})();

// ============ 스크롤 페이드업 ============
(function initFadeUp() {
  const targets = document.querySelectorAll('.fade-up');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.25 });
  targets.forEach((t) => observer.observe(t));
})();

// ============ 푸터 ============
document.getElementById('footerNames').textContent =
  `${CONFIG.intro.groomName} & ${CONFIG.intro.brideName}의 결혼식에 함께해 주셔서 감사합니다.`;

// ============ 문서 타이틀/공유 메타 ============
document.title = CONFIG.share.title;
