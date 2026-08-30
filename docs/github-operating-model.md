# GitHub operating model — AI Company / Vercel

- Owner quyết định: CEO Jack.T
- Gate: Product / BA / Solution Architecture / Product Ops
- Ngày audit: 2026-08-30
- Phạm vi: `thaitrn/game3`, `babylon-pilot`, `maybay29`, `pixel-quest`, `gamehub`, `snake-neon`
- Release origin duy nhất: GitHub repository + production branch `main`
- Canonical hosting duy nhất sau cutover: Vercel

## 1. Quyết định và phạm vi MVP

GitHub quản lý yêu cầu, source, review, CI evidence, release và decision log. Vercel build trực tiếp từ đúng GitHub repository/commit; local chỉ dùng development/test, không phải release origin. Không upload `dist` hoặc deploy production thủ công làm provenance.

MVP governance gồm:

1. GitHub Issues + labels + milestone là hệ thống quản trị chính. GitHub Project trung tâm là portfolio enhancement được phép deferred theo quyết định CEO nếu OAuth Project v2 chưa được cấp.
2. Labels, milestone và issue contract thống nhất trên sáu repository.
3. Luồng bắt buộc `Issue → branch → PR → Actions → Vercel Preview → review → merge → Vercel Production → QA → Release`.
4. Repo templates/config version-controlled; settings/rules có readback.
5. Chuyển cả sáu repository sang private chỉ sau aggregate Vercel QA-PASS và xác minh Vercel GitHub App đọc được cả sáu repo.
6. Sau private-repo post-cutover QA-PASS, decommission GitHub Pages hoàn toàn. Old `thaitrn.github.io` URL được kỳ vọng 404/disabled; rollback dài hạn dùng Vercel known-good deployment.

Không thuộc MVP: đổi gameplay, tự thêm/xóa game, custom domain chưa được cấp, Wiki/Discussions làm source-of-truth, hoặc mua plan mà CEO chưa duyệt.

## 2. Audit readback GitHub hiện tại

Readback dùng GitHub REST API ngày 2026-08-30. Cả sáu repo đang `public`, default branch `main`, Issues/Projects/Wiki bật, Discussions tắt, Actions bật (`allowed_actions=all`), ruleset rỗng. Không bật thêm Wiki/Discussions.

| Repo | Issues / Projects | Wiki / Discussions | Actions / workflow readback | Security readback | Rulesets |
|---|---|---|---|---|---|
| `game3` | on / on | on / off | enabled; chưa có workflow | secret scanning + push protection enabled; Dependabot security updates và vulnerability alerts disabled | 0 |
| `babylon-pilot` | on / on | on / off | enabled; Pages generated workflow active | như trên | 0 |
| `maybay29` | on / on | on / off | enabled; Pages generated workflow active | như trên | 0 |
| `pixel-quest` | on / on | on / off | enabled; Pages generated workflow active | như trên | 0 |
| `gamehub` | on / on | on / off | enabled; Pages generated workflow active | như trên | 0 |
| `snake-neon` | on / on | on / off | enabled; Pages generated workflow active | như trên | 0 |

Code scanning không được claim: API readback hiện thiếu OAuth scope mà endpoint yêu cầu và chưa có CodeQL workflow. Secret-scanning alert API đọc được và trả 0 alert ở trang đầu cho cả sáu repo; con số đó không chứng minh toàn bộ lịch sử sạch nếu không có full-pagination/export.

### GitHub Pages source readback

| Repo | Pages state / source | Cleanup rule |
|---|---|---|
| `game3` | API 404: không có Pages site đọc được | Không có gì để xóa; recheck ở cutover. |
| `babylon-pilot` | built, legacy, `gh-pages:/` | Audit diff/tree chứng minh branch chỉ generated artifact rồi mới xóa branch. |
| `maybay29` | built, legacy, `main:/` | Chỉ disable Pages; tuyệt đối không xóa `main` hoặc source. Sau đó loại Pages-only config đã review. |
| `pixel-quest` | built, legacy, `main:/` | Như Maybay29. |
| `gamehub` | built, legacy, `gh-pages:/` | Audit generated branch rồi mới xóa `gh-pages`. |
| `snake-neon` | built, legacy, `main:/` | Chỉ disable Pages; không xóa source branch. |

Wiki đang bật do baseline nhưng không phải nguồn chính thống. Mọi PRD, ADR/Decision Log, runbook và release note phải nằm trong `docs/` của repo, được review như code. Có thể tắt Wiki ở implementation settings task sau khi kiểm tra không có nội dung độc lập cần migrate. Discussions giữ tắt để tránh phân mảnh triage.

