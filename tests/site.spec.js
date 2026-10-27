import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import fs from 'node:fs';

for (const width of [360, 390, 768, 1024, 1440]) {
  test(`layout, assets and accessibility at ${width}px`, async ({ page }) => {
    const errors = []; const responses = []; const external = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('response', response => { if (response.status() >= 400) responses.push(`${response.status()} ${response.url()}`); });
    page.on('request', request => { if (!request.url().startsWith('http://127.0.0.1:4173')) external.push(request.url()); });
    await page.setViewportSize({ width, height: 960 });
    await page.goto('/'); await page.evaluate(() => document.fonts.ready);
    await expect(page.locator('h1')).toHaveCount(1);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    expect(await page.locator('img').evaluateAll(images => images.every(img => img.loading === 'lazy' || (img.complete && img.naturalWidth > 0)))).toBe(true);
    const hero = page.locator('[data-portrait="hero"] img');
    await expect(hero).toHaveAttribute('fetchpriority', 'high');
    await expect(hero).toHaveAttribute('srcset', /carol-hero-480\.webp/);
    expect(await hero.evaluate(img => img.complete && img.naturalWidth > 0)).toBe(true);
    const about = page.locator('[data-portrait="about"] img');
    await expect(about).toHaveAttribute('loading', 'lazy');
    await about.scrollIntoViewIfNeeded();
    await expect.poll(() => about.evaluate(img => img.complete && img.naturalWidth > 0)).toBe(true);
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
    await expect(page.locator('.portrait-placeholder')).toHaveCount(0);
    // Audit the settled state after scroll entrances; do not disable their effects.
    await page.evaluate(async () => {
      await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
      await Promise.all(document.getAnimations().map(animation => animation.finished.catch(() => {})));
    });
    const accessibility = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
    expect(accessibility.violations).toEqual([]);
    expect(errors).toEqual([]); expect(responses).toEqual([]); expect(external).toEqual([]);
    fs.mkdirSync('artifacts', { recursive: true });
    await page.screenshot({ path: `artifacts/carol-${width}.png`, fullPage: true });
  });
}
test('mobile navigation, keyboard, anchor targets and FAQ', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 }); await page.goto('/');
  await page.keyboard.press('Tab'); await expect(page.getByRole('link', { name: 'Pular para o conteúdo' })).toBeFocused();
  const menu = page.getByRole('button', { name: 'Menu' });
  await menu.click(); await expect(menu).toHaveAttribute('aria-expanded', 'true');
  await page.keyboard.press('Escape'); await expect(menu).toHaveAttribute('aria-expanded', 'false'); await expect(menu).toBeFocused();
  await menu.click(); await page.getByRole('navigation', { name: 'Navegação principal' }).getByRole('link', { name: 'Dúvidas' }).click();
  await expect(menu).toHaveAttribute('aria-expanded', 'false'); await expect(page).toHaveURL(/#duvidas$/);
  const summary = page.locator('summary').first(); await summary.focus(); await page.keyboard.press('Enter');
  await expect(page.locator('details').first()).toHaveAttribute('open', '');
  await page.keyboard.press('Enter'); await expect(page.locator('details').first()).not.toHaveAttribute('open');
  await summary.click(); await page.locator('summary').nth(1).click();
  await expect(page.locator('details').nth(1)).toHaveAttribute('open', '');
  await expect(page.locator('details').first()).not.toHaveAttribute('open');
  expect(await page.locator('a[href^="#"]').evaluateAll(links => links.every(link => document.querySelector(link.getAttribute('href'))))).toBe(true);
});
test('confirmed WhatsApp links and accessible privacy dialog', async ({ page }) => {
  await page.goto('/');
  const contacts = page.locator('[data-contact]');
  for (const link of await contacts.all()) {
    const url = new URL(await link.getAttribute('href'));
    expect(url.hostname).toBe('wa.me'); expect(url.pathname).toBe('/5541988640026');
    expect(url.searchParams.get('text')).toBe('Olá, Carol! Conheci seu site e gostaria de saber mais sobre os atendimentos online e a disponibilidade de horários.');
    await expect(link).toHaveAttribute('target', '_blank'); await expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  }
  await expect(page.locator('[data-contact-pending]')).not.toBeVisible();
  await expect(page.locator('.professional-crp').first()).toHaveText('CRP 08/19247');
  const privacy = page.getByRole('link', { name: 'Política de privacidade' });
  await privacy.click(); await expect(page.locator('#privacy-dialog')).toBeVisible();
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  await page.keyboard.press('Escape'); await expect(page.locator('#privacy-dialog')).not.toBeVisible(); await expect(privacy).toBeFocused();
  await privacy.click(); await page.getByRole('button', { name: 'Fechar política de privacidade' }).click();
  await expect(page.locator('#privacy-dialog')).not.toBeVisible();
});
test('SEO and draft publication protections', async ({ page, request }) => {
  await page.goto('/'); await expect(page).toHaveTitle('Carol Harder | Psicoterapia online para mulheres');
  await expect(page.locator('html')).toHaveAttribute('lang', 'pt-BR');
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex, nofollow');
  expect((await (await request.get('/robots.txt')).text()).trim()).toBe('User-agent: *\nDisallow: /');
  const schema = JSON.parse(await page.locator('script[type="application/ld+json"]').textContent());
  expect(schema['@type']).toBe('Person'); expect(schema.name).toBe('Carol Harder'); expect(schema.aggregateRating).toBeUndefined();
  await expect(page.locator('a[href*="wa.me"]')).toHaveCount(8);
});
test('reduced motion preference', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' }); await page.goto('/');
  expect(await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior)).toBe('auto');
});

