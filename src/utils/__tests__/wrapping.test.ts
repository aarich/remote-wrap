import {
  dbValueToWrapState as _dbValueToWrapState,
  FULLY_UNWRAPPED_DB_VALUE,
  FULLY_UNWRAPPED_STATE,
  FULLY_WRAPPED_DB_VALUE,
  FULLY_WRAPPED_STATE,
  wrapStateToDbValue,
} from '..';

const WIDTH = 6;
const dbValueToWrapState = (state: string) => _dbValueToWrapState(state, WIDTH);

describe('db to state', () => {
  test('wrapped state', () => {
    const state = dbValueToWrapState(FULLY_WRAPPED_DB_VALUE);
    expect(state).toBe(FULLY_WRAPPED_STATE);
  });

  test('unwrapped state', () => {
    const state = dbValueToWrapState(FULLY_UNWRAPPED_DB_VALUE);
    expect(state).toBe(FULLY_UNWRAPPED_STATE);
  });

  test('bottom right', () => {
    const state = dbValueToWrapState('AAAAAAAB') as boolean[][];

    expect(state).toHaveLength(WIDTH);
    state.forEach((row, index) => {
      expect(row).toHaveLength(WIDTH);
      if (index !== WIDTH - 1) {
        row.forEach((val) => expect(val).toBe(false));
      } else {
        const expected = new Array(WIDTH).fill(false);
        expected[WIDTH - 1] = true;

        expect(row).toEqual(expected);
      }
    });
  });
});

describe('matrix to hex', () => {
  let allCovered: boolean[][];
  let allUncovered: boolean[][];

  const random: boolean[][] = [];
  for (let i = 0; i < WIDTH; i++) {
    const row: boolean[] = [];
    for (let j = 0; j < WIDTH; j++) {
      row.push(Math.random() > 0.5);
    }
    random.push(row);
  }

  beforeEach(() => {
    allCovered = new Array(WIDTH)
      .fill([])
      .map(() => new Array(WIDTH).fill(true));
    allUncovered = new Array(WIDTH)
      .fill([])
      .map(() => new Array(WIDTH).fill(false));
  });

  test('initial state', () => {
    const state = wrapStateToDbValue(allCovered);

    expect(state).toBe(FULLY_WRAPPED_DB_VALUE);

    const matrix = dbValueToWrapState(state);
    expect(matrix).toEqual(FULLY_WRAPPED_STATE);
  });

  test('allUncovered', () => {
    const state = wrapStateToDbValue(allUncovered);
    expect(state).toBe(FULLY_UNWRAPPED_DB_VALUE);

    const matrix = dbValueToWrapState(state);
    expect(matrix).toEqual(FULLY_UNWRAPPED_STATE);
  });

  test('one covered', () => {
    allCovered[0][0] = false;
    const state = wrapStateToDbValue(allCovered);

    expect(state).toBe('Hz8/Pz8/');
  });

  test(
    'encode/decode ' + random.map((row) => row.map((b) => (b ? 1 : 0))),
    () => {
      const state = wrapStateToDbValue(random);
      const matrix = dbValueToWrapState(state);
      expect(matrix).toEqual(random);
    }
  );
});
