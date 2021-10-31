import React from 'react';
import { useColorScheme } from 'react-native';
import {
  DarkTheme,
  DefaultTheme,
  Provider as PaperProvider,
} from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Icon } from './src/components';
import { RootNavigator } from './src/navigation/RootNavigator';
import {
  AuthenticatedUserProvider,
  PromptProvider,
  ToastProvider,
} from './src/providers';

const App = () => {
  const isDark = useColorScheme() === 'dark';
  return (
    <PaperProvider
      theme={isDark ? DarkTheme : DefaultTheme}
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
