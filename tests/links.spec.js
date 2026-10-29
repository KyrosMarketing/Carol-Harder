import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

for (const [width, height] of [[320, 568], [360, 640], [390, 844], [768, 1024], [1440, 900]]) {
  test(`bio direct route, responsive layout and accessibility at ${width}px`, async ({ page }) => {
    const failures = [];
    page.on('pageerror', error => failures.push(error.message));
    page.on('response', response => { if (response.status() >= 400) failures.push(response.url()); });
    await page.setViewportSize({ width, height });
    const response = await page.goto('/links');
    expect(response.status()).toBe(200);
    await page.evaluate(() => document.fonts.ready);
    await page.evaluate(() => Promise.all(document.getAnimations().map(animation => animation.finished)));
    await expect(page.getByRole('heading', { name: 'Carol Harder' })).toBeVisible();
    await expect(page.getByRole('navigation').getByRole('link')).toHaveCount(3);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    expect(await page.locator('.bio-logo').evaluate(img => img.complete && img.naturalWidth === 1419)).toBe(true);
    const bounds = await page.locator('.bio-links').boundingBox();
    expect(Math.abs(bounds.x + bounds.width / 2 - width / 2)).toBeLessThan(1);
    if (width >= 360 && width < 700) expect(bounds.y + bounds.height).toBeLessThan(height);
    for (const link of await page.locator('.bio-button').all()) expect((await link.boundingBox()).height).toBeGreaterThanOrEqual(44);
    expect((await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze()).violations).toEqual([]);
    await page.reload();
    await expect(page.getByRole('heading')).toHaveText('Carol Harder');
    expect(failures).toEqual([]);
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.screenshot({ path: `artifacts/links-${width}.png`, fullPage: true });
  });
}

test('bio metadata and links work without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  try {
    await page.goto('http://127.0.0.1:4173/links');
    await expect(page).toHaveTitle('Carol Harder | Links e Atendimento');
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex, follow');
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://carolharder.com.br/links');
    await expect(page.locator('meta[property="og:url"]')).toHaveAttribute('content', 'https://carolharder.com.br/links');
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', /^https:\/\//);
    const whatsapp = new URL(await page.getByRole('link', { name: 'Agendar atendimento' }).getAttribute('href'));
    expect(whatsapp.origin + whatsapp.pathname).toBe('https://wa.me/5541988640026');
    expect(whatsapp.searchParams.get('text')).toBe('Olá, Carol! Conheci seu trabalho pelo Instagram e gostaria de saber mais sobre os atendimentos de psicoterapia online.');
    await expect(page.getByRole('link', { name: 'Conheça meu trabalho' })).toHaveAttribute('href', 'https://carolharder.com.br');
    await expect(page.getByRole('link', { name: 'Acompanhe no Instagram' })).toHaveAttribute('href', 'https://www.instagram.com/psicologa.carol.harder/');
    await expect(page.locator('.bio-professional')).toContainText('CRP 08/19247');
    await expect(page.locator('.bio-footer')).toContainText('8h às 19h');
  } finally { await context.close(); }
});

test('bio keyboard, reduced motion and local click events do not collect data', async ({ page }) => {
  const external = [];
  page.on('request', request => { if (!request.url().startsWith('http://127.0.0.1:4173')) external.push(request.url()); });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/links');
  expect(await page.evaluate(() => document.getAnimations().length)).toBe(0);
  await page.evaluate(() => {
    window.bioEvents = [];
    window.addEventListener('carol:bio-click', event => window.bioEvents.push(event.detail));
    // Suppress outgoing navigation in this test, without changing event propagation.
    document.querySelector('.bio-links').addEventListener('click', event => event.preventDefault());
  });
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Agendar atendimento' })).toBeFocused();
  expect(await page.locator(':focus-visible').evaluate(el => getComputedStyle(el).outlineStyle)).toBe('solid');
  await page.keyboard.press('Enter');
  await page.keyboard.press('Tab'); await page.keyboard.press('Enter');
  await page.keyboard.press('Tab'); await page.keyboard.press('Enter');
  const events = await page.evaluate(() => window.bioEvents);
  expect(events.map(event => event.event_name)).toEqual(['click_whatsapp_bio', 'click_site_bio', 'click_instagram_bio']);
  expect(events.every(event => event.page_path === '/links' && event.source === 'instagram_bio')).toBe(true);
  expect(await page.evaluate(() => ({ cookies: document.cookie, local: localStorage.length, session: sessionStorage.length, gtag: typeof window.gtag, gtm: typeof window.google_tag_manager }))).toEqual({ cookies: '', local: 0, session: 0, gtag: 'undefined', gtm: 'undefined' });
  expect(external).toEqual([]);
});
