import { deleteDoc, doc } from '@firebase/firestore';
import { deleteObject, getDownloadURL, ref } from '@firebase/storage';
import { v4 as uuid } from 'uuid';
import { Gift } from '.';
import { firestore, storage } from '../config';

export const makeName = (uid?: string) => `images/${uid || uuid()}`;

export const makeRef = (photoUID: string) => ref(storage, makeName(photoUID));

export const deleteImageFromFirebase = (photoUID: string) =>
  deleteObject(makeRef(photoUID));

export const getImageURL = (photoUID: string) =>
  getDownloadURL(makeRef(photoUID));

export const deleteGift = (gift: Gift) =>
  deleteImageFromFirebase(gift.photoUID).then(() =>
    deleteDoc(doc(firestore, 'gifts', gift.id))
  );
