export type GameStatus = 'Live' | 'Pilot';

export interface Game {
  id: 'pixel-quest' | 'game3' | 'babylon-pilot';
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
    shortDescription:
      'Game platformer pixel-art trên web: chọn chế độ, vượt màn, thu thập vật phẩm và chinh phục bảng xếp hạng.',
    status: 'Live',
    tags: ['Platformer', 'Pixel Art', 'Web Game'],
    art: 'quest',
    coverAlt: 'Ảnh bìa game platformer Pixel Quest phong cách pixel-art.',
    playUrl: 'https://thaitrn.github.io/pixel-quest/',
    ctaLabel: 'Chơi ngay',
    published: true,
    sortOrder: 1,
    owner: 'thaitrn',
    lastVerifiedAt: '2026-08-30',
  },
  {
    id: 'game3',
    name: 'Tàu Vũ Trụ Cộng Số',
    shortDescription: 'Lái tàu bằng một ngón, né thiên thạch, nhặt sao và giải toán cộng trừ trong phạm vi 100.',
    status: 'Live',
    tags: ['Giáo dục', 'Toán học'],
    art: 'flight',
    coverAlt: 'Minh hoạ tàu vũ trụ bay giữa các vì sao và thiên thạch.',
    playUrl: 'https://game3-sandy-eta.vercel.app',
    ctaLabel: 'Chơi ngay',
    published: true,
    sortOrder: 2,
    owner: 'Product owner',
    lastVerifiedAt: '2026-08-30',
  },
  {
    id: 'babylon-pilot',
    name: 'Khoa học lung linh',
    shortDescription: 'Chạm hoặc click để thu thập 10 linh thể phát sáng giữa cực quang hạt 3D.',
    status: 'Pilot',
    tags: ['3D', 'Babylon.js', 'WebGPU', 'WebGL2', 'Particle', 'Interactive', 'Mobile'],
    art: 'babylon',
    coverAlt: 'Minh hoạ các linh thể phát sáng giữa cực quang hạt trong không gian 3D.',
    playUrl: 'https://thaitrn.github.io/babylon-pilot/',
    ctaLabel: 'Trải nghiệm pilot',
    published: true,
    sortOrder: 3,
    owner: 'Product owner',
    lastVerifiedAt: '2026-08-30',
  },
] as const;
