/* ============================================
   By Chevelle — Site Bootstrap
   Loads config.json and renders content into
   data-bind elements. Also handles sticky header
   and reveal animations.
   ============================================ */

// ==== UTIL: tiny templating ====
function setText(selector, value) {
  document.querySelectorAll(selector).forEach(el => {
    el.textContent = value || '';
  });
}
function setHTML(selector, value) {
  document.querySelectorAll(selector).forEach(el => {
    el.innerHTML = value || '';
  });
}
function setAttr(selector, attr, value) {
  document.querySelectorAll(selector).forEach(el => {
    if (value) el.setAttribute(attr, value);
  });
}

// ==== LOAD CONFIG ====
async function loadConfig() {
  try {
    const res = await fetch('config.json', { cache: 'no-store' });
    if (!res.ok) throw new Error('fetch failed');
    return await res.json();
  } catch (e) {
    if (window.SITE_CONFIG_FALLBACK) return window.SITE_CONFIG_FALLBACK;
    console.warn('Could not load config.json:', e);
    return null;
  }
}

// ==== RENDERERS ====
function renderPromo(promo) {
  if (!promo) return;
  const banner = document.getElementById('promo-banner');
  if (!banner) return;
  if (!promo.enabled) {
    banner.style.display = 'none';
    return;
  }
  setText('[data-bind="promo.text_before"]', promo.text_before);
  setText('[data-bind="promo.text_emphasis"]', promo.text_emphasis);
  setText('[data-bind="promo.text_after"]', promo.text_after);
}

function renderHero(hero) {
  if (!hero) return;
  setText('[data-bind="hero.eyebrow"]', hero.eyebrow);
  setText('[data-bind="hero.headline_start"]', hero.headline_start);
  setText('[data-bind="hero.headline_emphasis"]', hero.headline_emphasis);
  setText('[data-bind="hero.lead"]', hero.lead);
  setText('[data-bind="hero.cta_primary"]', hero.cta_primary);
  setText('[data-bind="hero.cta_secondary"]', hero.cta_secondary);
}

function renderAudiences(aud) {
  if (!aud) return;
  setText('[data-bind="audiences.section_label"]', aud.section_label);
  setText('[data-bind="audiences.headline_start"]', aud.headline_start);
  setText('[data-bind="audiences.headline_emphasis"]', aud.headline_emphasis);
  setText('[data-bind="audiences.lead"]', aud.lead);
  const grid = document.querySelector('[data-bind-list="audiences.cards"]');
  if (grid && aud.cards) {
    grid.innerHTML = aud.cards.map(c => `
      <div class="who-card reveal">
        <div class="who-card-num">${c.number}</div>
        <h3>${c.title}</h3>
        <p>${c.description}</p>
      </div>
    `).join('');
  }
}

function renderIncluded(inc) {
  if (!inc) return;
  setText('[data-bind="included.section_label"]', inc.section_label);
  setText('[data-bind="included.headline_start"]', inc.headline_start);
  setText('[data-bind="included.headline_emphasis"]', inc.headline_emphasis);
  const items = document.querySelectorAll('[data-bind-list="included.items"] .what-item');
  if (inc.items && items.length) {
    items.forEach((el, i) => {
      const data = inc.items[i];
      if (!data) return;
      const h4 = el.querySelector('h4');
      const p = el.querySelector('p');
      if (h4) h4.textContent = data.title;
      if (p) p.textContent = data.description;
    });
  }
}

