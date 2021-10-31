import { Base64 } from 'js-base64';
import { Images } from '../config';
import { StandardWrap } from './types';

export const getImageFromWrap = (wrap: StandardWrap) => {
  switch (wrap) {
    case StandardWrap.CHRISTMAS_1:
      return Images.wrapping1;
    case StandardWrap.CHRISTMAS_2:
      return Images.wrapping2;
    case StandardWrap.CHRISTMAS_3:
      return Images.wrapping3;
    case StandardWrap.HOLIDAY_1:
      return Images.wrapping4;
    case StandardWrap.HOLIDAY_2:
      return Images.wrapping5;
  }
};

export const WRAP_WIDTH = 100;
export const INITIAL_WRAP_STATE = '';

/**
 * @returns a matrix of 100x100 grid of true/false. true means covered
 */
export const wrapStateToMatrix = (
  wrapState: string,
  width = WRAP_WIDTH
): boolean[][] => {
  if (wrapState === INITIAL_WRAP_STATE) {
    return new Array(width).fill(new Array(width).fill(true));
  }
  const u8s = Base64.toUint8Array(wrapState);

  const flattened: boolean[] = [];
  for (const int of u8s) {
    const binary = int.toString(2).padStart(6, '0');
    for (const b of binary) {
      flattened.push(b === '1');
    }
  }

  const matrix: boolean[][] = [];
  let currentRow: boolean[] = [];
  for (const b of flattened) {
    currentRow.push(b);
    if (currentRow.length === width) {
      matrix.push(currentRow);
      currentRow = [];
    }
  }

  return matrix;
};

export const matrixToWrapState = (matrix: boolean[][]): string => {
  // It's all covered
  if (matrix.every((row) => row.every((b) => b))) {
    return INITIAL_WRAP_STATE;
  }

  const bits = 6;

  const flattened: boolean[] = [];
  matrix.forEach((row) => row.forEach((b) => flattened.push(b)));

  const intArray: number[] = [];
  for (let i = 0; i < flattened.length; i += bits) {
    let int = 0;
    for (let j = bits - 1; j >= 0; j--) {
      int += flattened[i + j] ? Math.pow(2, bits - 1 - j) : 0;
    }

    intArray.push(int);
  }

  const u8s: Uint8Array = new Uint8Array(intArray);

  return Base64.fromUint8Array(u8s);
};
