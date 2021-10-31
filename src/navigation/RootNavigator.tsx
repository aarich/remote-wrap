import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
} from '@react-navigation/native';
import { onAuthStateChanged, signInAnonymously } from 'firebase/auth';
import React, { useContext, useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';
import { LoadingIndicator } from '../components';
import { auth } from '../config';
import { AuthenticatedUserContext } from '../providers';
import { AppStack } from './AppStack';

export const RootNavigator = () => {
  const { user, setUser } = useContext(AuthenticatedUserContext);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(
    () =>
      onAuthStateChanged(auth, (authenticatedUser) => {
        if (authenticatedUser === null) {
          signInAnonymously(auth);
        }
        setUser(authenticatedUser || null);
        setIsLoading(false);
      }),
    [setUser, user]
  );

  const isDark = useColorScheme() === 'dark';

  if (isLoading) {
    return <LoadingIndicator />;
  }

  return (
    <NavigationContainer theme={isDark ? DarkTheme : DefaultTheme}>
      <AppStack />
    </NavigationContainer>
  );
};
