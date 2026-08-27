import { chromium } from 'playwright';

const expected = [
  { id: 'pixel-quest', status: 'Live', cta: 'Chơi ngay', href: 'https://thaitrn.github.io/pixel-quest/' },
  { id: 'maybay29', status: 'Live', cta: 'Chơi ngay', href: 'https://thaitrn.github.io/maybay29/' },
  { id: 'babylon-pilot', status: 'Pilot', cta: 'Trải nghiệm pilot', href: 'https://thaitrn.github.io/babylon-pilot/' },
];

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 320, height: 740 }, isMobile: true, hasTouch: true });
const pageErrors = [];
page.on('pageerror', (error) => pageErrors.push(error.message));
await page.goto('http://127.0.0.1:4173/gamehub/', { waitUntil: 'networkidle' });

const cards = page.locator('.game-card');
if (await cards.count() !== expected.length) throw new Error(`Expected ${expected.length} cards.`);
if (await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)) throw new Error('Unexpected horizontal overflow at 320px.');

for (const game of expected) {
  const card = page.locator(`[aria-labelledby="${game.id}-title"]`);
  const status = await card.locator('.status').innerText();
  const cta = card.locator(`[data-game-id="${game.id}"]`);
  const href = await cta.getAttribute('href');
  const target = await cta.getAttribute('target');
  const ctaText = (await cta.innerText()).trim();
  if (status !== game.status || href !== game.href || !ctaText.startsWith(game.cta) || target !== '_blank') {
    throw new Error(`${game.id}: expected ${game.status} / ${game.cta} / ${game.href}; got ${status} / ${ctaText} / ${href}`);
  }
  const box = await cta.boundingBox();
  if (!box || box.height < 44) throw new Error(`${game.id}: CTA target smaller than 44px.`);
}

if (await page.locator('text=Tàu Vũ Trụ Cộng Số').count()) throw new Error('Pending product must not be visible.');
if (pageErrors.length) throw new Error(`Page errors: ${pageErrors.join('; ')}`);
await page.screenshot({ path: '/tmp/gamehub-fe.png', fullPage: true });
console.log(JSON.stringify({ verdict: 'PASS', viewport: '320x740', cards: expected.map((game) => ({ id: game.id, status: game.status, href: game.href })), pageErrors, screenshot: '/tmp/gamehub-fe.png' }, null, 2));
await browser.close();