## 3. Baseline GitHub Free: public so với private

CEO đã quyết định chuyển cả sáu repo từ public sang private sau aggregate Vercel QA-PASS. Vì vậy mọi control public-only có hạn dùng đến cutover.

| Capability | Public hiện tại trên GitHub Free | Private sau cutover trên GitHub Free | Quyết định |
|---|---|---|---|
| Actions standard hosted runners | Free cho public. | Dùng quota account: GitHub Free 2.000 phút/tháng, 500 MB artifact, 10 GB cache/repo; vượt quota bị tính phí hoặc block nếu không có payment method. | Dùng Ubuntu, concurrency cancel, cache có kiểm soát, artifact retention ngắn; theo dõi tổng sáu repo. |
| Pages | Có cho public. | GitHub Free yêu cầu source repo public; private Pages cần Pro/Team/Enterprise theo docs. | Không phụ thuộc Pages sau private. Decommission hoàn toàn sau private post-cutover QA. |
| Branch protection / rulesets | Docs cho phép public repo trên Free. | Protected branches và rulesets cho private cần Pro/Team/Enterprise. | Không claim required PR/check được nền tảng enforce sau private. Nếu cần hard enforcement: nâng GitHub Pro hoặc giữ process gate + restricted production credentials. |
| Secret scanning / push protection | Public repo được scan miễn phí; API hiện báo enabled. | Public-free entitlement không chuyển sang private user-owned GitHub Free. | Re-audit ngay sau private; không claim còn alerts/push protection. Giữ pre-commit/CI secret scan phù hợp quota và rotate nếu leak. |
| CodeQL/code scanning | Public repo có thể dùng miễn phí. | GitHub Free/Pro chỉ dùng code scanning cho public; private cần Team/Enterprise + GitHub Code Security. | Có thể triển khai trước cutover nhưng phải remove/disable expectation sau private hoặc mua license; không đặt làm permanent required check trên Free/private. |
| Dependabot | Alerts/security updates cần dependency graph + alerts; version/security update config bằng file/settings. | Phần core Dependabot phải readback riêng sau private; không đồng nhất với CodeQL/Secret Protection. | Bật dependency graph/alerts + security updates bằng settings, thêm weekly grouped `dependabot.yml`, rồi readback sau private. |

Nguồn chính thống ở §12. Không suy diễn capability ngoài tài liệu/readback.

## 4. GitHub Project trung tâm

Tên: **AI Company — Vercel Centralization**. Owner: `@thaitrn`. Project là portfolio view; issue trong từng repo vẫn là source-of-truth cho acceptance/evidence.

Fields tối thiểu:

| Field | Type | Options / rule |
|---|---|---|
| Status | single select | Backlog, Ready, In progress, Blocked, Review, QA, Done |
| Priority | single select | P0, P1, P2, P3 |
| Type | single select | Initiative, Feature, Task, Bug, Docs, Security |
| Product | single select | Game3, Babylon Pilot, Maybay29, Pixel Quest, GameHub, Snake Neon, Cross-product |
| Owner | assignees | GitHub assignee, không dùng free-text nickname |
| Release | iteration hoặc text | `Vercel Centralization`; release sau dùng tag/version thật |

Views: `Portfolio` group Product; `Delivery` board theo Status; `P0/P1`; `Private cutover`; `QA bugs`.

Active items phải add: initiative `gamehub#1`, sáu migration issues, ba Game3 QA bugs và Maybay29 durable API. Project automation chỉ hỗ trợ view; chuyển Done vẫn cần acceptance/evidence và QA/PM gate.

Trạng thái thực thi tại thời điểm tài liệu: project chưa thể tạo vì token GitHub CLI thiếu OAuth scopes `read:project` và `project`; `gh project list` trả lỗi yêu cầu `read:project`. CEO quyết định ngày 2026-08-30 không để OAuth tương tác chặn migration và chấp nhận **Project v2 DEFERRED**. Trong giai đoạn này, 11 issues, 17 labels/repo, milestone, PR/Actions/Vercel checks là hệ thống quản trị chính; các child migration không bị block.

Khi operator muốn enable portfolio view sau này: chạy `gh auth refresh -h github.com -s read:project -s project`, hoàn tất interactive web authorization, rồi tạo project theo schema ở trên và readback URL, node ID, sáu fields cùng item count. Không được tuyên bố Project đã tồn tại trước readback đó.