test('public-facing content and contact work without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  try {
    await page.goto('http://127.0.0.1:4173');
    await expect(page.locator('h1')).toContainText('mais cuidado.');
    await expect(page.getByRole('navigation', { name: 'Navegação principal' })).toBeVisible();
    const contacts = page.locator('[data-contact]');
    for (const link of await contacts.all()) await expect(link).toHaveAttribute('href', /^https:\/\/wa\.me\/5541988640026/);
    await expect(page.locator('[data-portrait="hero"] img')).toHaveAttribute('src', '/images/carol-hero-960.webp');
    await page.locator('summary').first().click();
    await expect(page.locator('details').first()).toHaveAttribute('open', '');
    await page.getByRole('link', { name: 'Política de privacidade' }).click();
    await expect(page).toHaveTitle('Política de privacidade | Carol Harder');
    await expect(page.locator('h1')).toHaveText('Política de privacidade.');
    await expect(page.getByRole('link', { name: 'Contato profissional:' })).toBeVisible();
  } finally { await context.close(); }
});
test('privacy page and restrained sticky header', async ({ page }) => {
  await page.goto('/privacidade.html');
  expect((await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze()).violations).toEqual([]);
  await page.goto('/');
  await expect(page.locator('.header')).not.toHaveClass(/is-scrolled/);
  await page.locator('#atendimento').scrollIntoViewIfNeeded();
  await expect(page.locator('.header')).toHaveClass(/is-scrolled/);
  expect(await page.locator('.header').evaluate(el => el.getBoundingClientRect().top)).toBe(0);
  const visibleText = await page.locator('main, footer').allTextContents();
  expect(visibleText.join(' ')).not.toMatch(/a confirmar|aguardando|versão para revisão|placeholder/i);
});

test('scroll entrances fade and rise once without changing layout', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  const target = page.locator('.about-heading');
  const documentHeight = await page.evaluate(() => document.documentElement.scrollHeight);
  await target.evaluate(el => el.scrollIntoView({ block: 'center', behavior: 'instant' }));
  await expect.poll(() => target.evaluate(el => el.getAnimations().some(animation => animation.playState === 'running'))).toBe(true);
  const entering = await target.evaluate(el => ({ opacity: Number(getComputedStyle(el).opacity), transform: getComputedStyle(el).transform }));
  expect(entering.opacity).toBeLessThan(1);
  expect(entering.transform).not.toBe('none');
  await target.evaluate(el => Promise.all(el.getAnimations().map(animation => animation.finished)));
  await expect(target).toHaveCSS('opacity', '1');
  await expect(target).toHaveCSS('transform', 'none');
  expect(await page.evaluate(() => document.documentElement.scrollHeight)).toBe(documentHeight);
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await target.evaluate(el => el.scrollIntoView({ block: 'center', behavior: 'instant' }));
  await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
  expect(await target.evaluate(el => el.getAnimations().length)).toBe(0);
});
test('reduced motion skips entrances and cancels an entrance already running', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  const target = page.locator('.about-heading');
  await target.evaluate(el => el.scrollIntoView({ block: 'center', behavior: 'instant' }));
  await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
  expect(await target.evaluate(el => el.getAnimations().length)).toBe(0);
  await expect(target).toHaveCSS('opacity', '1');
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  await target.evaluate(el => el.scrollIntoView({ block: 'center', behavior: 'instant' }));
  await expect.poll(() => target.evaluate(el => el.getAnimations().some(animation => animation.playState === 'running'))).toBe(true);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect.poll(() => target.evaluate(el => el.getAnimations().length)).toBe(0);
  await expect(target).toHaveCSS('opacity', '1');
  await expect(target).toHaveCSS('transform', 'none');
});
