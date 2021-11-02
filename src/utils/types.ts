import { FieldValue } from '@firebase/firestore';

export type Gift = {
  id: string;
  title: string;
  message?: string;
  age?: number;
  createdById: string;
  photoUID: string;
  wrapUID: string;
  following: string[];
  createdOn: FieldValue;
  wrapState: string;
};

export enum StandardWrap {
  CHRISTMAS_1 = 'C1',
  CHRISTMAS_2 = 'C2',
  CHRISTMAS_3 = 'C3',
  HOLIDAY_1 = 'H1',
  HOLIDAY_2 = 'H2',
}

export const FULLY_WRAPPED_STATE = true;
export const FULLY_UNWRAPPED_STATE = false;
export type WrapState = boolean[][] | boolean;