## 5. Labels, milestone và issue contract

### Labels chuẩn

- Type: `type:bug`, `type:feature`, `type:task`, `type:docs`, `type:security`
- Priority: `priority:p0`, `priority:p1`, `priority:p2`, `priority:p3`
- Area: `area:fe`, `area:be`, `area:qa`, `area:design`, `area:deploy`
- Status: `status:triage`, `status:blocked`, `status:ready`

Mỗi issue có đúng một type, một priority, ít nhất một area và một trạng thái. Status label thể hiện readiness ở repo; Project Status thể hiện delivery flow. Milestone chung trên từng repo: `Vercel Centralization`.

### Issue body bắt buộc

- Outcome/user value, không chỉ mô tả solution.
- Acceptance criteria dạng checkbox, đo được.
- Evidence links/source SHA/deployment nếu có.
- Owner GitHub thật.
- Kanban task ID và dependency/blocker.
- Security issue không đưa secret/PII/repro nguy hiểm công khai; dùng private advisory khi phù hợp.

### Active issue inventory đã tạo

| Repo | Issues |
|---|---|
| GameHub | `#1` initiative; `#2` GameHub migration |
| Game3 | `#1` migration; `#2–#4` BUG-QA-001/002/003 |
| Babylon Pilot | `#1` migration |
| Maybay29 | `#1` FE migration; `#2` durable API/persistence |
| Pixel Quest | `#1` migration |
| Snake Neon | `#1` migration |

Không có open issue trước khi tạo nên inventory không duplicate theo title/readback thời điểm thực thi.

## 6. Delivery workflow bắt buộc

### 6.1 Issue → branch

1. Triage xác nhận acceptance, dependency, priority, owner và Product.
2. Branch từ latest `main`: `feat/<issue>-slug`, `fix/<issue>-slug`, `docs/<issue>-slug`, `chore/<issue>-slug`.
3. Một branch/PR phải có một outcome chính; không trộn docs-only với code nếu repo policy yêu cầu evidence khác nhau.

### 6.2 Branch → PR → Preview

1. PR title theo Conventional Commits; body link `Fixes #<issue>` khi merge phải đóng issue. Nếu chỉ liên quan, dùng `Refs #<issue>`.
2. PR ghi acceptance mapping, test command/evidence, risk, rollback, screenshot/video cho UI, migration note cho data.
3. Actions chạy test/build trên pull request.
4. Vercel GitHub App tạo Preview từ đúng source commit. Reviewer kiểm SHA, URL, console/network, mobile path và scope preservation.
5. Không merge khi acceptance chưa có evidence, check đỏ, Preview không truy cập được, hoặc dependency còn blocked.

### 6.3 Merge → Production → QA → Release

1. Squash/merge vào `main`; merge commit phải chứa `Fixes #issue` hoặc PR body phải đóng issue.
2. Push/merge `main` tự trigger Vercel Production. Cấm upload artifact hoặc production CLI deploy không có GitHub provenance.
3. Readback deployment: repo, ref `main`, GitHub SHA, deployment/check URL, Vercel deployment ID và canonical URL.
4. QA chạy production journey; API cần write→cold/new request→read để chứng minh durable persistence.
5. PM/BA đối chiếu acceptance và scope; QA-PASS không thay PM acceptance.
6. Release owner tạo tag/release chỉ sau QA + PM pass.

## 7. Release, tag và changelog

- SemVer cho release có version: `vMAJOR.MINOR.PATCH`; migration-only lần đầu có thể `v1.0.0-vercel.1` trước stable nếu repo chưa có version policy.
- Annotated tag phải trỏ đúng production source SHA. GitHub Release ghi Added/Changed/Fixed/Security, issue/PR links, canonical URL, deployment ID, known risks và rollback SHA.
- `CHANGELOG.md` theo Keep a Changelog nếu sản phẩm có cadence nhiều release; repo nhỏ vẫn phải có GitHub Release note. Không tạo changelog entry từ commit chưa production QA-PASS.
- Hotfix vẫn đi Issue → PR → CI/Preview → merge → Production; nếu emergency bypass do control không enforce được, ghi Decision Log và retrospective trong 24 giờ.

## 8. Bug triage

| Priority | Điều kiện | SLA vận hành |
|---|---|---|
| P0 | production unavailable, data loss/corruption, active secret/security incident | block release; owner ngay; rollback/contain trước |
| P1 | core loop/payment-equivalent flow/API persistence bị chặn, nhiều user ảnh hưởng | release blocker; fix/retest trong current cycle |
| P2 | degraded non-core behavior có workaround | schedule release gần nhất |
| P3 | cosmetic/minor polish | backlog, không chen MVP |

