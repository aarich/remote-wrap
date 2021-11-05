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
