import { FieldValue } from '@firebase/firestore';

export type Gift = {
  id: string;
  title: string;
  message?: string;
  age?: number;
  createdById: string;
  photoURL: string;
  following: string[];
  createdOn: FieldValue;
};
