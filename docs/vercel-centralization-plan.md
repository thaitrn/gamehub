# Kế hoạch centralize toàn bộ sản phẩm lên Vercel

- Owner quyết định: CEO Jack.T
- Gate tài liệu: Product / BA / Solution Architecture / Release contract
- Ngày audit: 2026-08-30
- Phạm vi: Game3, Babylon Pilot, Maybay29 FE + BE, Pixel Quest, Snake Neon, GameHub
- Quyết định bắt buộc: **GitHub → Vercel**. GitHub repository và production branch là release origin; push/merge production branch phải tự kích hoạt Vercel build/deploy. Local chỉ dùng development/test. Không upload `dist`, không dùng `vercel deploy --prod` hay cơ chế deploy thủ công làm production provenance.

## 1. Kết luận và ranh giới MVP

Centralization gồm bảy Vercel Project vì Maybay29 tách FE/BE. Mỗi Project phải link trực tiếp đúng GitHub repository, track production branch đã khóa trong bảng dưới và build từ source commit đó.

MVP migration chỉ đổi hosting/release path, build base và persistence bắt buộc để chạy đúng trên Vercel. Không tự đổi gameplay, scoring, content, metadata hay dữ liệu người chơi. GitHub Pages/host cũ tiếp tục phục vụ rollback trong migration; chỉ bỏ vai trò canonical sau khi từng production Vercel đã QA-PASS và GameHub đã trỏ sang URL mới.

Sau khi **cả sáu repository** đã có Vercel production QA-PASS và cutover hoàn tất, đổi visibility của `thaitrn/game3`, `thaitrn/babylon-pilot`, `thaitrn/maybay29`, `thaitrn/pixel-quest`, `thaitrn/snake-neon`, `thaitrn/gamehub` từ public sang private. Không đổi sớm vì GitHub Pages hiện là production/rollback của nhiều game.

Không claim migration PASS chỉ vì build local xanh. PASS cần đồng thời: GitHub-triggered Vercel deployment có commit SHA, public production URL không SSO, test evidence FRESH theo repo, production smoke/E2E, persistence check nếu có BE và PM acceptance không đổi scope.

## 2. Baseline audit có bằng chứng

### 2.1 Repository và hosting hiện tại

| Sản phẩm | GitHub source audit | Hosting hiện tại | Finding |
|---|---|---|---|
| Game3 | `https://github.com/thaitrn/game3`, remote/default `main`, audit SHA `d8a4c45f17d3a8dbe045e331ae9d1fe9cbebe027` | Vercel `game3`, canonical `https://game3-sandy-eta.vercel.app` | Đã đúng GitHub integration: latest deployment metadata ghi repo `game3`, ref `main`, SHA trên, `githubDeployment=1`; GitHub deployment/status do `vercel[bot]` tạo và success. Cần pin Node/build contract thay vì dựa dashboard default. |
| Babylon Pilot | `https://github.com/thaitrn/babylon-pilot`, `main`, audit SHA `dc4f8a6489bb64d282a9db8a3cb4ae83e8c01439` | `https://thaitrn.github.io/babylon-pilot/` trả 200 từ `server: GitHub.com` | Chưa có Vercel Project trong account audit. Vite base đang khóa `/babylon-pilot/`; phải chuyển `/`. |
| Maybay29 | `https://github.com/thaitrn/maybay29`; remote default `main` SHA `447926951a237d5685b89317a750e8ac55e9c8e5`; local đang ở `source` SHA `4f6f5ea...` | Chưa có canonical Vercel; bundle baseline từng trỏ localhost | `fe/` hiện không nằm trong commit `source` audit; production chỉ được build từ nội dung đã commit/push lên `main`. Không dùng local untracked làm release origin. BE đang ghi SQLite filesystem. |
| Pixel Quest | `https://github.com/thaitrn/pixel-quest`, remote/default `main`, SHA `9b9e28fa7cc5863c7e9c0cf532bf1b78a0c51a5b` | `https://thaitrn.github.io/pixel-quest/` trả 200 từ `server: GitHub.com` | Working copy audit không có `.git`, nên không được dùng nó làm provenance. Import GitHub repo trực tiếp; root `fe`. FE cần production API URL HTTPS đã xác minh. |
| Snake Neon | `https://github.com/thaitrn/snake-neon`, `main`, SHA `a76c1ee19195e787f20d9bed1a8093b7505b21a4` | `https://thaitrn.github.io/snake-neon/` trả 200 từ `server: GitHub.com` | Static HTML; dữ liệu score/mute chỉ ở localStorage. Chưa có Vercel Project. |
| GameHub | `https://github.com/thaitrn/gamehub`, `main`, SHA `b45ac4e99e49d5940dda28ad11b207b93adaef3d` | `https://thaitrn.github.io/gamehub/` trả 200 từ `server: GitHub.com` | Vite base đang khóa `/gamehub/`; catalog vẫn trỏ Pixel Quest/Babylon sang GitHub Pages. Chỉ đổi URL sau QA-PASS từng target. |

