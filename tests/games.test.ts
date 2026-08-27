import { describe, expect, it } from 'vitest';
import { games } from '../src/games';

describe('public game inventory', () => {
  it('publishes only the three verified game records in the prescribed status order', () => {
    expect(games.map(({ id, status, published }) => ({ id, status, published }))).toEqual([
      { id: 'pixel-quest', status: 'Live', published: true },
      { id: 'maybay29', status: 'Live', published: true },
      { id: 'babylon-pilot', status: 'Pilot', published: true },
    ]);
  });

  it('uses canonical HTTPS play URLs only for publicly playable records', () => {
    for (const game of games) {
      expect(game.playUrl).toMatch(/^https:\/\//);
      expect(game.ctaLabel).toMatch(/Chơi ngay|Trải nghiệm pilot/);
    }
  });

  it('does not expose the pending QC/deploy product in public metadata', () => {
    expect(JSON.stringify(games)).not.toContain('Tàu Vũ Trụ Cộng Số');
  });
});
