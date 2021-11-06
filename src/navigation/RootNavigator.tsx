import {
  DarkTheme as NavDarkTheme,
  DefaultTheme as NavLightTheme,
  NavigationContainer,
} from '@react-navigation/native';
import * as Analytics from 'expo-firebase-analytics';
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

function getActiveRouteName(navigationState) {
  if (!navigationState) return null;
  const route = navigationState.routes[navigationState.index];
  // Parse the nested navigators
  if (route.routes) return getActiveRouteName(route);
  return route.routeName;
}

export const RootNavigator = () => {
  const { user, setUser } = useContext(AuthenticatedUserContext);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(
    () =>
      onAuthStateChanged(auth, (authenticatedUser) => {
        setIsLoading(false);
        setUser(authenticatedUser);
        Analytics.setUserId(auth.currentUser?.uid || null);
        Analytics.setUserProperties({
          anonymous: `${auth.currentUser?.isAnonymous || false}`,
        });
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
      onStateChange={(state) => {
        const currentScreen = getActiveRouteName(state);
        Analytics.setCurrentScreen(currentScreen);
      }}
    >
      <AppStack />
    </NavigationContainer>
  );
};
