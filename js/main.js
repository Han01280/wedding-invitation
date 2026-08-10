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
    `<p>${escapeHtml(p.groom.father)} · ${escapeHtml(p.groom.mother)} 의 ${escapeHtml(p.groom.relation)} <b>${escapeHtml(CONFIG.intro.groomName)}</b></p>` +
    `<p>${escapeHtml(p.bride.father)} · ${escapeHtml(p.bride.mother)} 의 ${escapeHtml(p.bride.relation)} <b>${escapeHtml(CONFIG.intro.brideName)}</b></p>`;
})();

// ============ 연락처 모달 ============
(function initContactModal() {
  const btn = document.getElementById('contactBtn');
  const modal = document.getElementById('contactModal');
  if (!btn || !modal) return;

  function contactRow(person) {
    return `<div class="contact-row">
      <div class="contact-row__info"><span class="rel">${escapeHtml(person.relation)}</span>${escapeHtml(person.name)}</div>
      <a href="tel:${person.phone.replace(/[^0-9+]/g, '')}">전화하기</a>
    </div>`;
  }

  function open() {
    const c = CONFIG.contacts;
    modal.innerHTML = `
      <div class="modal-sheet">
        <h3>축하 연락하기</h3>
        <div class="contact-group">
          <p class="contact-group__label">신랑측</p>
          ${c.groom.map(contactRow).join('')}
        </div>
        <div class="contact-group">
          <p class="contact-group__label">신부측</p>
          ${c.bride.map(contactRow).join('')}
        </div>
        <button class="modal-close" id="contactModalClose">닫기</button>
      </div>`;
    modal.hidden = false;
    document.getElementById('contactModalClose').addEventListener('click', close);
  }
  function close() { modal.hidden = true; }

  btn.addEventListener('click', open);
  modal.addEventListener('click', (e) => { if (e.target === modal) close(); });
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
  const gridWrap = document.getElementById('galleryGrid');
  if (!gridWrap || images.length === 0) return;

  gridWrap.innerHTML = images
    .map((src, i) => `<img src="${src}" data-index="${i}" alt="갤러리 사진 ${i + 1}" loading="lazy">`)
    .join('');

  let current = 0;
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const SWIPE_THRESHOLD = 50;

  function openLightbox(index) {
    current = index;
    lightboxImg.style.transition = 'none';
    lightboxImg.style.transform = 'translateX(0)';
    lightboxImg.src = images[current];
    lightbox.hidden = false;
  }

  // direction: 1이면 다음 사진(왼쪽으로 슬라이드), -1이면 이전 사진(오른쪽으로 슬라이드)
  // 사진이 화면 밖으로 완전히 슬라이드되어 나간 뒤, 반대편 화면 밖에서 다음 사진이 이어서 슬라이드 들어오는 방식
  let isAnimating = false;
  function goToImage(index, direction) {
    if (isAnimating) return;
    isAnimating = true;
    current = (index + images.length) % images.length;
    const dist = window.innerWidth;
    lightboxImg.style.transition = 'transform 0.3s ease';
    lightboxImg.style.transform = `translateX(${direction * -dist}px)`;
    setTimeout(() => {
      lightboxImg.src = images[current];
      lightboxImg.style.transition = 'none';
      lightboxImg.style.transform = `translateX(${direction * dist}px)`;
      setTimeout(() => {
        lightboxImg.style.transition = 'transform 0.3s ease';
        lightboxImg.style.transform = 'translateX(0)';
        setTimeout(() => { isAnimating = false; }, 300);
      }, 20);
    }, 300);
  }

  gridWrap.querySelectorAll('img').forEach((img) => {
    img.addEventListener('click', () => openLightbox(Number(img.dataset.index)));
  });

  document.getElementById('lightboxClose').addEventListener('click', () => { lightbox.hidden = true; });
  document.getElementById('lightboxPrev').addEventListener('click', () => goToImage(current - 1, -1));
  document.getElementById('lightboxNext').addEventListener('click', () => goToImage(current + 1, 1));
  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) lightbox.hidden = true; });
  document.addEventListener('keydown', (e) => {
    if (lightbox.hidden) return;
    if (e.key === 'Escape') lightbox.hidden = true;
    if (e.key === 'ArrowRight') goToImage(current + 1, 1);
    if (e.key === 'ArrowLeft') goToImage(current - 1, -1);
  });

  // 확대 이미지를 드래그(스와이프)해서 다음/이전 사진으로 부드럽게 전환
  let dragStartX = 0;
  let dragDeltaX = 0;
  let isDragging = false;

  function onDragStart(e) {
    isDragging = true;
    dragStartX = e.clientX;
    lightboxImg.style.transition = 'none';
  }
  function onDragMove(e) {
    if (!isDragging) return;
    dragDeltaX = e.clientX - dragStartX;
    lightboxImg.style.transform = `translateX(${dragDeltaX}px)`;
  }
  function onDragEnd() {
    if (!isDragging) return;
    isDragging = false;
    if (Math.abs(dragDeltaX) > SWIPE_THRESHOLD) {
      goToImage(current + (dragDeltaX < 0 ? 1 : -1), dragDeltaX < 0 ? 1 : -1);
    } else {
      lightboxImg.style.transition = 'transform 0.2s ease';
      lightboxImg.style.transform = 'translateX(0)';
    }
    dragDeltaX = 0;
  }
  lightboxImg.addEventListener('pointerdown', onDragStart);
  lightboxImg.addEventListener('pointermove', onDragMove);
  lightboxImg.addEventListener('pointerup', onDragEnd);
  lightboxImg.addEventListener('pointerleave', onDragEnd);
})();

