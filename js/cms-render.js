
(function () {
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  async function getJSON(path) {
    try {
      const res = await fetch(path, { cache: "no-cache" });
      if (!res.ok) throw new Error(path + " " + res.status);
      return await res.json();
    } catch (err) {
      console.warn("CMS content load failed:", path, err);
      return null;
    }
  }

  function setText(selector, value) {
    if (!value) return;
    $$(selector).forEach(el => el.textContent = value);
  }

  function setHref(selector, value) {
    if (!value) return;
    $$(selector).forEach(el => el.href = value);
  }

  function setSrc(selector, value) {
    if (!value) return;
    $$(selector).forEach(el => el.src = value);
  }

  function getSafeAiUrl(value) {
    // 舊 GPT 目前公開端會 404，因此先導到站內 AI 說明頁。
    // 未來後台換成新的可公開 GPT 連結後，會自動改用新連結。
    const blocked = "g-683d6cacf5648191ade78d93c3aec7ac";
    if (!value || String(value).includes(blocked)) return "ai.html";
    return value;
  }

  function escapeHTML(str) {
    return String(str || "").replace(/[&<>"']/g, s => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
    }[s]));
  }

  function renderServices(data) {
    const pricing = $("#cmsPricing");
    const cards = $("#cmsServices");
    if (!data || !Array.isArray(data.services)) return;

    if (pricing) {
      pricing.innerHTML = data.services.map(s => `
        <article class="price-card">
          <div class="price-tag">${escapeHTML(s.category)}</div>
          <h3>${escapeHTML(s.title)}</h3>
          <div class="price-range">${escapeHTML(s.price)}</div>
          <p class="price-note">${escapeHTML(s.note)}</p>
          <p>${escapeHTML(s.description)}</p>
          <div class="actions"><a class="btn btn-primary" href="booking.html">預約${escapeHTML(s.title)}</a></div>
        </article>
      `).join("");
    }

    if (cards) {
      cards.innerHTML = data.services.map(s => `
        <article class="card">
          <div class="icon">${escapeHTML(s.title.slice(0, 1))}</div>
          <h3>${escapeHTML(s.title)}</h3>
          <p>${escapeHTML(s.description)}</p>
          <div class="price-tag">${escapeHTML(s.price)}</div>
        </article>
      `).join("");
    }
  }

  function renderCases(data) {
    const target = $("#cmsCases");
    if (!target || !data || !Array.isArray(data.cases)) return;
    target.innerHTML = data.cases.map(c => `
      <article class="case-card">
        <div class="case-tag">${escapeHTML(c.category)}</div>
        ${c.image ? `<img src="${escapeHTML(c.image)}" alt="${escapeHTML(c.title)}" style="height:240px;width:100%;object-fit:cover;border-radius:22px;margin-bottom:18px;">` : ""}
        <h3>${escapeHTML(c.title)}</h3>
        <p>${escapeHTML(c.summary)}</p>
        <p>${escapeHTML(c.body)}</p>
      </article>
    `).join("");
  }

  function renderCourses(data) {
    const target = $("#cmsCourses");
    if (!target || !data || !Array.isArray(data.courses)) return;
    target.innerHTML = data.courses.map(c => `
      <article class="card">
        ${c.image ? `<img src="${escapeHTML(c.image)}" alt="${escapeHTML(c.title)}" style="height:220px;width:100%;object-fit:cover;border-radius:22px;margin-bottom:18px;">` : ""}
        <div class="icon">課</div>
        <h3>${escapeHTML(c.title)}</h3>
        <p><strong>適合對象：</strong>${escapeHTML(c.audience)}</p>
        <p>${escapeHTML(c.description)}</p>
      </article>
    `).join("");
  }

  function renderPhotos(data) {
    const target = $("#cmsPhotos");
    if (!target || !data || !Array.isArray(data.photos)) return;
    target.innerHTML = data.photos.map(p => `
      <article class="photo-card">
        <img src="${escapeHTML(p.image)}" alt="${escapeHTML(p.title)}">
        <div class="photo-caption">
          <strong>${escapeHTML(p.title)}</strong>
          <span>${escapeHTML(p.caption)}</span>
        </div>
      </article>
    `).join("");
  }

  function setupCarousel() {
    const track = document.querySelector('.photo-track');
    const cards = track ? Array.from(track.querySelectorAll('.photo-card')) : [];
    const indexEl = document.getElementById('carouselIndex');
    const totalEl = document.getElementById('carouselTotal');
    const prev = document.querySelector('[data-carousel-prev]');
    const next = document.querySelector('[data-carousel-next]');
    let current = 0;
    let timer = null;
    const delay = 2800;

    if (!track || !cards.length) return;
    if (totalEl) totalEl.textContent = cards.length;

    function goTo(i) {
      current = (i + cards.length) % cards.length;
      const left = cards[current].offsetLeft - track.offsetLeft;
      track.scrollTo({ left, behavior: 'smooth' });
      if (indexEl) indexEl.textContent = current + 1;
    }

    function start() {
      stop();
      timer = setInterval(() => goTo(current + 1), delay);
    }

    function stop() {
      if (timer) clearInterval(timer);
    }

    if (prev) prev.addEventListener('click', () => { goTo(current - 1); start(); });
    if (next) next.addEventListener('click', () => { goTo(current + 1); start(); });
    track.addEventListener('mouseenter', stop);
    track.addEventListener('mouseleave', start);
    track.addEventListener('touchstart', stop, { passive: true });
    track.addEventListener('touchend', start, { passive: true });
    goTo(0);
    start();
  }

  function setupBookingForm(site) {
    const form = document.getElementById('bookingForm');
    const preview = document.getElementById('bookingPreview');
    const copyBtn = document.getElementById('copyBookingBtn');
    if (!form || !preview) return;

    if (site && site.formspreeEndpoint) {
      form.action = site.formspreeEndpoint;
    }

    function val(name) {
      const el = form.elements[name];
      return el && el.value ? String(el.value).trim() : '未填寫';
    }

    function buildText() {
      return [
        '【巽風堪輿研究中心｜預約表單】',
        '服務類型：' + val('service'),
        '姓名 / 單位：' + val('name'),
        '手機 / LINE：' + val('phone'),
        'Email：' + val('email'),
        '地點 / 區域：' + val('location'),
        '坪數 / 規模：' + val('size'),
        '預算級距：' + val('budget'),
        '需求急迫性：' + val('urgency'),
        '希望安排時間：' + val('schedule'),
        '需求說明：' + val('message')
      ].join('\n');
    }

    function renderPreview() {
      preview.textContent = buildText();
    }

    form.addEventListener('input', renderPreview);
    form.addEventListener('change', renderPreview);
    renderPreview();

    if (copyBtn) {
      copyBtn.addEventListener('click', async function () {
        try {
          await navigator.clipboard.writeText(buildText());
          copyBtn.textContent = '已複製，可貼到 LINE';
          setTimeout(() => copyBtn.textContent = '複製內容給 LINE', 2000);
        } catch (err) {
          copyBtn.textContent = '複製失敗，請手動複製';
          setTimeout(() => copyBtn.textContent = '複製內容給 LINE', 2000);
        }
      });
    }
  }

  document.addEventListener("DOMContentLoaded", async () => {
    const [site, services, cases, courses, photos] = await Promise.all([
      getJSON("content/site.json"),
      getJSON("content/services.json"),
      getJSON("content/cases.json"),
      getJSON("content/courses.json"),
      getJSON("content/photos.json")
    ]);

    if (site) {
      if (site.seoTitle) document.title = site.seoTitle;
      setText("[data-site='brand']", site.brand);
      setText("[data-site='shortBrand']", site.shortBrand);
      setText("[data-site='subBrand']", site.subBrand);
      setText("[data-site='heroTitle']", site.heroTitle);
      setText("[data-site='heroAccent']", site.heroAccent);
      setText("[data-site='heroLead']", site.heroLead);
      setText("[data-site='email']", site.email);
      setHref("[data-link='line']", site.lineUrl);
      setHref("[data-link='facebook']", site.facebookUrl);
      setHref("[data-link='ai']", getSafeAiUrl(site.aiUrl));
      setHref("[data-link='email']", site.email ? "mailto:" + site.email : "");
      setSrc("[data-image='brandAnchor']", site.brandAnchorImage);
      setSrc("[data-image='fengyi']", site.fengyiImage);
    }

    renderServices(services);
    renderCases(cases);
    renderCourses(courses);
    renderPhotos(photos);
    setupBookingForm(site);

    // 重新啟動照片輪播，等動態內容載入後再跑
    setTimeout(setupCarousel, 100);
  });
})();
