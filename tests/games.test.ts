import { describe, expect, it } from 'vitest';
import { games } from '../src/games';

describe('public game inventory', () => {
  it('publishes only the three verified game records in the prescribed status order', () => {
    expect(games.map(({ id, status, published }) => ({ id, status, published }))).toEqual([
      { id: 'pixel-quest', status: 'Live', published: true },
      { id: 'game3', status: 'Live', published: true },
      { id: 'babylon-pilot', status: 'Pilot', published: true },
    ]);
  });

  it('uses canonical HTTPS play URLs only for publicly playable records', () => {
    expect(games.map((game) => game.playUrl)).toEqual([
      'https://thais-mac-mini.tail6e29ae.ts.net/pixel-quest/',
      'https://thais-mac-mini.tail6e29ae.ts.net/game3/',
      'https://thais-mac-mini.tail6e29ae.ts.net/babylon-pilot/',
    ]);
    for (const game of games) {
      expect(game.playUrl).toMatch(/^https:\/\//);
      expect(game.ctaLabel).toMatch(/Chơi ngay|Trải nghiệm pilot/);
    }
  });

  it('does not expose the removed maybay29 product in public metadata', () => {
    expect(JSON.stringify(games)).not.toContain('maybay29');
    expect(JSON.stringify(games)).toContain('Tàu Vũ Trụ Cộng Số');
  });
});