Vercel account audit chỉ có `game3` trong inventory liên quan; không suy đoán project/URL chưa tồn tại. Tên project dưới đây là contract để operator tạo, không phải claim chúng đã có.

### 2.2 Persistence/data flow

- Game3: browser gọi same-origin `/api/v3/*`; Vercel Functions dùng `DATABASE_URL` đến Postgres/Neon. Production và Preview hiện có nhóm env DB; tài liệu không ghi giá trị secret. Score nằm ngoài function filesystem nên phù hợp.
- Babylon Pilot: progress/settings dùng localStorage; migration origin làm localStorage namespace mới theo domain, vì vậy dữ liệu cũ **không tự chuyển**. Gameplay không phụ thuộc server persistence.
- Maybay29: FE gọi API; BE `be/src/db.js` mở `data/maybay29.db` bằng `better-sqlite3`, tự tạo thư mục và ghi player/run/score. Vercel Functions không được dùng filesystem này làm durable leaderboard. Phải chuyển schema/data access sang external Postgres (ưu tiên Neon qua Vercel Marketplace), giữ nguyên v3 API contract và import dữ liệu cần giữ trước cutover.
- Pixel Quest: progress/best/player id ở localStorage; FE còn phụ thuộc `VITE_API_BASE` cho leaderboard/stats. Domain migration làm local progress namespace mới; API base production phải là HTTPS canonical, không fallback `:8390`.
- Snake Neon: high score/mute ở localStorage, không có shared leaderboard; domain migration reset client-local state trừ khi làm bridge trên old origin. Bridge không thuộc MVP vì browser same-origin không cho Vercel đọc GitHub Pages localStorage trực tiếp.
- GameHub: không có persistence server; chỉ outbound catalog.

## 3. Contract Vercel Project đã khóa

Tất cả project dùng Production Branch `main`, Node.js `22.x`, GitHub integration bật auto-deploy. Mỗi repo phải pin `engines.node: "22.x"` (hoặc `.node-version`) để source control không lệch dashboard. Framework preset `Vite` cho Vite apps, `Other` cho Game3/Snake, `Fastify` cho Maybay API.

