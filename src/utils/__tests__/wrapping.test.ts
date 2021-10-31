import {
  INITIAL_WRAP_STATE,
  matrixToWrapState,
  wrapStateToMatrix as _wrapStateToMatrix,
} from '..';

const WIDTH = 6;
const wrapStateToMatrix = (state: string) => _wrapStateToMatrix(state, WIDTH);

describe('hex to matrix', () => {
  test('initial state', () => {
    const matrix = wrapStateToMatrix(INITIAL_WRAP_STATE);

    expect(matrix).toHaveLength(WIDTH);
    matrix.forEach((row) => {
      expect(row).toHaveLength(WIDTH);
      row.forEach((val) => expect(val).toBe(true));
    });
  });

  test('bottom right', () => {
    const matrix = wrapStateToMatrix('AAAAAAAB');

    expect(matrix).toHaveLength(WIDTH);
    matrix.forEach((row, index) => {
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

  const random = [];
  for (let i = 0; i < WIDTH; i++) {
    const row = [];
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
    const state = matrixToWrapState(allCovered);

    expect(state).toBe(INITIAL_WRAP_STATE);

    const matrix = wrapStateToMatrix(state);
    expect(matrix).toEqual(allCovered);
  });

  test('allUncovered', () => {
    const state = matrixToWrapState(allUncovered);
    expect(state).toBe('AAAAAAAA');

    const matrix = wrapStateToMatrix(state);
    expect(matrix).toEqual(allUncovered);
  });

  test('one covered', () => {
    allCovered[0][0] = false;
    const state = matrixToWrapState(allCovered);

    expect(state).toBe('Hz8/Pz8/');
  });

  test(
    'encode/decode ' + random.map((row) => row.map((b) => (b ? 1 : 0))),
    () => {
      const state = matrixToWrapState(random);
      const matrix = wrapStateToMatrix(state);
      expect(matrix).toEqual(random);
    }
  );
});
