import {
  collection,
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
import { deleteGift, Gift, toggleFollow } from '../../utils';

const snapshot = (
  actionMessage: string,
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
      console.log(`received ${snapshot.size} docs for ${actionMessage}`);
      const received = [];
      snapshot.forEach((doc) => {
        const id = doc.id;
        received.push({ ...doc.data(), id });
      });
      setter(received);
    },
    (error) => console.error(actionMessage, error)
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
    () =>
      snapshot(
        `created by ${userId}`,
        where('createdById', '==', userId),
        setMyGifts,
        userId
      ),
    [userId]
  );

  // Load gifts I'm following
  useEffect(
    () =>
      snapshot(
        `followed by ${userId}`,
        where('following', 'array-contains', userId),
        setFollowingGifts,
        userId
      ),
    [userId]
  );

  const onDeleteGift = useCallback(
    (gift: Gift) =>
      prompt({
        title: 'Are you sure?',
        message: 'Everyone will lose access immediately',
        actions: [
          {
            text: 'Delete',
            onPress: () =>
              deleteGift(gift).then(() => toast({ text: `Deleted gift.` })),
          },
          { text: 'Cancel' },
        ],
      }),
    [prompt, toast]
  );

  const onUnfollowGift = useCallback(
    (gift: Gift) =>
      prompt({
        title: 'Remove',
        message:
          'Remove this gift from your collection. Everybody else will still have access.',
        actions: [
          {
            text: 'Remove',
            onPress: () =>
              toggleFollow(gift, userId, false).then(() =>
                toast({ text: 'Removed gift.' })
              ),
          },
          { text: 'Cancel' },
        ],
      }),
    [prompt, toast, userId]
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
      onUnfollowGift={onUnfollowGift}
    />
  );
};