| Vercel Project | GitHub repo / branch | Root Directory | Install | Build | Output | Env production |
|---|---|---|---|---|---|---|
| `game3` | `thaitrn/game3` / `main` | `.` | `npm ci` | `npm --prefix fe ci && npm --prefix fe run build` | `fe/dist` | `DATABASE_URL` bắt buộc; các biến provider-generated khác giữ trong Vercel, không commit. Không set `VITE_API_BASE` production vì same-origin `/api`. |
| `babylon-pilot` | `thaitrn/babylon-pilot` / `main` | `.` | `npm ci` | `npm run build` | `dist` | Không có env bắt buộc. Vite `base: '/'`. |
| `maybay29-fe` | `thaitrn/maybay29` / `main` | `fe` | `npm ci` | `npm run build` | `dist` | `VITE_API_BASE=https://<canonical-maybay29-api>`; là public build-time config, không phải secret. Không localhost/HTTP. |
| `maybay29-api` | `thaitrn/maybay29` / `main` | `be` | `npm ci` | Không custom build; Fastify entry `src/server.js` theo Vercel detection | Function, không static output | `DATABASE_URL` bắt buộc; `CORS_ORIGIN=https://<canonical-maybay29-fe>`; các credential DB chỉ ở Vercel. Bỏ `DB_PATH` production. |
| `pixel-quest` | `thaitrn/pixel-quest` / `main` | `fe` | `npm ci` | `npm run build` | `dist` | `VITE_API_BASE=https://<canonical-pixel-api>` bắt buộc nếu leaderboard còn Must. URL/API owner chưa được evidence hiện tại xác nhận, nên đây là release gate; không suy đoán hostname. Vite `base: '/'`. |
| `snake-neon` | `thaitrn/snake-neon` / `main` | `.` | `npm ci` | Thêm deterministic `npm run build` chỉ copy allowlist runtime vào `dist` | `dist` | Không có env bắt buộc. Allowlist tối thiểu hiện tại là `index.html`; nếu implementation dùng local vendor/style thì thêm đúng file referenced, không publish QA scripts/report/node_modules. |
| `gamehub` | `thaitrn/gamehub` / `main` | `.` | `npm ci` | `npm run build` | `dist` | Không có env bắt buộc. Vite `base: '/'`. |

Không cấu hình project bằng upload artifact. `vercel.json`/`package.json` trong repo là source-of-truth cho build/routing có thể version-control; dashboard chỉ giữ Git link, production branch, Node version và secrets. Với Maybay monorepo, tạo hai Vercel Projects cùng link một repo nhưng khác Root Directory.

### Maybay API target architecture

`FE browser → HTTPS maybay29-api → Fastify Vercel Function → pooled Postgres/Neon`.

- Tách app construction khỏi side-effect `listen` nếu adapter/runtime cần; giữ local `npm start` riêng.
- Chuyển prepared statements/transaction từ SQLite sang parameterized Postgres queries; migration phải giữ entity `player`, `run`, `score_v3`, `daily_stats`, uniqueness của `finish_hash`/`run_id` và leaderboard order `value DESC, achieved_at ASC`.
- Dùng migration idempotent chạy có kiểm soát; không tạo schema trên mỗi request nếu gây lock/latency.
- Chỉ import production data từ source DB được owner xác nhận. Record count/checksum trước-sau và rollback snapshot là acceptance evidence; không tự lấy file local untracked làm production data.
- CORS allowlist chỉ FE canonical và localhost dev đã định danh. Health không trả credential/connection string.

## 4. Canonical URL và cutover không downtime

### 4.1 URL strategy

1. Mỗi project dùng stable production alias do Vercel cấp (`https://<project>.vercel.app`) làm canonical MVP; deployment URL immutable chỉ dùng evidence/rollback.
2. Không đoán alias trước khi project được tạo. Operator ghi URL thực vào handoff và probe public 200 không Deployment Protection/SSO.
3. Migration order: Game3 normalize → Maybay API → Maybay FE → Pixel Quest → Babylon Pilot → Snake Neon → GameHub.
4. GameHub là bước cuối; chỉ thay từng `playUrl` bằng Vercel canonical đã QA-PASS. Maybay/Snake chỉ thêm vào inventory nếu PM inventory contract riêng cho phép; centralization không tự thay inventory scope.
5. Sau cutover, GitHub Pages không còn canonical. Không xóa deployment/branch cũ cho đến khi toàn bộ smoke và PM acceptance hoàn tất.

### 4.2 Per-project release/cutover

