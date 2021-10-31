import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  QueryConstraint,
  where,
} from '@firebase/firestore';
import { StackActions, useNavigation } from '@react-navigation/core';
import React, { useCallback, useEffect, useState } from 'react';
import { ViewAll } from '../../components/gifts';
import { firestore } from '../../config';
import { useCurrentUser, usePrompt, useToast } from '../../providers';
import { Gift } from '../../utils';

const snapshot = (
  queryConstraint: QueryConstraint,
  setter: (gifts: Gift[]) => void,
  userId?: string
) => {
  if (!userId) {
    return;
  }

  const unsubscribe = onSnapshot(
    query(collection(firestore, 'gifts'), queryConstraint),
    (snapshot) => {
      const received = [];
      snapshot.forEach((doc) => {
        const id = doc.id;
        received.push({ ...doc.data(), id });
      });
      setter(received);
    },
    (error) => console.log(error)
  );

  return () => unsubscribe();
};

export const ViewAllContainer = () => {
  const toast = useToast();
  const prompt = usePrompt();
  const naviation = useNavigation();
  const userId = useCurrentUser()?.uid;
  const [myGifts, setMyGifts] = useState<Gift[]>([]);
  const [followingGifts, setFollowingGifts] = useState<Gift[]>([]);

  // Load gifts created by me
  useEffect(
    () => snapshot(where('createdById', '==', userId), setMyGifts, userId),
    [userId]
  );

  // Load gifts I'm following
  useEffect(
    () =>
      snapshot(
        where('following', 'array-contains', userId),
        setFollowingGifts,
        userId
      ),
    [userId]
  );

  const onDeleteGift = useCallback(
    (giftId: string) => {
      const deleteFn = () =>
        deleteDoc(doc(firestore, 'gifts', giftId)).then(() =>
          toast({ text: `Deleted gift.` })
        );
      prompt({
        title: 'Are you sure',
        message: 'Everyone will lose access immediately',
        actions: [{ text: 'Delete', onPress: deleteFn }, { text: 'Cancel' }],
      });
    },
    [prompt, toast]
  );

  const onNavigateToGift = useCallback(
    (id: string) => naviation.dispatch(StackActions.push('View', { id })),
    [naviation]
  );

  return (
    <ViewAll
      myGifts={myGifts}
      followingGifts={followingGifts}
      onDeleteGift={onDeleteGift}
      onNavigateToGift={onNavigateToGift}
    />
  );
};
