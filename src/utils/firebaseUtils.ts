import { deleteDoc, doc, updateDoc } from '@firebase/firestore';
import { deleteObject, getDownloadURL, ref } from '@firebase/storage';
import { v4 as uuid } from 'uuid';
import { firestore, storage } from '../config';
import { deleteCachedImage } from './image';
import { Gift, StandardWrap } from './types';

export const makeName = (uid?: string) => `images/${uid || uuid()}`;

export const makeRef = (photoUID: string) => ref(storage, makeName(photoUID));

export const deleteImage = (photoUID: string) =>
  deleteObject(makeRef(photoUID)).then(() => deleteCachedImage(photoUID));

export const getImageURL = (photoUID: string) =>
  getDownloadURL(makeRef(photoUID));

export const deleteGift = (gift: Gift) =>
  deleteDoc(doc(firestore, 'gifts', gift.id))
    .then(() => deleteImage(gift.photoUID))
    .then(
      () =>
        !Object.values(StandardWrap).includes(gift.wrapUID as StandardWrap) &&
        deleteImage(gift.wrapUID)
    );

export const toggleFollow = (gift: Gift, userId: string, follow: boolean) => {
  const updates: Partial<Gift> = {
    following: follow
      ? [...gift.following, userId]
      : gift.following.filter((id) => userId !== id),
  };

  const giftRef = doc(firestore, 'gifts', gift.id);
  return updateDoc(giftRef, updates)
    .then(() => console.log(`${follow ? 'Added' : 'Removed'} follow`))
    .catch((error) =>
      console.warn(`Failed to ${follow ? 'add' : 'remove'} follow`, error)
    );
};