1. Merge source + Vercel config vào `main` trên GitHub.
2. Xác nhận GitHub commit SHA và Vercel auto-deployment được trigger từ đúng repo/ref; cấm manual production deploy.
3. Xác nhận build READY, deployment metadata `githubCommitRepo`, `githubCommitRef=main`, `githubCommitSha=<SHA>`, `githubDeployment=1`.
4. Chạy test theo repo bằng `hermes-evidence`; QA chạy production mobile/desktop full loop, console/network check và API/persistence flow nếu có.
5. Probe canonical URL public không auth/SSO. Với API: health, write, read; cold-start lại rồi read để chứng minh durable data.
6. PM đối chiếu gameplay/content/data không đổi ngoài migration, sau đó mới đánh canonical/cập nhật GameHub.
7. Giữ URL cũ ít nhất đến khi toàn bộ migration + GameHub QA-PASS. Không redirect old URL nếu không kiểm soát được Pages redirect an toàn.

### 4.3 Rollback

- App/static regression: dùng Vercel Instant Rollback về deployment GitHub-triggered known-good; record deployment ID + source SHA. Sau incident, revert commit trên `main` để GitHub source-of-truth hội tụ, không để dashboard rollback là trạng thái vĩnh viễn.
- Maybay schema/data regression: rollback app chỉ khi schema backward-compatible; nếu destructive migration thì restore DB snapshot theo runbook. Không rollback bằng SQLite filesystem.
- Trước bước private, GitHub Pages/old host là fallback. Sau khi repo private, **không coi Pages là fallback** nếu account vẫn GitHub Free; Vercel known-good deployment là rollback chính.
- Không xóa project/deployment cũ trước QA-PASS; không đổi DNS/URL của nhiều sản phẩm trong một atomic step.

## 5. Chuyển sáu GitHub repo sang private

### 5.1 Điều kiện trước visibility cutover

- Cả bảy Vercel Projects READY từ đúng GitHub `main` SHA và canonical public không SSO.
- GameHub production đã trỏ toàn bộ game được PM duyệt sang Vercel, outbound smoke PASS.
- Vercel GitHub App đã được cài/cấp quyền cho **đúng cả sáu private repositories**. Với personal repos, Vercel yêu cầu repository owner để import/connect; quyền App gồm Contents/Deployments/Checks/Webhooks/Commit Statuses cần cho fetch và auto-deploy.
- Thử trên một repo ít rủi ro: đổi private, push một no-op docs commit/merge hợp lệ, xác nhận Vercel tự deploy SHA mới; rồi mới đổi tuần tự các repo còn lại. Nếu auto-deploy fail, đổi lại public hoặc sửa App access trước repo kế tiếp.
- Audit collaborators/commit author: Vercel Hobby không hỗ trợ collaboration private như Pro; production commit author phải thỏa điều kiện owner/login connection của team. Không giả định mọi contributor hiện tại vẫn trigger được deploy.

### 5.2 Đánh giá GitHub Free cho private repos

| Capability | Evidence chính thống | Quyết định |
|---|---|---|
| Actions | GitHub Actions miễn phí không giới hạn cho standard runner ở public; private dùng quota theo plan. GitHub Free personal hiện nêu 2.000 phút/tháng. | Audit tổng workflow consumption trước cutover; đặt budget/retention. Không claim CI miễn phí vô hạn. Vercel Git integration là release trigger, không phụ thuộc Pages workflow. |
| GitHub Pages | GitHub Free yêu cầu source repository public; GitHub Plans liệt kê Pages private trong nhóm advanced tools của Pro. | Sau private, Pages cũ có thể ngừng và không còn rollback. Chỉ privatize sau Vercel QA-PASS; không thiết kế tiếp tục dùng Pages canonical/fallback. |
| Protected branches / rulesets | GitHub docs nêu protected branches dùng public trên Free; private cần Pro/Team/Enterprise. GitHub Free private là limited feature set. | Không giả định branch protection/ruleset hiện tại còn enforce. Trước cutover ghi plan hiện tại; nếu account không Pro, dùng process control (PR + evidence + restricted credentials) hoặc nâng plan. Không claim required checks được enforce nếu dashboard không chứng minh. |
| Security | GitHub Free có Dependabot alerts; nhiều CodeQL/secret scanning/push-protection capability miễn phí cho public nhưng private cần GitHub Code Security/Secret Protection tùy feature. | Kiểm lại từng repo sau private. Không claim public-only scanning vẫn chạy; tối thiểu giữ Dependabot alerts, local/CI secret scan phù hợp quota và không commit secret. |

