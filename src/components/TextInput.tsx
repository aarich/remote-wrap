import React, { ComponentProps, ComponentPropsWithoutRef } from 'react';
import { TextInput as RNPTextInput } from 'react-native-paper';
import { Icon } from './Icon';

type Props = {
  handlePasswordVisibility?: () => void;
  rightIcon?: ComponentProps<typeof Icon>['name'];
  leftIcon?: ComponentProps<typeof Icon>['name'];
} & ComponentPropsWithoutRef<typeof RNPTextInput>;

export const TextInput = ({
  left,
  right,
  leftIcon,
  rightIcon,
  handlePasswordVisibility,
  ...otherProps
}: Props) => {
  const l = leftIcon ? <RNPTextInput.Icon name={leftIcon} /> : left;
  const r = rightIcon ? (
    <RNPTextInput.Icon name={rightIcon} onPress={handlePasswordVisibility} />
  ) : (
    right
  );

  return <RNPTextInput left={l} right={r} {...otherProps} />;
};
