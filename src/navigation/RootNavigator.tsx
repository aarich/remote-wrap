import {
  DarkTheme as NavDarkTheme,
  DefaultTheme as NavLightTheme,
  NavigationContainer,
} from '@react-navigation/native';
import { onAuthStateChanged } from 'firebase/auth';
import React, { useContext, useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';
import {
  DarkTheme as PaperDarkTheme,
  DefaultTheme as PaperLightTheme,
} from 'react-native-paper';
import { LoadingIndicator } from '../components';
import { auth } from '../config';
import { AuthenticatedUserContext } from '../providers';
import { AppStack } from './AppStack';

export const CombinedDarkTheme = {
  ...PaperDarkTheme,
  ...NavDarkTheme,
  colors: { ...PaperDarkTheme.colors, ...NavDarkTheme.colors },
};

export const CombinedLightTheme = {
  ...PaperLightTheme,
  ...NavLightTheme,
  colors: { ...PaperLightTheme.colors, ...NavLightTheme.colors },
};

export const RootNavigator = () => {
  const { user, setUser } = useContext(AuthenticatedUserContext);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(
    () =>
      onAuthStateChanged(auth, (authenticatedUser) => {
        setIsLoading(false);
        setUser(authenticatedUser || null);
      }),
    [setUser, user]
  );

  const isDark = useColorScheme() === 'dark';

  if (isLoading) {
    return <LoadingIndicator />;
  }

  return (
    <NavigationContainer
      theme={isDark ? CombinedDarkTheme : CombinedLightTheme}
    >
      <AppStack />
    </NavigationContainer>
  );
};
