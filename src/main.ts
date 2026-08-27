import './style.css';
import { games } from './games';

const app = document.querySelector<HTMLDivElement>('#app');
if (!app) throw new Error('Không tìm thấy vùng ứng dụng GameHub.');

const publicGames = games
  .filter((game) => game.published)
  .sort((a, b) => a.sortOrder - b.sortOrder);

const escapeHtml = (value: string) => value.replace(/[&<>'"]/g, (character) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;',
}[character] ?? character));

const gameCard = (game: (typeof publicGames)[number]) => {
  const name = escapeHtml(game.name);
  const href = escapeHtml(game.playUrl);
  const tags = game.tags.map((tag) => `<li>${escapeHtml(tag)}</li>`).join('');
  const statusClass = game.status === 'Live' ? 'status--live' : 'status--pilot';

  return `
    <article class="game-card" aria-labelledby="${game.id}-title">
      <a class="cover-link" href="${href}" target="_blank" rel="noopener noreferrer" aria-label="Mở ${name} trong tab mới">
        <div class="game-art game-art--${game.art}" role="img" aria-label="${escapeHtml(game.coverAlt)}">
          <span class="art-sun" aria-hidden="true"></span><span class="art-shape art-shape--one" aria-hidden="true"></span><span class="art-shape art-shape--two" aria-hidden="true"></span>
        </div>
      </a>
      <div class="card-body">
        <div class="card-meta"><span class="status ${statusClass}">${game.status}</span><span class="meta-label">WEB GAME</span></div>
        <h2 id="${game.id}-title"><a href="${href}" target="_blank" rel="noopener noreferrer">${name}</a></h2>
        <p>${escapeHtml(game.shortDescription)}</p>
        <ul class="tags" aria-label="Thể loại">${tags}</ul>
        <a class="play-button" data-game-id="${game.id}" href="${href}" target="_blank" rel="noopener noreferrer">${game.ctaLabel}<span aria-hidden="true"> ↗</span><span class="sr-only">: ${name}, mở trong tab mới</span></a>
      </div>
    </article>`;
};

app.innerHTML = `
  <header class="site-header">
    <div class="shell header-inner"><a class="brand" href="./" aria-label="GameHub, về đầu trang">Game<span>Hub</span></a><p>Khám phá các game của chúng tôi</p></div>
  </header>
  <main id="catalog" class="shell">
    <section class="intro" aria-labelledby="page-title"><p class="eyebrow">DANH MỤC</p><h1 id="page-title">Chọn một thế giới để chơi.</h1><p>Tất cả game công khai, trong một nơi gọn gàng. Chạm vào ảnh, tên hoặc nút để bắt đầu.</p></section>
    <section aria-labelledby="games-title"><div class="section-heading"><h2 id="games-title">Sẵn sàng</h2><p>${publicGames.length} game</p></div><div class="game-grid">${publicGames.map(gameCard).join('')}</div></section>
  </main>
  <footer class="shell site-footer"><p>GameHub <span aria-hidden="true">·</span> Chơi vui nhé.</p></footer>`;
