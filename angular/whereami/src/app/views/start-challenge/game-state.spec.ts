import {GameState, RoundState} from '../../model/status/game-state';

describe('GameState', () => {
  it('should create an instance', () => {
    expect(new GameState(new RoundState(0, 0))).toBeTruthy();
  });
});
