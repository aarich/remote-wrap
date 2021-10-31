import {
  createStackNavigator,
  StackNavigationProp,
  StackScreenProps,
} from '@react-navigation/stack';
import * as React from 'react';
import {
  ForgotPasswordScreen,
  LoginScreen,
  NewScreen,
  SignupScreen,
  UnwrapScreen,
  ViewScreen,
} from '../screens';
import { AppTabs } from './AppTabs';

type StackParamList = {
  // Auth
  Login: undefined;
  Signup: undefined;
  ForgotPassword: undefined;

  // App
  Tabs: undefined;

  // Gifts
  Create: undefined;
  View: { id: string };
  Unwrap: { id: string };
};

export type NavProp<S extends keyof StackParamList> = StackNavigationProp<
  StackParamList,
  S
>;
export type ScreenProps<S extends keyof StackParamList> = StackScreenProps<
  StackParamList,
  S
>;

const Stack = createStackNavigator<StackParamList>();

export const AppStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Tabs"
        component={AppTabs}
        options={{ title: 'Gifts' }}
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
      <Stack.Screen name="View" component={ViewScreen} />
      <Stack.Screen name="Unwrap" component={UnwrapScreen} />
    </Stack.Navigator>
  );
};
