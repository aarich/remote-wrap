import * as Analytics from 'expo-firebase-analytics';
import React from 'react';
import { LogBox, useColorScheme } from 'react-native';
import 'react-native-get-random-values';
import { Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Icon } from './src/components';
import {
  CombinedDarkTheme,
  CombinedLightTheme,
  RootNavigator,
} from './src/navigation/RootNavigator';
import {
  AuthenticatedUserProvider,
  PromptProvider,
  ToastProvider,
} from './src/providers';

LogBox.ignoreLogs(['AsyncStorage has been extracted from react-native core']);

if (!__DEV__) {
  console.log = () => null;
  console.warn = (...args) =>
    Analytics.logEvent('console_warn', { log_data: JSON.stringify({ args }) });
  console.error = (...args) =>
    Analytics.logEvent('console_error', { log_data: JSON.stringify({ args }) });
}

const App = () => {
  const isDark = useColorScheme() === 'dark';

  return (
    <PaperProvider
      theme={isDark ? CombinedDarkTheme : CombinedLightTheme}
      settings={{
        // @ts-ignore
        icon: (props) => <Icon {...props} />,
      }}
    >
      <ToastProvider>
        <PromptProvider>
          <AuthenticatedUserProvider>
            <SafeAreaProvider>
              <RootNavigator />
            </SafeAreaProvider>
          </AuthenticatedUserProvider>
        </PromptProvider>
      </ToastProvider>
    </PaperProvider>
  );
};

export default App;
