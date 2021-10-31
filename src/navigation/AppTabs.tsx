import { MaterialIcons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useIsFocused } from '@react-navigation/core';
import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { FAB, Portal, useTheme } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Icon } from '../components';
import { HomeScreen, SettingsScreen } from '../screens';
import { NavProp } from './AppStack';

const Tab = createBottomTabNavigator();

type Props = {
  navigation: NavProp<'Tabs'>;
};

export const AppTabs = ({ navigation }: Props) => {
  const safeArea = useSafeAreaInsets();
  const isFocused = useIsFocused();
  const theme = useTheme();
  const [currentTab, setCurrentTab] = useState('Home');
  return (
    <>
      <Tab.Navigator
        screenOptions={{ headerShown: false }}
        screenListeners={{
          state: (e) => {
            const { state } = e.data as {
              state: {
                index: number;
                routes: { name: 'Home' | 'Settings' }[];
              };
            };

            setCurrentTab(state.routes[state.index].name);
          },
        }}
      >
        <Tab.Screen
          component={HomeScreen}
          name="Home"
          options={{
            tabBarIcon: ({ color, size }) => (
              <Icon name="gift" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          component={SettingsScreen}
          name="Settings"
          options={{
            title: 'Options',
            tabBarIcon: ({ color, size }) => (
              <Icon name="settings" color={color} size={size} />
            ),
          }}
        />
      </Tab.Navigator>

      <Portal>
        <FAB
          visible={isFocused && currentTab === 'Home'}
          // MaterialIcons so that the icon is centered properly
          icon={(props) => <MaterialIcons name="add" {...props} />}
          style={[{ bottom: safeArea.bottom + 65 }, styles.fab]}
          color="white"
          theme={{ colors: { accent: theme.colors.primary } }}
          onPress={() => navigation.push('Create')}
        />
      </Portal>
    </>
  );
};

const styles = StyleSheet.create({ fab: { position: 'absolute', right: 22 } });