function renderWork(work) {
  if (!work) return;
  setText('[data-bind="work.section_label"]', work.section_label);
  setText('[data-bind="work.headline_start"]', work.headline_start);
  setText('[data-bind="work.headline_emphasis"]', work.headline_emphasis);
  setText('[data-bind="work.lead"]', work.lead);

  const wrap = document.querySelector('[data-bind-list="work.projects"]');
  if (!wrap || !work.projects) return;

  const isHubLayout = wrap.classList.contains('work-hub-grid');

  wrap.innerHTML = work.projects.map((p) => {
    const desktopBlock = p.desktop_image
      ? `<img src="${p.desktop_image}" alt="${p.title}">`
      : `<div class="device-placeholder"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="4" width="18" height="14" rx="2"/><path d="M8 21h8M12 18v3"/></svg><span>${p.tag === 'Coming soon' ? 'Coming soon' : 'Desktop screenshot'}</span></div>`;
    const mobileBlock = p.mobile_image
      ? `<img src="${p.mobile_image}" alt="${p.title} mobile">`
      : `<div class="device-placeholder"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="6" y="3" width="12" height="18" rx="2"/></svg><span>Mobile</span></div>`;

    if (isHubLayout) {
      return `
        <div class="work-hub-item reveal">
          <div class="device-desktop">
            <div class="device-desktop-bar">
              <div class="dot"></div><div class="dot"></div><div class="dot"></div>
              <div class="url">${p.url_display}</div>
            </div>
            <div class="device-desktop-screen">${desktopBlock}</div>
          </div>
          <span class="work-hub-info-tag">${p.tag}</span>
          <h3>${p.title}</h3>
          <p>${p.description}</p>
        </div>
      `;
    }
    return `
      <div class="work-project reveal">
        <div class="work-project-visual">
          <div class="device-desktop">
            <div class="device-desktop-bar">
              <div class="dot"></div><div class="dot"></div><div class="dot"></div>
              <div class="url">${p.url_display}</div>
            </div>
            <div class="device-desktop-screen">${desktopBlock}</div>
          </div>
          <div class="device-mobile">
            <div class="device-mobile-screen">${mobileBlock}</div>
          </div>
        </div>
        <div class="work-project-info">
          <span class="work-project-tag">${p.tag}</span>
          <h3>${p.title}</h3>
          <p>${p.description}</p>
        </div>
      </div>
    `;
  }).join('');
}

function renderAbout(about) {
  if (!about) return;
  setText('[data-bind="about.section_label"]', about.section_label);
  setText('[data-bind="about.headline_start"]', about.headline_start);
  setText('[data-bind="about.headline_emphasis"]', about.headline_emphasis);
  setText('[data-bind="about.script_flourish"]', about.script_flourish);
  setText('[data-bind="about.closing_line"]', about.closing_line);
  if (about.photo_image) {
    document.querySelectorAll('[data-bind="about.photo_image"]').forEach(el => {
      el.innerHTML = `<img src="${about.photo_image}" alt="Chevelle" class="about-photo">`;
    });
  }
  const wrap = document.querySelector('[data-bind-list="about.paragraphs"]');
  if (wrap && about.paragraphs) {
    wrap.innerHTML = about.paragraphs.map(p => `<p>${p}</p>`).join('');
  }
}

function renderProcess(proc) {
  if (!proc) return;
  setText('[data-bind="process.section_label"]', proc.section_label);
  setText('[data-bind="process.headline_start"]', proc.headline_start);
  setText('[data-bind="process.headline_emphasis"]', proc.headline_emphasis);
  setText('[data-bind="process.lead"]', proc.lead);
  const wrap = document.querySelector('[data-bind-list="process.stops"]');
  if (wrap && proc.stops) {
    wrap.innerHTML = proc.stops.map(s => `
      <div class="process-stop reveal">
        <div class="process-stop-marker">${s.number}</div>
        <h4>${s.title}</h4>
        <p>${s.description}</p>
      </div>
    `).join('');
  }
}

function renderPricing(pricing) {
  if (!pricing) return;
  setText('[data-bind="pricing.section_label"]', pricing.section_label);
  setText('[data-bind="pricing.headline_start"]', pricing.headline_start);
  setText('[data-bind="pricing.headline_emphasis"]', pricing.headline_emphasis);
  setText('[data-bind="pricing.lead"]', pricing.lead);

  const grid = document.querySelector('[data-bind-list="pricing.packages"]');
  if (grid && pricing.packages) {
    grid.innerHTML = pricing.packages.map(p => {
      const isFeatured = p.id === pricing.featured_package;
      const cardClass = isFeatured ? 'pricing-card featured reveal' : 'pricing-card reveal';
      const btnClass = isFeatured ? 'btn btn-primary' : 'btn btn-secondary';
      const badge = isFeatured ? '<span class="pricing-badge">Most popular</span>' : '';
      const bullets = p.bullets.map(b => `<li>${b}</li>`).join('');
      return `
        <div class="${cardClass}">
          ${badge}
          <h3 class="pricing-card-name">${p.name}</h3>
          <div class="pricing-card-sub">${p.subtitle}</div>
          <div class="pricing-card-price">${p.price_intro} <span class="pricing-card-price-old">${p.price_full}</span></div>
          <div class="pricing-card-savings">${pricing.savings_label}</div>
          <p class="pricing-card-for">${p.for_whom}</p>
          <ul>${bullets}</ul>
          <a href="#inquiry" class="${btnClass}">${p.cta_label}</a>
        </div>
      `;
    }).join('');
  }

  if (pricing.addons) {
    const a = pricing.addons;
    setText('[data-bind="pricing.addons.section_label"]', a.section_label);
    setText('[data-bind="pricing.addons.headline_start"]', a.headline_start);
    setText('[data-bind="pricing.addons.headline_emphasis"]', a.headline_emphasis);
    setText('[data-bind="pricing.addons.lead"]', a.lead);
    const wrap = document.querySelector('[data-bind-list="pricing.addons.items"]');
    if (wrap && a.items) {
      wrap.innerHTML = a.items.map(i => `
        <div class="addon-card">
          <div class="addon-price">${i.price}</div>
          <div class="addon-label">${i.label}</div>
          <h4>${i.title}</h4>
          <p>${i.description}</p>
        </div>
      `).join('');
    }
  }
}