// ============ 6. 오시는 길 ============
(function renderMap() {
  const m = CONFIG.map;
  document.getElementById('venueAddress').textContent = m.address;

  if (CONFIG.naver && CONFIG.naver.clientId) {
    const mapEl = document.getElementById('mapEmbed');
    mapEl.hidden = false;
    const script = document.createElement('script');
    script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${CONFIG.naver.clientId}`;
    script.onload = () => {
      const position = new naver.maps.LatLng(m.lat, m.lng);
      const map = new naver.maps.Map(mapEl, { center: position, zoom: 16 });
      new naver.maps.Marker({ position, map });
    };
    document.head.appendChild(script);
  }

  const q = encodeURIComponent(m.name);
  document.getElementById('kakaoMapBtn').href = `kakaomap://route?ep=${m.lat},${m.lng}&by=car`;
  document.getElementById('naverMapBtn').href = `nmap://navigation?dlat=36.8478727&dlng=127.1590854&dname=${encodeURIComponent('비렌티 웨딩홀 & 뷔페')}&appname=wedding-invitation-kappa-three-94.vercel.app`;
  document.getElementById('tmapBtn').href = `tmap://route?goalname=${q}&goalx=${m.lng}&goaly=${m.lat}`;

  const t = m.transport;
  const CIRCLED_NUMS = ['①', '②', '③', '④', '⑤', '⑥', '⑦', '⑧', '⑨', '⑩'];
  function transportGroup(label, data) {
    if (!data || !data.steps || !data.steps.length) return '';
    const stepItems = data.steps.map((step, i) => {
      const num = CIRCLED_NUMS[i] || `${i + 1}.`;
      const isObj = typeof step === 'object';
      const text = isObj ? step.text : step;
      const sub = isObj && step.sub ? `<div class="transport-sub">${escapeHtml(step.sub)}</div>` : '';
      return `<li class="transport-step"><span class="transport-num">${num}</span>${escapeHtml(text)}${sub}</li>`;
    }).join('');
    const noteItems = (data.notes || []).map((n) => `<li class="transport-note">${escapeHtml(n)}</li>`).join('');
    return `<div class="transport-group"><b>${label}</b><ul class="transport-steplist">${stepItems}</ul>${noteItems ? `<ul class="transport-sublist">${noteItems}</ul>` : ''}</div>`;
  }
  const rows = [
    transportGroup('셔틀버스', t.shuttle),
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
      <p class="info-block__title">${escapeHtml(item.title)}</p>
      <p class="info-block__content">${nl2br(item.content)}</p>
    </div>`)
    .join('');
})();

// ============ 8. 계좌 아코디언 ============
(function renderAccounts() {
  function row(a) {
    return `<div class="account-row">
      <div><span class="account-row__who">${escapeHtml(a.name)}</span><span class="account-row__num">${escapeHtml(a.bank)} ${escapeHtml(a.number)}</span></div>
      <button type="button" class="btn-ghost-sm" data-copy-text="${escapeHtml(a.bank)} ${escapeHtml(a.number)}">복사</button>
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
  }, { threshold: 0.15 });
  targets.forEach((t) => observer.observe(t));
})();

// ============ 푸터 ============
document.getElementById('footerNames').textContent =
  `${CONFIG.intro.groomName} & ${CONFIG.intro.brideName}의 결혼식에 함께해 주셔서 감사합니다.`;

// ============ 문서 타이틀/공유 메타 ============
document.title = CONFIG.share.title;
