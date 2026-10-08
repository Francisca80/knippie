'use strict';
(() => {
  const config = window.KNIPPIE_CONFIG || {};
  const menu = document.querySelector('.menu-toggle');
  const nav = document.querySelector('#navigation');
  const closeMenu = () => { menu.setAttribute('aria-expanded', 'false'); nav.classList.remove('is-open'); };
  menu.addEventListener('click', () => { const open = menu.getAttribute('aria-expanded') !== 'true'; menu.setAttribute('aria-expanded', String(open)); nav.classList.toggle('is-open', open); });
  nav.addEventListener('click', event => { if (event.target.closest('a')) closeMenu(); });
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') { closeMenu(); menu.focus(); } });
  document.querySelector('#year').textContent = new Date().getFullYear();
  const schemaNode = document.querySelector('#business-schema');
  const schema = JSON.parse(schemaNode.textContent);
  const links = document.querySelector('#contact-links');
  const addContact = (text, href) => { const link = document.createElement('a'); link.className = 'button'; link.textContent = text; link.href = href; links.append(link); };
  if (/^\+?[\d\s()-]{6,20}$/.test(config.phone || '')) { const phoneLink = links.querySelector('[data-contact="phone"]'); const phoneHref = `tel:${config.phone.replace(/[\s()-]/g, '')}`; if (phoneLink) phoneLink.href = phoneHref; else addContact('Bel Bianca', phoneHref); schema.telephone = config.phone; }
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(config.email || '')) { addContact('Mail Bianca', `mailto:${config.email}`); schema.email = config.email; document.querySelector('#privacy-contact').append(` E-mail: ${config.email}.`); }
  if (config.mapsUrl) { try { const url = new URL(config.mapsUrl); if (url.protocol === 'https:') addContact('Bekijk de locatie', url.href); } catch { /* Geen ongeldige links publiceren. */ } }
  if (schema.telephone || schema.email) document.querySelector('#contact-pending').hidden = true;
  if (config.streetAddress) { schema.address.streetAddress = config.streetAddress; schema.address.postalCode = config.postalCode || ''; document.querySelector('#address').textContent = `${config.streetAddress}, ${config.postalCode || ''} Opijnen`; }
  schemaNode.textContent = JSON.stringify(schema);
  const privacy = document.querySelector('#privacy-dialog');
  document.querySelector('#privacy-open').addEventListener('click', () => privacy.showModal());
  document.querySelector('.dialog-close').addEventListener('click', () => privacy.close());
  privacy.addEventListener('click', event => { if (event.target === privacy) { const r = privacy.getBoundingClientRect(); if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) privacy.close(); } });

  // Basic consent: geen verzoeken aan Google tot actieve toestemming.
  const id = config.analyticsId;
  if (!/^G-[A-Z0-9]+$/.test(id || '')) return;
  const key = 'knippie-consent-v1';
  const lifetime = 180 * 24 * 60 * 60 * 1000;
  const banner = document.querySelector('#cookie-banner');
  const settings = document.querySelector('#cookie-settings');
  settings.hidden = false;
  let choice = null;
  let loaded = false;
  try { const stored = JSON.parse(localStorage.getItem(key)); if (stored && ['granted', 'denied'].includes(stored.value) && stored.expires > Date.now()) choice = stored.value; } catch { /* Werkt ook zonder opslag. */ }
  const startAnalytics = () => {
    window[`ga-disable-${id}`] = false;
    if (loaded) return;
    loaded = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('consent', 'default', { analytics_storage: 'denied', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' });
    window.gtag('consent', 'update', { analytics_storage: 'granted' });
    window.gtag('js', new Date());
    // Geen querystrings of hashes met mogelijke persoonsgegevens meesturen.
    window.gtag('config', id, { page_location: location.origin + location.pathname, page_referrer: document.referrer.split('?')[0].split('#')[0], allow_google_signals: false, allow_ad_personalization_signals: false });
    const tag = document.createElement('script'); tag.async = true; tag.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`; document.head.append(tag);
  };
  const clearAnalyticsCookies = () => {
    const host = location.hostname.split('.');
    for (const cookie of document.cookie.split(';')) {
      const name = cookie.split('=')[0].trim();
      if (!/^_ga(?:_|$)|^_gid$|^_gat/.test(name)) continue;
      document.cookie = `${name}=; Max-Age=0; Path=/`;
      for (let i = 0; i < host.length - 1; i++) document.cookie = `${name}=; Max-Age=0; Path=/; Domain=${host.slice(i).join('.')}`;
    }
  };
  const save = value => {
    try { localStorage.setItem(key, JSON.stringify({ value, expires: Date.now() + lifetime })); } catch { /* Deze keuze geldt dan alleen voor deze pagina. */ }
    choice = value; banner.hidden = true;
    if (value === 'granted') startAnalytics();
    else { window[`ga-disable-${id}`] = true; clearAnalyticsCookies(); if (loaded) location.reload(); }
    settings.focus();
  };
  document.querySelector('#cookie-accept').addEventListener('click', () => save('granted'));
  document.querySelector('#cookie-reject').addEventListener('click', () => save('denied'));
  settings.addEventListener('click', () => { banner.hidden = false; document.querySelector('#cookie-reject').focus(); });
  window.addEventListener('storage', event => { if (event.key === key) location.reload(); });
  if (choice === 'granted') startAnalytics(); else { clearAnalyticsCookies(); banner.hidden = choice === 'denied'; }
})();