function renderInquiry(inq) {
  if (!inq) return;
  setText('[data-bind="inquiry.section_label"]', inq.section_label);
  setText('[data-bind="inquiry.headline_start"]', inq.headline_start);
  setText('[data-bind="inquiry.headline_emphasis"]', inq.headline_emphasis);
  setText('[data-bind="inquiry.lead"]', inq.lead);
  setText('[data-bind="inquiry.submit_label"]', inq.submit_label);
  const form = document.getElementById('inquiry-form');
  if (form && inq.formspree_endpoint) {
    form.setAttribute('action', inq.formspree_endpoint);
    form.setAttribute('method', 'POST');
    form.removeAttribute('onsubmit');
  }
}

function renderSite(site) {
  if (!site) return;
  setText('[data-bind="site.footer_about"]', site.footer_about);
  setText('[data-bind="site.footer_credit"]', site.footer_credit);
  setText('[data-bind="site.copyright_year"]', site.copyright_year);
  setAttr('[data-bind-attr="site.email"]', 'href', `mailto:${site.email}`);
  setText('[data-bind="site.email"]', site.email);
  setAttr('[data-bind-attr="site.instagram_url"]', 'href', site.instagram_url);
  // Logo images
  if (site.logo_primary) {
    setAttr('[data-bind-attr="site.logo_primary"]', 'src', site.logo_primary);
  }
  if (site.logo_footer) {
    setAttr('[data-bind-attr="site.logo_footer"]', 'src', site.logo_footer);
  }
  if (site.favicon) {
    setAttr('[data-bind-attr="site.favicon"]', 'href', site.favicon);
  }
  if (site.gate_icon) {
    setAttr('[data-bind-attr="site.gate_icon"]', 'src', site.gate_icon);
  }
}

function exposeClientPasswords(clients) {
  if (!clients) return;
  window.VALID_CLIENT_PASSWORDS = clients
    .filter(c => c.active)
    .map(c => (c.password || '').toLowerCase());
}

async function bootstrap() {
  const config = await loadConfig();
  if (!config) return;

  // Expose globally so per-page scripts can use it
  window.SITE_CONFIG = config;

  renderSite(config.site);
  renderPromo(config.promo);
  renderHero(config.hero);
  renderAudiences(config.audiences);
  renderIncluded(config.included);
  renderWork(config.work);
  renderAbout(config.about);
  renderProcess(config.process);
  renderPricing(config.pricing);
  renderInquiry(config.inquiry);
  exposeClientPasswords(config.clients);

  initReveal();
  document.dispatchEvent(new Event('config:ready'));
}

function initReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

function initStickyHeader() {
  const header = document.getElementById('site-header');
  if (!header) return;
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, { passive: true });
}

function initPromoClose() {
  document.addEventListener('click', (e) => {
    if (e.target && e.target.classList.contains('promo-close')) {
      const banner = document.getElementById('promo-banner');
      if (banner) banner.style.display = 'none';
    }
  });
}

function initNavDropdown() {
  // Forgiving hover: opens immediately on enter, but waits 400ms before closing
  // so cursor can travel from trigger to dropdown items.
  document.querySelectorAll('.nav-client').forEach(nav => {
    let closeTimer = null;
    const open = () => {
      clearTimeout(closeTimer);
      nav.classList.add('open');
    };
    const scheduleClose = () => {
      clearTimeout(closeTimer);
      closeTimer = setTimeout(() => nav.classList.remove('open'), 400);
    };
    nav.addEventListener('mouseenter', open);
    nav.addEventListener('mouseleave', scheduleClose);
    nav.addEventListener('focusin', open);
    nav.addEventListener('focusout', (e) => {
      if (!nav.contains(e.relatedTarget)) scheduleClose();
    });
  });
}

