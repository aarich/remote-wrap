import React from 'react';
import { StyleSheet } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { List } from 'react-native-paper';
import { Icons, View } from '../.';
import { AdUnit } from '../../utils';
import { IconName } from '../Icon';
import { PotentialAd } from '../PotentialAd';

type Props = {
  onDeleteGifts?: () => void;
  onLogInOut: () => void;
  logInOutTitle: string;
  onNavigate: (screen: 'About' | 'Storybook') => void;
  onResetCache: VoidFunction;
  onOpenStoreURL: VoidFunction;
  onShowAd?: VoidFunction;
  storage?: number;
};

const listIcon = (icon: IconName) => (p) => <List.Icon icon={icon} {...p} />;

export const Settings = ({
  onDeleteGifts,
  onLogInOut,
  onNavigate,
  onResetCache,
  onOpenStoreURL,
  onShowAd,
  storage,
  logInOutTitle,
}: Props) => {
  return (
    <View isSafe style={styles.container}>
      <ScrollView style={styles.container}>
        <List.Section>
          <List.Subheader>User</List.Subheader>
          <List.Item
            title={logInOutTitle}
            onPress={onLogInOut}
            left={listIcon(Icons.SIGN_OUT)}
          />
          {onDeleteGifts ? (
            <List.Item
              title="Delete My Gifts"
              onPress={onDeleteGifts}
              left={listIcon(Icons.TRASH)}
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
          {onShowAd ? (
            <List.Item
              title="Want to support this app?"
              description="Watch a short ad!"
              left={listIcon(Icons.HEART)}
              onPress={onShowAd}
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
      <PotentialAd unit={AdUnit.Settings} />
    </View>
  );
};

const styles = StyleSheet.create({ container: { flex: 1 } });
