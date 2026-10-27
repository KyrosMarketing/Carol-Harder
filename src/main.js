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

// Prepare offscreen elements before they enter, leaving native scrolling untouched.
// Separate entrance/reset margins prevent repeated restarts near a viewport edge.
if ('IntersectionObserver' in window && typeof Element.prototype.animate === 'function') {
  const motionPreference = matchMedia('(prefers-reduced-motion: reduce)');
  const revealSelectors = [
    '.hero-heading > *', '.hero-visual', '.hero-copy > p',
    '.about-heading > *', '.about-identity', '.about-facts dl',
    '.about-copy > *', '.about-visual',
    '.women-inner > .eyebrow', '.women-inner > h2', '.women-aside', '.women-copy > *',
    '.approach-identity > *', '.approach-main > h2', '.approach-main > p',
    '.approach-relations > div', '.care-heading > *', '.steps > li',
    '.faq-heading > *', '.faq-list > details', '.contact-inner > *', '.footer-main > *',
  ];
  const elements = [...document.querySelectorAll(revealSelectors.join(', '))];
  const activeReveals = new Map();
  const pendingClass = 'scroll-reveal-pending';
  const hasFocus = element => element.contains(document.activeElement);

  function showImmediately(element) {
    element.classList.remove(pendingClass);
    activeReveals.get(element)?.cancel();
    activeReveals.delete(element);
  }

  const entranceObserver = new IntersectionObserver(entries => {
    for (const entry of entries) {
      const element = entry.target;
      if (!entry.isIntersecting || !element.classList.contains(pendingClass)) continue;
      element.classList.remove(pendingClass);
      if (motionPreference.matches || hasFocus(element)) continue;
      const animation = element.animate([
        { opacity: 0, transform: 'translate3d(0, 20px, 0)' },
        { opacity: 1, transform: 'translate3d(0, 0, 0)' },
      ], { duration: 650, easing: 'cubic-bezier(.2, .65, .3, 1)' });
      activeReveals.set(element, animation);
      animation.finished.catch(() => {}).finally(() => {
        if (activeReveals.get(element) === animation) activeReveals.delete(element);
      });
    }
  }, { threshold: 0, rootMargin: '48px 0px' });

  const resetObserver = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (entry.isIntersecting || motionPreference.matches || hasFocus(entry.target)) continue;
      showImmediately(entry.target);
      entry.target.classList.add(pendingClass);
    }
  }, { threshold: 0, rootMargin: '160px 0px' });

  function startEntrances() {
    for (const element of elements) {
      const rect = element.getBoundingClientRect();
      // Do not hide content that is already visible on load, navigation or restoration.
      if (rect.top > window.innerHeight + 48 || rect.bottom < -48) {
        if (!hasFocus(element)) element.classList.add(pendingClass);
      }
      entranceObserver.observe(element);
      resetObserver.observe(element);
    }
  }
  function stopEntrances() {
    entranceObserver.disconnect();
    resetObserver.disconnect();
    for (const element of elements) showImmediately(element);
  }
  if (!motionPreference.matches) startEntrances();
  motionPreference.addEventListener('change', () => {
    if (motionPreference.matches) stopEntrances();
    else startEntrances();
  });
  document.addEventListener('focusin', event => {
    for (const element of elements) if (element.contains(event.target)) showImmediately(element);
  });
  window.addEventListener('beforeprint', stopEntrances);
  window.addEventListener('afterprint', () => { if (!motionPreference.matches) startEntrances(); });
}
