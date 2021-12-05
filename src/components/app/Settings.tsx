import React from 'react';
import { StyleSheet } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Badge, List } from 'react-native-paper';
import { Icons } from '../.';
import { AdUnit } from '../../utils';
import { Ad } from '../ads/Ad';
import { IconName } from '../Icon';
import { View } from '../View';

type Props = {
  onDeleteGifts?: VoidFunction;
  onDeleteAccount?: VoidFunction;
  onLogInOut: () => void;
  logInOutTitle: 'Log In' | 'Sign Out';
  onNavigate: (screen: 'About' | 'Storybook') => void;
  onResetCache?: VoidFunction;
  onOpenStoreURL?: VoidFunction;
  onSupportApp?: VoidFunction;
  storage?: number;
};

const listIcon = (icon: IconName) => (p) => <List.Icon icon={icon} {...p} />;

export const Settings = ({
  onDeleteGifts,
  onDeleteAccount,
  onLogInOut,
  onNavigate,
  onResetCache,
  onOpenStoreURL,
  onSupportApp,
  storage,
  logInOutTitle,
}: Props) => {
  const isLogIn = logInOutTitle === 'Log In';
  return (
    <View isSafe style={styles.container}>
      <ScrollView style={styles.container}>
        <List.Section>
          <List.Subheader>User</List.Subheader>
          <List.Item
            title={logInOutTitle}
            onPress={onLogInOut}
            left={
              isLogIn
                ? (p) => (
                    <View>
                      {listIcon(Icons.SIGN_IN)(p)}
                      <Badge visible size={8} style={styles.badge} />
                    </View>
                  )
                : listIcon(Icons.SIGN_OUT)
            }
            right={listIcon(Icons.CHEVRON_RIGHT)}
          />
          {onDeleteGifts ? (
            <List.Item
              title="Delete My Gifts"
              onPress={onDeleteGifts}
              left={listIcon(Icons.TRASH)}
            />
          ) : null}
          {onDeleteAccount ? (
            <List.Item
              title="Delete My Account"
              onPress={onDeleteAccount}
              left={listIcon(Icons.ALERT)}
            />
          ) : null}
        </List.Section>
        <List.Section>
          <List.Subheader>App</List.Subheader>
          <List.Item
            title="About"
            left={listIcon(Icons.INFO)}
            right={listIcon(Icons.CHEVRON_RIGHT)}
            onPress={() => onNavigate('About')}
          />
          {onResetCache ? (
            <List.Item
              title={`Reset Cache (~${((storage || 0) * 0.000001).toPrecision(
                2
              )} MB)`}
              left={listIcon(Icons.FLAME)}
              onPress={onResetCache}
            />
          ) : null}
          {onOpenStoreURL ? (
            <List.Item
              title="Share"
              left={listIcon(Icons.SHARE)}
              onPress={onOpenStoreURL}
            />
          ) : null}
          {onSupportApp ? (
            <List.Item
              title="Support the developer!"
              left={listIcon(Icons.HEART)}
              onPress={onSupportApp}
            />
          ) : null}
          {__DEV__ ? (
            <List.Item
              title="Storybook"
              onPress={() => onNavigate('Storybook')}
            />
          ) : null}
        </List.Section>
      </ScrollView>
      <Ad unit={AdUnit.Settings} />
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    position: 'absolute',
    top: 0,
    right: 14,
  },
  container: { flex: 1 },
});
