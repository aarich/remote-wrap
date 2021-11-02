import {
  collection,
  deleteDoc,
  getDocs,
  query,
  where,
} from '@firebase/firestore';
import { useNavigation } from '@react-navigation/core';
import { StackActions } from '@react-navigation/routers';
import { signOut, updateProfile } from 'firebase/auth';
import React, { useCallback, useEffect, useState } from 'react';
import { LoadingIndicator } from '../../components';
import { Settings } from '../../components/app';
import { auth, firestore } from '../../config';
import { useCurrentUser, useToast } from '../../providers';

export const SettingsScreen = () => {
  const user = useCurrentUser();
  const [isEditingName, setIsEditingName] = useState(false);
  const [displayName, setDisplayName] = useState(user?.displayName);
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();
  const toast = useToast();

  const logInOutTitle = user?.isAnonymous ? 'Log In' : 'Sign Out';
  const logInOutAction = useCallback(() => {
    if (user?.isAnonymous) {
      navigation.dispatch(StackActions.push('Signup'));
    } else {
      signOut(auth)
        .then(() => setDisplayName(undefined))
        .catch((error) => console.log('Error logging out: ', error));
    }
  }, [navigation, user?.isAnonymous]);

  const deleteGiftsAction = useCallback(() => {
    const q = query(
      collection(firestore, 'gifts'),
      where('createdById', '==', user?.uid)
    );
    setIsLoading(true);
    getDocs(q)
      .then((snapshot) => {
        const promises = [];
        snapshot.forEach((doc) => promises.push(deleteDoc(doc.ref)));

        const message =
          snapshot.size === 1 ? '1 gift' : `${snapshot.size} gifts`;
        return Promise.all(promises).then(() =>
          toast({ text: `Deleted ${message}.` })
        );
      })
      .finally(() => setIsLoading(false));
  }, [toast, user?.uid]);

  const updateUserProfile = useCallback(() => {
    updateProfile(auth.currentUser, { displayName }).then(() =>
      setIsEditingName(false)
    );
  }, [displayName]);

  const handleCancelEditingName = useCallback(() => {
    setDisplayName(user?.displayName);
    setIsEditingName(false);
  }, [user?.displayName]);

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  if (isLoading) {
    return <LoadingIndicator />;
  }

  return (
    <Settings
      displayName={displayName}
      setDisplayName={setDisplayName}
      isEditingName={isEditingName}
      setIsEditingName={setIsEditingName}
      onCancelEditingName={handleCancelEditingName}
      logInOutTitle={logInOutTitle}
      onLogInOut={logInOutAction}
      onDeleteGifts={deleteGiftsAction}
      onSaveUserProfile={updateUserProfile}
    />
  );
};
