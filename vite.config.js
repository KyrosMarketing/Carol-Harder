import { defineConfig } from 'vite';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { site, publicationIssues, whatsappUrl } from './src/site.config.js';
const ready = publicationIssues.length === 0;
const escape = s => s.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;');
export default defineConfig({
  build: { rollupOptions: { input: { main: resolve('index.html'), privacy: resolve('privacidade.html') } } },
  plugins: [{
    name: 'site-metadata',
    transformIndexHtml(html, context) {
      const isPrivacy = context.filename.endsWith('privacidade.html');
      let policy = readFileSync(resolve('src/privacy-content.html'), 'utf8');
      if (!isPrivacy) policy = policy.replaceAll('<h2>', '<h3>').replaceAll('</h2>', '</h3>');
      html = html.replace('<!-- privacy-policy -->', policy);
      if (whatsappUrl) html = html.replace(/<a\b([^>]*\bdata-contact\b[^>]*)>/g, (_, attrs) => {
        attrs = attrs.replace(/\s*href="[^"]*"/, '');
        return `<a${attrs} href="${escape(whatsappUrl)}" target="_blank" rel="noopener noreferrer">`;
      });
      for (const key of ['hero', 'about']) {
        const src = site.portraits[key];
        if (!src || !src.startsWith('/images/')) continue;
        const hero = key === 'hero';
        const width = hero ? 960 : 800;
        const height = hero ? 1440 : 1200;
        const sizes = hero ? '(max-width: 699px) calc(100vw - 48px), (max-width: 1360px) 53vw, 710px' : '(max-width: 699px) calc((100vw - 70px) / 2), (max-width: 1360px) 28vw, 340px';
        const responsive = site.portraitSrcsets?.[key] ? ` srcset="${escape(site.portraitSrcsets[key])}" sizes="${sizes}"` : '';
        const image = `<div class="portrait portrait-${key} has-photo" data-portrait="${key}"><img src="${escape(src)}"${responsive} alt="${hero ? 'Carol Harder, psicóloga clínica' : 'Carol Harder em seu retrato profissional de apresentação'}" width="${width}" height="${height}" ${hero ? 'fetchpriority="high" loading="eager"' : 'loading="lazy"'} decoding="async"></div>`;
        html = html.replace(new RegExp(`<!-- portrait:${key} -->[\\s\\S]*?<!-- /portrait:${key} -->`), image);
      }
      const tags = [{ tag: 'meta', attrs: { name: 'robots', content: ready ? 'index, follow' : 'noindex, nofollow' }, injectTo: 'head' }];
      if (site.url) {
        tags.push({ tag: 'link', attrs: { rel: 'canonical', href: escape(site.url + (isPrivacy ? '/privacidade.html' : '/')) }, injectTo: 'head' });
        tags.push({ tag: 'meta', attrs: { property: 'og:url', content: site.url + (isPrivacy ? '/privacidade.html' : '/') }, injectTo: 'head' });
      }
      if (site.url && site.portraits.hero) tags.push({ tag: 'meta', attrs: { property: 'og:image', content: new URL(site.portraits.hero, site.url).href }, injectTo: 'head' });
      tags.push({ tag: 'script', attrs: { type: 'application/ld+json' }, children: JSON.stringify({ '@context': 'https://schema.org', '@type': 'Person', name: site.fullName || site.name, jobTitle: 'Psicóloga', knowsAbout: 'Terapia Cognitivo-Comportamental', ...(site.url ? { url: site.url } : {}) }).replaceAll('<', '\\u003c'), injectTo: 'head' });
      return { html, tags };
    },
    generateBundle() {
      this.emitFile({ type: 'asset', fileName: 'robots.txt', source: `User-agent: *\n${ready ? 'Allow: /' : 'Disallow: /'}\n${ready && site.url ? `Sitemap: ${site.url}/sitemap.xml\n` : ''}` });
      if (ready && site.url) this.emitFile({ type: 'asset', fileName: 'sitemap.xml', source: `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${escape(site.url)}/</loc></url></urlset>` });
    }
  }],
});
