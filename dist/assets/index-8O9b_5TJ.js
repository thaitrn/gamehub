(function(){const r=document.createElement("link").relList;if(r&&r.supports&&r.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))n(t);new MutationObserver(t=>{for(const a of t)if(a.type==="childList")for(const l of a.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&n(l)}).observe(document,{childList:!0,subtree:!0});function s(t){const a={};return t.integrity&&(a.integrity=t.integrity),t.referrerPolicy&&(a.referrerPolicy=t.referrerPolicy),t.crossOrigin==="use-credentials"?a.credentials="include":t.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function n(t){if(t.ep)return;t.ep=!0;const a=s(t);fetch(t.href,a)}})();const h=[{id:"pixel-quest",name:"Pixel Quest",shortDescription:"Game platformer pixel-art trên web: chọn chế độ, vượt màn, thu thập vật phẩm và chinh phục bảng xếp hạng.",status:"Live",tags:["Platformer","Pixel Art","Web Game"],art:"quest",coverAlt:"Ảnh bìa game platformer Pixel Quest phong cách pixel-art.",playUrl:"https://thaitrn.github.io/pixel-quest/",ctaLabel:"Chơi ngay",published:!0,sortOrder:1,owner:"thaitrn",lastVerifiedAt:"2026-08-30"},{id:"game3",name:"Tàu Vũ Trụ Cộng Số",shortDescription:"Lái tàu bằng một ngón, né thiên thạch, nhặt sao và giải toán cộng trừ trong phạm vi 100.",status:"Live",tags:["Giáo dục","Toán học"],art:"flight",coverAlt:"Minh hoạ tàu vũ trụ bay giữa các vì sao và thiên thạch.",playUrl:"https://game3-sandy-eta.vercel.app",ctaLabel:"Chơi ngay",published:!0,sortOrder:2,owner:"Product owner",lastVerifiedAt:"2026-08-30"},{id:"babylon-pilot",name:"Khoa học lung linh",shortDescription:"Chạm hoặc click để thu thập 10 linh thể phát sáng giữa cực quang hạt 3D.",status:"Pilot",tags:["3D","Babylon.js","WebGPU","WebGL2","Particle","Interactive","Mobile"],art:"babylon",coverAlt:"Minh hoạ các linh thể phát sáng giữa cực quang hạt trong không gian 3D.",playUrl:"https://thaitrn.github.io/babylon-pilot/",ctaLabel:"Trải nghiệm pilot",published:!0,sortOrder:3,owner:"Product owner",lastVerifiedAt:"2026-08-30"}],c=document.querySelector("#app");if(!c)throw new Error("Không tìm thấy vùng ứng dụng GameHub.");const o=h.filter(e=>e.published).sort((e,r)=>e.sortOrder-r.sortOrder),i=e=>e.replace(/[&<>'"]/g,r=>({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"})[r]??r),p=e=>{const r=i(e.name),s=i(e.playUrl),n=e.tags.map(a=>`<li>${i(a)}</li>`).join(""),t=e.status==="Live"?"status--live":"status--pilot";return`
    <article class="game-card" aria-labelledby="${e.id}-title">
      <a class="cover-link" href="${s}" target="_blank" rel="noopener noreferrer" aria-label="Mở ${r} trong tab mới">
        <div class="game-art game-art--${e.art}" role="img" aria-label="${i(e.coverAlt)}">
          <span class="art-sun" aria-hidden="true"></span><span class="art-shape art-shape--one" aria-hidden="true"></span><span class="art-shape art-shape--two" aria-hidden="true"></span>
        </div>
      </a>
      <div class="card-body">
        <div class="card-meta"><span class="status ${t}">${e.status}</span><span class="meta-label">WEB GAME</span></div>
        <h2 id="${e.id}-title"><a href="${s}" target="_blank" rel="noopener noreferrer">${r}</a></h2>
        <p>${i(e.shortDescription)}</p>
        <ul class="tags" aria-label="Thể loại">${n}</ul>
        <a class="play-button" data-game-id="${e.id}" href="${s}" target="_blank" rel="noopener noreferrer">${e.ctaLabel}<span aria-hidden="true"> ↗</span><span class="sr-only">: ${r}, mở trong tab mới</span></a>
      </div>
    </article>`};c.innerHTML=`
  <header class="site-header">
    <div class="shell header-inner"><a class="brand" href="./" aria-label="GameHub, về đầu trang">Game<span>Hub</span></a><p>Khám phá các game của chúng tôi</p></div>
  </header>
  <main id="catalog" class="shell">
    <section class="intro" aria-labelledby="page-title"><p class="eyebrow">DANH MỤC</p><h1 id="page-title">Chọn một thế giới để chơi.</h1><p>Tất cả game công khai, trong một nơi gọn gàng. Chạm vào ảnh, tên hoặc nút để bắt đầu.</p></section>
    <section aria-labelledby="games-title"><div class="section-heading"><h2 id="games-title">Sẵn sàng</h2><p>${o.length} game</p></div><div class="game-grid">${o.map(p).join("")}</div></section>
  </main>
  <footer class="shell site-footer"><p>GameHub <span aria-hidden="true">·</span> Chơi vui nhé.</p></footer>`;