/* ============================================
   ROBUST ANCHOR SCROLL — accounts for current header height
   ============================================ */
function initAnchorScroll() {
  const header = document.getElementById('site-header');
  // Promo banner is sometimes visible — count it too
  function getOffset() {
    let offset = 0;
    if (header) offset += header.offsetHeight;
    const promo = document.getElementById('promo-banner');
    if (promo && promo.style.display !== 'none' && promo.offsetHeight) {
      offset += promo.offsetHeight;
    }
    return offset + 12; // small breathing room
  }

  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href*="#"]');
    if (!link) return;
    const href = link.getAttribute('href');
    if (!href) return;

    // If link is to a different page (e.g. index.html#about) and we're not on that page, let it navigate normally
    const url = new URL(link.href, window.location.href);
    const samePage = (url.pathname === window.location.pathname || (url.pathname === '/' && window.location.pathname.endsWith('index.html')));
    if (!samePage) return;

    const hash = url.hash;
    if (!hash || hash === '#') return;

    const target = document.querySelector(hash);
    if (!target) return;

    e.preventDefault();
    const top = target.getBoundingClientRect().top + window.scrollY - getOffset();
    window.scrollTo({ top, behavior: 'smooth' });

    // Update URL hash without triggering scroll
    history.pushState(null, '', hash);

    // Close mobile menu if open
    const mobileNav = document.getElementById('mobile-nav');
    if (mobileNav && mobileNav.classList.contains('open')) {
      mobileNav.classList.remove('open');
      document.getElementById('hamburger')?.classList.remove('open');
    }
  });

  // On load, if URL has hash, scroll to it with proper offset
  if (window.location.hash) {
    setTimeout(() => {
      const target = document.querySelector(window.location.hash);
      if (target) {
        const top = target.getBoundingClientRect().top + window.scrollY - getOffset();
        window.scrollTo({ top, behavior: 'instant' in window.scrollTo ? 'instant' : 'auto' });
      }
    }, 200);
  }
}

/* ============================================
   ACTIVE NAV STATE — highlights nav item for current page or scrolled-to section
   ============================================ */
function initActiveNav() {
  const path = window.location.pathname;
  const filename = path.split('/').pop() || 'index.html';
  // Mark page-based nav links as active
  document.querySelectorAll('.header-nav a, .mobile-nav a').forEach(a => {
    const href = a.getAttribute('href') || '';
    // Match exact filename links (process.html, terms.html, clients.html, etc.)
    if (href === filename || (filename === '' && href === 'index.html')) {
      a.classList.add('active');
    }
    // Special: clients.html, consult-prep.html, consultation.html, feedback.html all "belong" to Clients Only nav
    if (['clients.html', 'consult-prep.html', 'consultation.html', 'feedback.html'].includes(filename)) {
      if (href === 'clients.html') {
        // The trigger of the dropdown
        a.classList.add('active');
      }
    }
  });

  // For anchor links on the homepage — observe sections and highlight matching nav item
  if (filename === 'index.html' || filename === '') {
    const sections = ['who', 'work', 'about', 'process', 'pricing', 'inquiry'];
    const navLinks = document.querySelectorAll('.header-nav a[href^="#"], .mobile-nav a[href^="#"]');
    if (!sections.length || !navLinks.length) return;

    function setActive(id) {
      navLinks.forEach(a => {
        const href = a.getAttribute('href') || '';
        if (href === '#' + id) a.classList.add('active');
        else a.classList.remove('active');
      });
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActive(entry.target.id);
        }
      });
    }, {
      rootMargin: '-30% 0px -60% 0px',
      threshold: 0
    });

    sections.forEach(id => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
  }
}

/* ============================================
   MOBILE HAMBURGER
   ============================================ */
function initMobileHamburger() {
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobile-nav');
  if (!hamburger || !mobileNav) return;

  hamburger.addEventListener('click', () => {
    mobileNav.classList.toggle('open');
    hamburger.classList.toggle('open');
    document.body.classList.toggle('mobile-nav-open');
  });

  // Close on link click (let the click event handle nav, just close menu)
  mobileNav.addEventListener('click', (e) => {
    if (e.target.closest('a')) {
      mobileNav.classList.remove('open');
      hamburger.classList.remove('open');
      document.body.classList.remove('mobile-nav-open');
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initStickyHeader();
  initPromoClose();
  initNavDropdown();
  initAnchorScroll();
  initActiveNav();
  initMobileHamburger();
  initReveal();
  bootstrap();
});
