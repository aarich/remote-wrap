import {
  getFocusedRouteNameFromRoute,
  RouteProp,
} from '@react-navigation/core';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StackNavigationProp, StackScreenProps } from '@react-navigation/stack';
import * as React from 'react';
import constants from '../config/constants';
import {
  ForgotPasswordScreen,
  LoginScreen,
  NewScreen,
  SignupScreen,
  UnwrapScreen,
  ViewScreen,
} from '../screens';
import { AboutScreen } from '../screens/app/AboutScreen';
import { AppTabs } from './AppTabs';

type StackParamList = {
  // Auth
  Login: undefined;
  Signup: undefined;
  ForgotPassword: undefined;

  // App
  Tabs: undefined;
  About: undefined;

  // Gifts
  Create: undefined;
  View: { id: string };
  Unwrap: { id: string };

  // Tests
  Storybook: undefined;
};

export type NavProp<S extends keyof StackParamList> = StackNavigationProp<
  StackParamList,
  S
>;
export type ScreenProps<S extends keyof StackParamList> = StackScreenProps<
  StackParamList,
  S
>;

const Stack = createNativeStackNavigator<StackParamList>();

export const AppStack = () => {
  const getOptions = (route: RouteProp<StackParamList, 'Tabs'>) => {
    const routeName = getFocusedRouteNameFromRoute(route) ?? 'Home';
    switch (routeName) {
      case 'Home':
        return { title: 'Gifts' };
      case 'Demo':
        return { title: 'Demo' };
      case 'Settings':
        return { title: 'Options' };
    }
    return {};
  };
  return (
    <Stack.Navigator screenOptions={{ headerLargeTitle: true }}>
      <Stack.Screen
        name="Tabs"
        component={AppTabs}
        options={({ route }) => getOptions(route)}
      />
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Signup"
        component={SignupScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ForgotPassword"
        component={ForgotPasswordScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="Create" component={NewScreen} />
      <Stack.Screen
        name="View"
        component={ViewScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Unwrap"
        component={UnwrapScreen}
        options={{
          animation: 'none',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="About"
        component={AboutScreen}
        options={{ headerTitle: `About ${constants.appName}` }}
      />
    </Stack.Navigator>
  );
};