### 5.3 Thứ tự private cutover

`snake-neon → babylon-pilot → pixel-quest → game3 → maybay29 → gamehub`.

GameHub cuối cùng vì là catalog entry point; Maybay sau khi FE/BE private access đều đã thử. Mỗi bước phải có read-back visibility, Vercel App repository access, auto-deploy commit SHA và public smoke trước bước tiếp theo.

## 6. Acceptance mapping

| AC | Expected | Evidence bắt buộc |
|---|---|---|
| AC-01 Source | Mỗi Project link trực tiếp đúng GitHub repo, production `main`; push/merge tự deploy. | Vercel Settings Git screenshot/export + deployment metadata repo/ref/SHA + GitHub deployment/check URL. `git ls-remote` SHA phải khớp deployment SHA tại thời điểm gate. |
| AC-02 Reproducible build | Clean install/build từ checkout SHA; root/install/build/output/Node khớp bảng. | FRESH evidence theo `.evidence-required`; Vercel build log ghi source SHA và thành công. Không manual artifact upload. |
| AC-03 Public production | Canonical HTTPS mở intended product, 200, không SSO/Deployment Protection. | `curl` headers + browser mobile/desktop smoke trên canonical URL; console error/network failure không chặn flow. |
| AC-04 Scope preservation | Gameplay/content/scoring/data contract không tự đổi do migration. | PM checklist so baseline với production, QA full core loop; diff review chỉ migration/config/persistence cần thiết. |
| AC-05 Persistence | Game3/Maybay write→cold start/new request→read còn dữ liệu; không ghi Vercel filesystem. | API trace có pseudonymous test data, DB row/count evidence không secret; Maybay source/import counts nếu migrate data. |
| AC-06 Env/security | Không secret trong repo, build output, log/chat; env scope đúng Production/Preview. | Secret scan + Vercel env **name/scope only** review; production bundle scan không localhost/credential. |
| AC-07 No downtime | Old production giữ nguyên tới target QA-PASS; GameHub đổi URL sau target pass. | Before/after HTTP probes, timestamped QA verdict, GameHub commit SHA và outbound checks. |
| AC-08 Rollback | Known-good Vercel deployment ID/SHA và DB rollback procedure tồn tại. | Runbook + dashboard eligibility; rollback drill trên non-prod hoặc evidence operator review. Không cần gây production incident. |
| AC-09 Private access | Sau visibility cutover, Vercel vẫn đọc repo và auto-deploy; production vẫn public. | GitHub read-back `visibility=PRIVATE`, App installation access, một GitHub-triggered deployment SHA sau private, public smoke. |
| AC-10 GitHub plan | Không phụ thuộc feature public-only/paid chưa xác nhận. | Dashboard audit cho Actions quota, Pages state, branch/ruleset enforcement, security features sau private; record plan/trade-off. |
| AC-11 GameHub | Catalog canonical chỉ dùng Vercel URL của game đã được PM duyệt; không tự thêm/xóa game. | `src/games.ts` diff + tests/build FRESH + click toàn bộ CTA production. |

### Handoff record bắt buộc cho từng project

```text
Product:
GitHub repo:
Production branch:
Source commit SHA:
Vercel project:
Root / Framework / Node:
Install / Build / Output:
Production deployment URL:
Canonical URL:
Deployment metadata repo/ref/SHA/githubDeployment:
GitHub deployment/check URL:
Auto-deploy verification (push/merge timestamp → deployment timestamp):
Env names/scopes (không value):
FRESH evidence labels/commands/profile:
Production QA evidence:
PM acceptance:
Known-good rollback deployment ID/SHA:
Residual risks:
```

