import {
  collection,
  deleteDoc,
  getDocs,
  query,
  where,
} from '@firebase/firestore';
import { useNavigation } from '@react-navigation/core';
import { StackActions } from '@react-navigation/routers';
import { signOut } from 'firebase/auth';
import React, { useCallback, useEffect, useState } from 'react';
import { LoadingIndicator } from '../../components';
import { auth, firestore } from '../../config';
import { SettingsContainer } from '../../containers/app';
import { useCurrentUser, usePrompt, useToast } from '../../providers';

export const SettingsScreen = () => {
  const user = useCurrentUser();
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();
  const toast = useToast();
  const prompt = usePrompt();

  const logInOutTitle = !user || user.isAnonymous ? 'Log In' : 'Sign Out';
  const logInOutAction = useCallback(() => {
    if (!user || user?.isAnonymous) {
      navigation.dispatch(StackActions.push('Signup'));
    } else {
      signOut(auth).catch((error) => console.log('Error logging out: ', error));
    }
  }, [navigation, user]);

  const deleteGiftsAction = useCallback(() => {
    return new Promise<boolean>((resolve) => {
      const doDelete = () => {
        const q = query(
          collection(firestore, 'gifts'),
          where('createdById', '==', user?.uid)
        );
        setIsLoading(true);
        getDocs(q)
          .then((snapshot) => {
            const promises: Promise<void>[] = [];
            snapshot.forEach((doc) => promises.push(deleteDoc(doc.ref)));

            const message =
              snapshot.size === 1 ? '1 gift' : `${snapshot.size} gifts`;
            return Promise.all(promises).then(() =>
              toast({ text: `Deleted ${message}.` })
            );
          })
          .then(() => resolve(true))
          .finally(() => setIsLoading(false));
      };

      prompt({
        title: 'Are you sure',
        message:
          'Everyone will lose access to all gifts created by you. This is not reversible.',
        actions: [
          { text: 'Delete them', onPress: doDelete },
          { text: 'Cancel', onPress: () => resolve(false) },
        ],
      });
    });
  }, [prompt, toast, user?.uid]);

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  if (isLoading) {
    return <LoadingIndicator />;
  }

  return (
    <SettingsContainer
      logInOutTitle={logInOutTitle}
      onLogInOut={logInOutAction}
      onDeleteGifts={user ? deleteGiftsAction : undefined}
      onNavigate={(screen) => navigation.dispatch(StackActions.push(screen))}
    />
  );
};
