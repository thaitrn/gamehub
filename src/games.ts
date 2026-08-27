export type GameStatus = 'Live' | 'Pilot';

export interface Game {
  id: 'pixel-quest' | 'maybay29' | 'babylon-pilot';
  name: string;
  shortDescription: string;
  status: GameStatus;
  tags: readonly string[];
  art: 'quest' | 'flight' | 'babylon';
  coverAlt: string;
  playUrl: string;
  ctaLabel: 'Chơi ngay' | 'Trải nghiệm pilot';
  published: true;
  sortOrder: number;
  owner: string;
  lastVerifiedAt: string;
}

/** Public inventory: add records only after the publish checklist in README is complete. */
export const games: readonly Game[] = [
  {
    id: 'pixel-quest',
    name: 'Pixel Quest',
    shortDescription: 'Một chuyến phiêu lưu pixel gọn nhẹ, sẵn sàng để bạn bắt đầu ngay.',
    status: 'Live',
    tags: ['Phiêu lưu', 'Pixel'],
    art: 'quest',
    coverAlt: 'Minh hoạ pixel trừu tượng với mặt trời và địa hình phiêu lưu.',
    playUrl: 'https://thaitrn.github.io/pixel-quest/',
    ctaLabel: 'Chơi ngay',
    published: true,
    sortOrder: 1,
    owner: 'Product owner',
    lastVerifiedAt: '2026-08-27',
  },
  {
    id: 'maybay29',
    name: 'Máy Bay Mừng 2/9',
    shortDescription: 'Cất cánh trong một trải nghiệm bay vui nhộn, lấy cảm hứng từ ngày hội.',
    status: 'Live',
    tags: ['Bay lượn', 'Nhịp độ nhanh'],
    art: 'flight',
    coverAlt: 'Minh hoạ máy bay giấy trừu tượng bay qua các đám mây.',
    playUrl: 'https://thaitrn.github.io/maybay29/',
    ctaLabel: 'Chơi ngay',
    published: true,
    sortOrder: 2,
    owner: 'Product owner',
    lastVerifiedAt: '2026-08-27',
  },
  {
    id: 'babylon-pilot',
    name: 'Babylon Pilot',
    shortDescription: 'Bản trải nghiệm thử nghiệm cho hành trình khám phá thế giới Babylon.',
    status: 'Pilot',
    tags: ['Pilot', 'Khám phá'],
    art: 'babylon',
    coverAlt: 'Minh hoạ kiến trúc cổ điển trừu tượng và vầng trăng.',
    playUrl: 'https://thaitrn.github.io/babylon-pilot/',
    ctaLabel: 'Trải nghiệm pilot',
    published: true,
    sortOrder: 3,
    owner: 'Product owner',
    lastVerifiedAt: '2026-08-27',
  },
] as const;
