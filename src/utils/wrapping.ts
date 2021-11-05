import { Base64 } from 'js-base64';
import { Images } from '../config';
import {
  FULLY_UNWRAPPED_STATE,
  FULLY_WRAPPED_STATE,
  StandardWrap,
  WrapState,
} from './types';

export const getImageFromWrap = (wrap: StandardWrap) => {
  switch (wrap) {
    case StandardWrap.CHRISTMAS_1:
      return Images.wrapping1;
    case StandardWrap.CHRISTMAS_2:
      return Images.wrapping2;
    case StandardWrap.CHRISTMAS_3:
      return Images.wrapping3;
    case StandardWrap.CHRISTMAS_4:
      return Images.wrapping11;
    case StandardWrap.HOLIDAY_1:
      return Images.wrapping4;
    case StandardWrap.HOLIDAY_2:
      return Images.wrapping5;
    case StandardWrap.HOLIDAY_3:
      return Images.wrapping7;
    case StandardWrap.BANANA:
      return Images.wrapping6;
    case StandardWrap.FLOWERS:
      return Images.wrapping8;
    case StandardWrap.PAPER:
      return Images.wrapping9;
    case StandardWrap.CONGRATS:
      return Images.wrapping10;
  }
};

export const WRAP_WIDTH = 15;
export const FULLY_WRAPPED_DB_VALUE = '';
export const FULLY_UNWRAPPED_DB_VALUE = 'X';

/**
 * @returns a matrix of 100x100 grid of true/false. true means covered
 */
export const dbValueToWrapState = (
  wrapState: string,
  width = WRAP_WIDTH
): WrapState => {
  if (wrapState === FULLY_WRAPPED_DB_VALUE) {
    return FULLY_WRAPPED_STATE;
  } else if (wrapState === FULLY_UNWRAPPED_DB_VALUE) {
    return FULLY_UNWRAPPED_STATE;
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

export const wrapStateToDbValue = (wrapState: WrapState): string => {
  // It's all covered
  if (typeof wrapState === 'boolean') {
    switch (wrapState) {
      case FULLY_WRAPPED_STATE:
        return FULLY_WRAPPED_DB_VALUE;
      case FULLY_UNWRAPPED_STATE:
        return FULLY_UNWRAPPED_DB_VALUE;
    }
  }

  if (wrapState.every((row) => row.every((b) => b))) {
    return FULLY_WRAPPED_DB_VALUE;
  } else if (wrapState.every((row) => row.every((b) => !b))) {
    return FULLY_UNWRAPPED_DB_VALUE;
  }

  const bits = 6;

  const flattened: boolean[] = [];
  wrapState.forEach((row) => row.forEach((b) => flattened.push(b)));

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
