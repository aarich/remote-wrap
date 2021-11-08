import {
  DarkTheme as NavDarkTheme,
  DefaultTheme as NavLightTheme,
  NavigationContainer,
} from '@react-navigation/native';
import { NavigationState } from '@react-navigation/routers';
import * as Analytics from 'expo-firebase-analytics';
import { onAuthStateChanged } from 'firebase/auth';
import React, { useContext, useEffect, useState } from 'react';
import { Platform, useColorScheme } from 'react-native';
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

function getActiveRouteName(navigationState?: NavigationState) {
  if (!navigationState) return null;
  const route = navigationState.routes[navigationState.index];
  // Parse the nested navigators
  if (route.state && 'index' in route.state)
    return getActiveRouteName(route.state as NavigationState);
  return route.name;
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

  useEffect(() => {
    if (__DEV__ && Platform.OS !== 'web') {
      Analytics.setDebugModeEnabled(true);
    }
  }, []);

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
