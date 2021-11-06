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
import { NavProp } from '../../navigation/AppStack';
import { useCurrentUser, usePrompt, useToast } from '../../providers';
import { deleteGift, Gift, toggleFollow } from '../../utils';

const snapshot = (
  actionMessage: string,
  queryConstraint: QueryConstraint,
  setter: (gifts: Gift[]) => void,
  userId?: string
) => {
  if (!userId) {
    setter([]);
    return;
  }

  const unsubscribe = onSnapshot(
    query(collection(firestore, 'gifts'), queryConstraint),
    (snapshot) => {
      console.log(`received ${snapshot.size} docs for ${actionMessage}`);
      const received: Gift[] = [];
      snapshot.forEach((doc) => {
        const id = doc.id;
        // @ts-ignore
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
  const navigation = useNavigation<NavProp<never>>();
  const user = useCurrentUser();
  const [myGifts, setMyGifts] = useState<Gift[]>([]);
  const [followingGifts, setFollowingGifts] = useState<Gift[]>([]);

  // Load gifts created by me
  useEffect(
    () =>
      snapshot(
        `created by ${user?.uid}`,
        where('createdById', '==', user?.uid),
        setMyGifts,
        user?.uid
      ),
    [user?.uid]
  );

  // Load gifts I'm following
  useEffect(
    () =>
      snapshot(
        `followed by ${user?.uid}`,
        where('following', 'array-contains', user?.uid),
        setFollowingGifts,
        user?.uid
      ),
    [user?.uid]
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
      user &&
      prompt({
        title: 'Remove',
        message:
          'Remove this gift from your collection. Everybody else will still have access.',
        actions: [
          {
            text: 'Remove',
            onPress: () =>
              toggleFollow(gift, user.uid, false).then(() =>
                toast({ text: 'Removed gift.' })
              ),
          },
          { text: 'Cancel' },
        ],
      }),
    [prompt, toast, user]
  );

  const onNavigateToGift = useCallback(
    (id: string) => navigation.dispatch(StackActions.push('View', { id })),
    [navigation]
  );

  return (
    <ViewAll
      myGifts={myGifts}
      followingGifts={followingGifts}
      onDeleteGift={onDeleteGift}
      onUnfollowGift={onUnfollowGift}
      onNavigateToGift={onNavigateToGift}
    />
  );
};