Triage cần Expected vs Actual, deterministic repro, environment/device, source/deployment SHA, evidence artifact/log đã sanitize, impact, regression acceptance và owner. `status:blocked` phải nêu dependency cụ thể; không dùng làm chỗ chứa issue mơ hồ.

## 9. Repo templates/config implementation contract

### File-based, phải commit qua PR ở từng repo

- `.github/ISSUE_TEMPLATE/01-bug.yml`, `02-feature.yml`, `03-task.yml`, `config.yml` (`blank_issues_enabled: false`).
- `.github/pull_request_template.md` với Issue, acceptance mapping, evidence, Preview, risk/rollback, security checklist.
- `.github/CODEOWNERS`: `* @thaitrn`; thêm path owner chỉ khi account/team thật đã có quyền. Trên personal GitHub Free/private, CODEOWNERS vẫn là routing file nhưng không claim review enforcement.
- `CONTRIBUTING.md`, `SECURITY.md` (private reporting path; không hứa SLA/support chưa có).
- `.github/dependabot.yml`: npm + github-actions, weekly, grouped per ecosystem, PR limit nhỏ.
- `.github/workflows/ci.yml`: least-privilege `contents: read`, pinned major actions, concurrency cancel, clean install/test/build.
- CodeQL workflow chỉ khi repo còn public hoặc có paid Code Security; không coi là permanent private-Free control.

### API/settings-based, phải readback sau write

- Issues/Projects feature state; Wiki decision; Discussions giữ off.
- Actions permissions và workflow token read-only mặc định.
- Dependency graph, Dependabot alerts, Dependabot security updates.
- Secret scanning/push protection khi entitlement cho phép.
- Branch protection/ruleset `main`: PR + required CI checks + no force-push/delete, nhưng chỉ triển khai/enforce khi plan hỗ trợ. Public transition có thể bật sau khi CI check names đã chạy; private Free cần GitHub Pro hoặc process alternative.
- Vercel GitHub App repository access và Git link/production branch.
- Pages disablement và `gh-pages` cleanup sau final gate.

Không tạo required check trước khi check đó đã xuất hiện trên `main`, tránh khóa repository. Không bật paid/public-only feature rồi tuyên bố nó sẽ sống qua private cutover.

## 10. CI / Vercel handoff matrix

Check name là contract đề xuất ổn định; implementation phải readback tên thực từ PR check run trước khi cấu hình ruleset.

| Repo / root | Clean install | CI commands | Build/output | Proposed check(s) | Vercel setting |
|---|---|---|---|---|---|
| `game3` root + `fe/` | `npm ci`; `npm --prefix fe ci` | `npm test`; `npm --prefix fe test`; `npm --prefix fe run build` | root build `npm --prefix fe run build`; `fe/dist` | `CI / api-tests`, `CI / fe-tests` | repo `thaitrn/game3`, branch `main`, root `.`, framework Other |
| `babylon-pilot` `.` | `npm ci` | `npm test`; `npm run build`; `npm run smoke` (smoke cần runtime/browser phù hợp) | `npm run build`; `dist` | `CI / test-build` | repo/`main`, root `.`, Vite |
| `maybay29` `fe/` | `npm ci` | hiện `npm test` cố ý fail vì chưa có test; implementation phải thêm meaningful test hoặc tạm dùng `npm run typecheck && npm run build` với risk ghi rõ | `npm run build`; `dist` | `CI / maybay-fe` | repo/`main`, root `fe`, Vite |
| `maybay29` `be/` | `npm ci` | `npm test` | Vercel Function; không static output | `CI / maybay-api` | cùng repo/`main`, root `be`, Fastify/Functions, `DATABASE_URL` |
| `pixel-quest` `fe/` | `npm ci` | candidate local: `npm test`; `npm run build`; remote `main` chưa chứa manifest tại audit nên phải land source trước | `npm run build`; `dist` | `CI / test-build` | repo/`main`, root `fe`, Vite |
| `gamehub` `.` | `npm ci` | `npm test`; `npm run build` | `npm run build`; `dist` | `CI / test-build` | repo/`main`, root `.`, Vite |
| `snake-neon` `.` | `npm ci` | manifest hiện không có scripts; implementation phải thêm deterministic `test` + `build` và allowlist runtime | `npm run build`; `dist` | `CI / test-build` | repo/`main`, root `.`, Other/static |

