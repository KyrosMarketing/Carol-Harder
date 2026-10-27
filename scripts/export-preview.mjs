import fs from 'node:fs';
import path from 'node:path';
const root = path.resolve('dist');
const imageData = file => {
  const mime = file.endsWith('.webp') ? 'image/webp' : 'image/png';
  return `data:${mime};base64,${fs.readFileSync(path.join(root, file)).toString('base64')}`;
};
function moduleSource(file) {
  let source = fs.readFileSync(path.join(root, file), 'utf8');
  source = source.replace(/\bimport\s*["'](\.[^"']+)["'];?/g, (_, dependency) => {
    const resolved = path.posix.join(path.posix.dirname(file), dependency);
    return `import "data:text/javascript;base64,${Buffer.from(moduleSource(resolved)).toString('base64')}";`;
  });
  return source;
}
function exportPage(input, output) {
  let html = fs.readFileSync(path.join(root, input), 'utf8');
  html = html.replace(/<link[^>]*rel="modulepreload"[^>]*>/g, '');
  html = html.replace(/<script type="module"[^>]*src="([^"]+)"[^>]*><\/script>/g, (_, file) => `<script type="module">${moduleSource(file).replaceAll('</script', '<\\/script')}</script>`);
  html = html.replace(/<link rel="stylesheet"[^>]*href="([^"]+)"[^>]*>/g, (_, file) => {
    let css = fs.readFileSync(path.join(root, file), 'utf8');
    css = css.replace(/url\(([^)]+)\)/g, (match, raw) => {
      const url = raw.replaceAll('"', '').replaceAll("'", '');
      if (url.startsWith('data:')) return match;
      const asset = url.startsWith('/') ? path.join(root, url) : path.resolve(root, path.dirname(file).replace(/^\//, ''), url);
      const mime = asset.endsWith('.woff2') ? 'font/woff2' : 'font/woff';
      return `url(data:${mime};base64,${fs.readFileSync(asset).toString('base64')})`;
    });
    return `<style>${css}</style>`;
  });
  html = html.replace(/\b(src|href|srcset)="([^"]+)"/g, (match, attribute, value) => {
    if (attribute === 'srcset') return `${attribute}="${value.replace(/\/images\/[^\s,]+/g, imageData)}"`;
    if (value.startsWith('/images/')) return `${attribute}="${imageData(value)}"`;
    if (attribute === 'href' && value === '/privacidade.html') return 'href="carol-harder-privacidade.html"';
    if (attribute === 'href' && value === '/') return 'href="carol-harder-preview.html"';
    return match;
  });
  fs.writeFileSync(path.join('artifacts', output), html);
}
fs.mkdirSync('artifacts', { recursive: true });
exportPage('index.html', 'carol-harder-preview.html');
exportPage('privacidade.html', 'carol-harder-privacidade.html');
console.log('Prévias exportadas com fontes, imagens e módulos locais embutidos em artifacts/.');
