import '@fontsource/rubik/latin-300.css';
import '@fontsource/rubik/latin-400.css';
import '@fontsource/rubik/latin-500.css';
import './style.css';
import { site } from './site.config.js';

const header = document.querySelector('.header');
const menu = document.querySelector('.menu-toggle');
const nav = document.querySelector('#navigation');

function closeMenu({ restoreFocus = false } = {}) {
  menu.setAttribute('aria-expanded', 'false');
  nav.classList.remove('is-open');
  if (restoreFocus) menu.focus();
}
menu.addEventListener('click', () => {
  const expanded = menu.getAttribute('aria-expanded') !== 'true';
  menu.setAttribute('aria-expanded', String(expanded));
  nav.classList.toggle('is-open', expanded);
});
nav.addEventListener('click', event => {
  const link = event.target.closest('a');
  if (!link) return;
  closeMenu();
  if (link.hash && link.origin === location.origin) {
    const target = document.querySelector(link.hash);
    if (target) {
      target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
    }
  }
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') closeMenu({ restoreFocus: true });
});
document.addEventListener('click', event => {
  if (!header.contains(event.target)) closeMenu();
});
matchMedia('(min-width: 900px)').addEventListener('change', () => closeMenu());

let scrollScheduled = false;
function updateHeader() {
  header.classList.toggle('is-scrolled', window.scrollY > 48);
  scrollScheduled = false;
}
window.addEventListener('scroll', () => {
  if (!scrollScheduled) {
    scrollScheduled = true;
    requestAnimationFrame(updateHeader);
  }
}, { passive: true });
updateHeader();

const privacy = document.querySelector('#privacy-dialog');
const privacyLink = document.querySelector('[data-open-privacy]');
if (typeof privacy.showModal === 'function') {
  privacyLink.addEventListener('click', event => {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    privacy.showModal();
  });
  privacy.querySelector('[data-close-dialog]').addEventListener('click', () => privacy.close());
  privacy.addEventListener('click', event => {
    if (event.target !== privacy) return;
    const rect = privacy.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) privacy.close();
  });
}

if (/^https:\/\/(www\.)?instagram\.com\//.test(site.instagram)) {
  const link = document.querySelector('#instagram-link');
  Object.assign(link, { href: site.instagram, target: '_blank', rel: 'noopener noreferrer', hidden: false });
}
document.querySelector('#year').textContent = new Date().getFullYear();

// Scroll entrances are progressive: no CSS pre-hiding, layout changes or dependencies.
// Leave the initial viewport untouched and reveal each later block only once.
if ('IntersectionObserver' in window && typeof Element.prototype.animate === 'function') {
  const motionPreference = matchMedia('(prefers-reduced-motion: reduce)');
  const revealSelectors = [
    '.about-heading', '.about-facts', '.about-copy', '.about-visual',
    '.women-inner > .eyebrow', '.women-inner > h2', '.women-bottom',
    '.approach-identity', '.approach-main', '.care-heading', '.steps > li',
    '.faq-heading', '.faq-list', '.contact-inner', '.footer-main',
  ];
  const pendingReveals = new Set([...document.querySelectorAll(revealSelectors.join(', '))]
    .filter(element => element.getBoundingClientRect().top >= window.innerHeight));
  const activeReveals = new Set();
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting || !pendingReveals.has(entry.target)) continue;
      pendingReveals.delete(entry.target);
      observer.unobserve(entry.target);
      if (motionPreference.matches || entry.target.contains(document.activeElement)) continue;
      const animation = entry.target.animate([
        { opacity: 0, transform: 'translateY(12px)' },
        { opacity: 1, transform: 'translateY(0)' },
      ], { duration: 600, easing: 'cubic-bezier(.22, 1, .36, 1)' });
      activeReveals.add(animation);
      animation.finished.catch(() => {}).finally(() => activeReveals.delete(animation));
    }
  }, { threshold: 0.12, rootMargin: '0px 0px -4% 0px' });

  function observePendingReveals() {
    for (const element of pendingReveals) {
      if (element.getBoundingClientRect().top < window.innerHeight) pendingReveals.delete(element);
      else observer.observe(element);
    }
  }
  if (!motionPreference.matches) observePendingReveals();
  motionPreference.addEventListener('change', () => {
    if (motionPreference.matches) {
      observer.disconnect();
      for (const animation of activeReveals) animation.cancel();
      activeReveals.clear();
    } else observePendingReveals();
  });
  // A keyboard user never has to wait for an entrance to interact with a link.
  document.addEventListener('focusin', event => {
    for (const animation of activeReveals) {
      if (animation.effect.target.contains(event.target)) {
        animation.cancel();
        activeReveals.delete(animation);
      }
    }
  });
}
