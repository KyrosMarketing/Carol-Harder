import '@fontsource/rubik/latin-400.css';
import '@fontsource/rubik/latin-500.css';
import './links.css';

// Sem GA4, GTM ou consentimento configurados no projeto. Este evento local
// permite integração futura sem instalar tags, gravar dados ou fazer requisições.
// O adaptador de analytics deve ouvir este evento e respeitar o consentimento.
document.querySelector('.bio-links').addEventListener('click', event => {
  const link = event.target.closest('a[data-bio-event]');
  if (!link) return;
  window.dispatchEvent(new CustomEvent('carol:bio-click', {
    detail: {
      event_name: link.dataset.bioEvent,
      page_path: '/links',
      source: 'instagram_bio',
      link_url: link.href,
      link_text: link.textContent.trim(),
    },
  }));
});