## 7. Ưu tiên MoSCoW

### Must

- GitHub→Vercel auto-deploy provenance cho cả bảy Projects.
- Build contract/version-controlled config, Node 22.x, public canonical không SSO.
- Maybay durable external Postgres; không filesystem SQLite production.
- QA-PASS + PM acceptance trước cutover; giữ deployment cũ.
- Cấp Vercel GitHub App access trước khi chuyển cả sáu repos private; verify auto-deploy sau private.
- GameHub đổi canonical cuối cùng và không đổi inventory scope.

### Should

- Preview deployment cho PR, env tách Preview/Production, rollback drill, custom domain ở pha sau nếu CEO cấp domain.
- DB backup/restore drill và observability cho API latency/error.

### Could

- Vercel Related Projects cho Maybay preview FE↔BE; redirect host cũ nếu nền tảng cũ cho phép an toàn.
- GitHub Pro/Team để giữ protected branches/Pages private nếu có business need; không bắt buộc cho Vercel canonical.

### Won't trong migration MVP

- Đổi gameplay, thêm game/card, account/login, analytics mới, migrate localStorage cross-domain, custom domain chưa được cấp, xóa host/deployment cũ sớm, manual production deploy.

## 8. Nguồn chính thống

- Vercel Git deployments: https://vercel.com/docs/deployments/git
- Vercel for GitHub, permissions/private repo: https://vercel.com/docs/git/vercel-for-github
- Vercel project/build/root/Node settings: https://vercel.com/docs/deployments/configure-a-build
- Vercel project config in source: https://vercel.com/docs/projects/project-configuration
- Vercel environments/env vars: https://vercel.com/docs/deployments/environments và https://vercel.com/docs/environment-variables
- Vercel supported Node versions: https://vercel.com/docs/functions/runtimes/node-js/node-js-versions
- Vercel Fastify: https://vercel.com/docs/frameworks/backend/fastify
- Vercel Postgres marketplace/Neon: https://vercel.com/docs/storage/vercel-postgres
- Vercel function file writes: https://vercel.com/guides/how-can-i-use-files-in-serverless-functions
- Vercel monorepos: https://vercel.com/docs/monorepos
- Vercel instant rollback: https://vercel.com/docs/instant-rollback
- GitHub plans: https://docs.github.com/en/get-started/learning-about-github/githubs-plans
- GitHub Actions billing/usage: https://docs.github.com/en/actions/concepts/billing-and-usage
- GitHub Pages source visibility: https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site
- GitHub protected branches availability: https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/managing-a-branch-protection-rule
- GitHub security feature availability: https://docs.github.com/en/code-security/getting-started/github-security-features

## 9. Rủi ro mở và owner

1. **Pixel API canonical chưa được evidence xác nhận** — Backend/QA phải chốt URL và probe trước FE deploy; không được fallback localhost.
2. **Maybay `main` không phản ánh local `source`/untracked FE audit** — implementation owner phải commit migration vào `main`; Vercel không link `source`.
3. **Maybay production DB/source data chưa xác định** — Backend owner + CEO xác nhận data source/retention; không import file local tùy ý.
4. **Cross-domain localStorage reset** — PM chấp nhận residual cho Babylon/Pixel/Snake hoặc mở project migration UX riêng; không âm thầm claim giữ local progress.
5. **GitHub plan hiện tại chưa được dashboard evidence xác nhận** — Release owner audit trước private cutover; nếu Free, protected branches/Pages private không được coi là khả dụng.
6. **Vercel Hobby private collaboration** — owner xác nhận ai được phép tạo production commit; nâng Pro nếu nhiều contributor cần auto-deploy.
7. **Stable aliases chưa tồn tại ngoài Game3** — operator ghi URL thực sau project creation; không dùng placeholder trong GameHub production.
