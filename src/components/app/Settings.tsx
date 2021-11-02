import { useIsFocused } from '@react-navigation/core';
import * as FileSystem from 'expo-file-system';
import { storeUrl } from 'expo-store-review';
import React, { useEffect, useState } from 'react';
import { Linking, Platform } from 'react-native';
import { List } from 'react-native-paper';
import { Icons, View } from '../.';
import { usePrompt } from '../../providers';
import { IconName } from '../Icon';

type Props = {
  displayName: string | undefined;
  isEditingName: boolean;
  onCancelEditingName: () => void;
  setIsEditingName: (b: boolean) => void;
  setDisplayName: (displayName: string) => void;
  onDeleteGifts: () => void;
  onLogInOut: () => void;
  onSaveUserProfile: () => void;
  logInOutTitle: string;
};

const listIcon = (icon: IconName) => (props) =>
  <List.Icon icon={icon} {...props} />;

const calcCache = (setter: (size: number) => void) => {
  Platform.OS !== 'web' &&
    FileSystem.cacheDirectory &&
    FileSystem.getInfoAsync(FileSystem.cacheDirectory).then((info) =>
      setter(info.size)
    );
};

export const Settings = ({
  // displayName,
  // isEditingName,
  // onCancelEditingName,
  // setIsEditingName,
  // setDisplayName,
  onDeleteGifts,
  onLogInOut,
  // onSaveUserProfile,
  logInOutTitle,
}: Props) => {
  const isFocused = useIsFocused();
  const [storage, setStorage] = useState<number>();

  useEffect(() => calcCache(setStorage), [isFocused]);

  const prompt = usePrompt();
  const openStoreURL = storeUrl() && (() => Linking.openURL(storeUrl()));
  const resetCache =
    Platform.OS !== 'web' &&
    (() =>
      FileSystem.readDirectoryAsync(FileSystem.cacheDirectory)
        .then((files) =>
          Promise.all(
            files.map((file) =>
              FileSystem.deleteAsync(FileSystem.cacheDirectory + file)
            )
          )
        )
        .then(() => calcCache(setStorage))
        .then(() =>
          prompt({
            title: 'Cache Cleared',
            message:
              'Please close and reopen the app.\n\nStill seeing issues? Make sure you have the latest version of the app!',
            actions: [{ text: 'Ok' }],
          })
        ));

  return (
    <View isSafe>
      <List.Section>
        <List.Subheader>User</List.Subheader>
        {/* {isEditingName ? (
          <TextInput
            label="Display Name (Public)"
            value={displayName}
            onChangeText={setDisplayName}
            left={
              <RNPTextInput.Icon
                name={Icons.CANCEL}
                onPress={onCancelEditingName}
              />
            }
            right={
              <RNPTextInput.Icon
                name={Icons.CHECK}
                onPress={onSaveUserProfile}
              />
            }
          />
        ) : (
          <List.Item
            title={displayName || 'Display Name'}
            left={(props) => <List.Icon icon={Icons.PERSON} {...props} />}
            right={(props) => <List.Icon icon={Icons.EDIT} {...props} />}
            onPress={() => setIsEditingName(true)}
          />
        )} */}
        <List.Item
          title={logInOutTitle}
          onPress={onLogInOut}
          left={listIcon(Icons.SIGN_OUT)}
        />
        <List.Item
          title="Delete My Gifts"
          onPress={onDeleteGifts}
          left={listIcon(Icons.TRASH)}
        />
      </List.Section>
      <List.Section>
        <List.Subheader>App</List.Subheader>
        <List.Item
          title="About"
          left={listIcon(Icons.INFO)}
          right={listIcon(Icons.CHEVRON_RIGHT)}
        />
        {resetCache ? (
          <List.Item
            title={`Reset Cache (~${(storage * 0.000001).toPrecision(2)} MB)`}
            left={listIcon(Icons.FLAME)}
            onPress={resetCache}
          />
        ) : null}
        {openStoreURL ? (
          <List.Item
            title="Share"
            left={listIcon(Icons.SHARE)}
            onPress={openStoreURL}
          />
        ) : null}
      </List.Section>
    </View>
  );
};
