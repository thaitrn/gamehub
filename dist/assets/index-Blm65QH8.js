(function(){const r=document.createElement("link").relList;if(r&&r.supports&&r.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))n(e);new MutationObserver(e=>{for(const a of e)if(a.type==="childList")for(const l of a.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&n(l)}).observe(document,{childList:!0,subtree:!0});function i(e){const a={};return e.integrity&&(a.integrity=e.integrity),e.referrerPolicy&&(a.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?a.credentials="include":e.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function n(e){if(e.ep)return;e.ep=!0;const a=i(e);fetch(e.href,a)}})();const h=[{id:"pixel-quest",name:"Pixel Quest",shortDescription:"Một chuyến phiêu lưu pixel gọn nhẹ, sẵn sàng để bạn bắt đầu ngay.",status:"Live",tags:["Phiêu lưu","Pixel"],art:"quest",coverAlt:"Minh hoạ pixel trừu tượng với mặt trời và địa hình phiêu lưu.",playUrl:"https://thaitrn.github.io/pixel-quest/",ctaLabel:"Chơi ngay",published:!0,sortOrder:1,owner:"Product owner",lastVerifiedAt:"2026-08-27"},{id:"maybay29",name:"Máy Bay Mừng 2/9",shortDescription:"Cất cánh trong một trải nghiệm bay vui nhộn, lấy cảm hứng từ ngày hội.",status:"Live",tags:["Bay lượn","Nhịp độ nhanh"],art:"flight",coverAlt:"Minh hoạ máy bay giấy trừu tượng bay qua các đám mây.",playUrl:"https://thaitrn.github.io/maybay29/",ctaLabel:"Chơi ngay",published:!0,sortOrder:2,owner:"Product owner",lastVerifiedAt:"2026-08-27"},{id:"babylon-pilot",name:"Babylon Pilot",shortDescription:"Bản trải nghiệm thử nghiệm cho hành trình khám phá thế giới Babylon.",status:"Pilot",tags:["Pilot","Khám phá"],art:"babylon",coverAlt:"Minh hoạ kiến trúc cổ điển trừu tượng và vầng trăng.",playUrl:"https://thaitrn.github.io/babylon-pilot/",ctaLabel:"Trải nghiệm pilot",published:!0,sortOrder:3,owner:"Product owner",lastVerifiedAt:"2026-08-27"}],c=document.querySelector("#app");if(!c)throw new Error("Không tìm thấy vùng ứng dụng GameHub.");const o=h.filter(t=>t.published).sort((t,r)=>t.sortOrder-r.sortOrder),s=t=>t.replace(/[&<>'"]/g,r=>({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"})[r]??r),p=t=>{const r=s(t.name),i=s(t.playUrl),n=t.tags.map(a=>`<li>${s(a)}</li>`).join(""),e=t.status==="Live"?"status--live":"status--pilot";return`
    <article class="game-card" aria-labelledby="${t.id}-title">
      <a class="cover-link" href="${i}" target="_blank" rel="noopener noreferrer" aria-label="Mở ${r} trong tab mới">
        <div class="game-art game-art--${t.art}" role="img" aria-label="${s(t.coverAlt)}">
          <span class="art-sun" aria-hidden="true"></span><span class="art-shape art-shape--one" aria-hidden="true"></span><span class="art-shape art-shape--two" aria-hidden="true"></span>
        </div>
      </a>
      <div class="card-body">
        <div class="card-meta"><span class="status ${e}">${t.status}</span><span class="meta-label">WEB GAME</span></div>
        <h2 id="${t.id}-title"><a href="${i}" target="_blank" rel="noopener noreferrer">${r}</a></h2>
        <p>${s(t.shortDescription)}</p>
        <ul class="tags" aria-label="Thể loại">${n}</ul>
        <a class="play-button" data-game-id="${t.id}" href="${i}" target="_blank" rel="noopener noreferrer">${t.ctaLabel}<span aria-hidden="true"> ↗</span><span class="sr-only">: ${r}, mở trong tab mới</span></a>
      </div>
    </article>`};c.innerHTML=`
  <header class="site-header">
    <div class="shell header-inner"><a class="brand" href="./" aria-label="GameHub, về đầu trang">Game<span>Hub</span></a><p>Khám phá các game của chúng tôi</p></div>
  </header>
  <main id="catalog" class="shell">
    <section class="intro" aria-labelledby="page-title"><p class="eyebrow">DANH MỤC</p><h1 id="page-title">Chọn một thế giới để chơi.</h1><p>Tất cả game công khai, trong một nơi gọn gàng. Chạm vào ảnh, tên hoặc nút để bắt đầu.</p></section>
    <section aria-labelledby="games-title"><div class="section-heading"><h2 id="games-title">Đang sẵn sàng</h2><p>${o.length} game</p></div><div class="game-grid">${o.map(p).join("")}</div></section>
  </main>
  <footer class="shell site-footer"><p>GameHub <span aria-hidden="true">·</span> Chơi vui nhé.</p></footer>`;