Vercel check/status name không hardcode trước readback. Mỗi repo phải ghi tên check thực (`Vercel`/project-specific deployment check), Preview URL, production deployment check và source SHA. Nếu dùng ruleset trong public transition, required checks tối thiểu là CI check tương ứng và Vercel deployment check đã quan sát thật.

GitHub Free private quota controls: Ubuntu only nếu không có lý do khác, `timeout-minutes`, `concurrency.cancel-in-progress: true`, không upload `dist` mặc định, retention 3–7 ngày cho evidence cần thiết, Dependabot weekly. Vercel build không thay test CI; CI không thay production QA.

## 11. Private cutover và Pages decommission

### Gate A — trước khi đổi visibility

- Cả bảy Vercel Projects (Maybay tách FE/API) READY từ đúng GitHub `main` SHA; canonical public không SSO.
- Aggregate QA-PASS + PM acceptance; GameHub đã trỏ only approved products sang Vercel.
- Vercel GitHub App installation được cấp access đúng sáu repo. Personal repos yêu cầu owner để connect; readback App installation/repository selection.
- Ghi baseline Actions usage, branch/ruleset/security entitlement và Pages source.
- Vercel known-good rollback deployment ID/SHA cho từng product.

### Gate B — private cutover tuần tự

1. Đổi repo ít rủi ro; REST readback `visibility=private`.
2. Merge một docs/no-op change hợp lệ vào `main`; chứng minh Vercel tự deploy đúng post-private SHA.
3. Public canonical smoke + QA path; security/settings readback lại.
4. Fail thì dừng sequence, sửa App access hoặc tạm rollback visibility; không chuyển repo kế tiếp.
5. Maybay FE/API cùng repo cần cả hai Vercel Projects auto-deploy; GameHub chuyển cuối.

### Gate C — decommission Pages sau private post-cutover QA-PASS

1. Re-read Pages source, branch protections, default branch và Vercel rollback.
2. Nếu Pages source là `main`, chỉ disable Pages qua settings/API; không xóa/rename branch hoặc source code.
3. Nếu source là `gh-pages`, compare tree/history và chứng minh chỉ generated artifact. Có source/manual content thì migrate trước; chỉ generated mới được xóa branch.
4. Remove Pages-only workflows/config/base paths qua PR, không xóa config còn cần Vercel.
5. Verify canonical Vercel still 200/core journey pass; old `https://thaitrn.github.io/<repo>/` expected 404/disabled.
6. Record cleanup issue/PR/SHA/readback. Vercel known-good deployment là rollback duy nhất; không giữ Pages dài hạn.

## 12. Nguồn chính thống

- GitHub plans: https://docs.github.com/get-started/learning-about-github/githubs-products
- GitHub Actions billing/quota: https://docs.github.com/billing/managing-billing-for-your-products/managing-billing-for-github-actions/about-billing-for-github-actions
- Issue forms: https://docs.github.com/communities/using-templates-to-encourage-useful-issues-and-pull-requests/configuring-issue-templates-for-your-repository
- Rulesets availability: https://docs.github.com/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/about-rulesets
- Protected branches availability: https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/managing-a-branch-protection-rule
- GitHub Pages plan/source visibility: https://docs.github.com/pages/getting-started-with-github-pages/creating-a-github-pages-site
- Secret scanning availability: https://docs.github.com/code-security/concepts/secret-security/secret-scanning
- CodeQL private limitation: https://docs.github.com/code-security/reference/code-scanning/troubleshoot-analysis-errors/private-repository-enablement
- Dependabot security updates: https://docs.github.com/code-security/concepts/supply-chain-security/dependabot-security-updates
- Vercel GitHub integration/permissions: https://vercel.com/docs/git/vercel-for-github

## 13. Gate verdict

`GH-GOVERNANCE-READY` được cấp khi đồng thời có:

- 17 labels + milestone readback trên cả sáu repo.
- 11 active issue URLs/readback, không duplicate.
- Commit SHA + GitHub blob URL của tài liệu này.
- Handoff CI/build/check matrix đến implementation owners.
- Project v2 có URL/node ID, sáu fields và active item readback; **hoặc** có quyết định CEO cho phép deferred kèm evidence thiếu OAuth scopes và hướng dẫn enable sau.

Quyết định CEO ngày 2026-08-30 áp dụng nhánh deferred: Project v2 không phải blocker. Final verification vẫn phải readback labels, milestones, issues, commit/blob URL và xác nhận handoff của sáu child tasks trước khi cấp verdict.
