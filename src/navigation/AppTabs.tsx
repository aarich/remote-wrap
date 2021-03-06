import { MaterialIcons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useIsFocused } from '@react-navigation/core';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Badge, FAB, Portal, useTheme } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Icon, Icons } from '../components';
import { useCurrentUser } from '../providers';
import { HomeScreen, SettingsScreen } from '../screens';
import { DemoScreen } from '../screens/gifts';
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
  const currentUser = useCurrentUser();

  const showBadge = !currentUser || currentUser.isAnonymous;

  const noBadgeSettingsIcon = ({ color, size }) => (
    <Icon name={Icons.SETTINGS} color={color} size={size} />
  );

  return (
    <>
      <Tab.Navigator
        screenOptions={{ headerShown: false }}
        screenListeners={{
          state: (e) => {
            const { state } = e.data as {
              state: {
                index: number;
                routes: { name: 'Home' | 'Settings' | 'Demo' }[];
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
              <Icon name={Icons.GIFT} color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          component={DemoScreen}
          name="Demo"
          options={{
            tabBarIcon: ({ color, size }) => (
              <Icon name={Icons.DEMO} color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          component={SettingsScreen}
          name="Settings"
          options={{
            title: 'Options',
            tabBarIcon: showBadge
              ? ({ color, size }) => (
                  <View>
                    <Icon name={Icons.SETTINGS} color={color} size={size} />
                    <Badge
                      visible
                      size={Math.ceil(size / 3)}
                      style={styles.badge}
                    />
                  </View>
                )
              : noBadgeSettingsIcon,
          }}
        />
      </Tab.Navigator>

      <Portal>
        <FAB
          visible={isFocused && ['Home'].includes(currentTab)}
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

const styles = StyleSheet.create({
  badge: {
    position: 'absolute',
    top: 0,
    right: 0,
  },
  fab: { position: 'absolute', right: 22 },
});
