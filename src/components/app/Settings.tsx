import React from 'react';
import { List, TextInput as RNPTextInput } from 'react-native-paper';
import { Icons, TextInput, View } from '../.';

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

export const Settings = ({
  displayName,
  isEditingName,
  onCancelEditingName,
  setIsEditingName,
  setDisplayName,
  onDeleteGifts,
  onLogInOut,
  onSaveUserProfile,
  logInOutTitle,
}: Props) => {
  return (
    <View isSafe>
      <List.Section>
        <List.Subheader>User</List.Subheader>
        {isEditingName ? (
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
        )}
        <List.Item
          title={logInOutTitle}
          onPress={onLogInOut}
          left={(props) => <List.Icon icon={Icons.SIGN_OUT} {...props} />}
        />
        <List.Item
          title="Delete My Gifts"
          onPress={onDeleteGifts}
          left={(props) => <List.Icon icon={Icons.TRASH} {...props} />}
        />
      </List.Section>
    </View>
  );
};
