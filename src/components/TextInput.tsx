/* eslint-disable react/prop-types */
import React, {
  ComponentProps,
  ComponentPropsWithoutRef,
  forwardRef,
} from 'react';
import { TextInput as RNTextInput } from 'react-native';
import { TextInput as RNPTextInput } from 'react-native-paper';
import { Icon } from './Icon';

type Props = {
  handlePasswordVisibility?: () => void;
  rightIcon?: ComponentProps<typeof Icon>['name'];
  leftIcon?: ComponentProps<typeof Icon>['name'];
} & ComponentPropsWithoutRef<typeof RNPTextInput>;

export const TextInput = forwardRef<RNTextInput, Props>((props, ref) => {
  const {
    left,
    right,
    leftIcon,
    rightIcon,
    handlePasswordVisibility,
    ...otherProps
  } = props;
  const l = leftIcon ? <RNPTextInput.Icon name={leftIcon} /> : left;
  const r = rightIcon ? (
    <RNPTextInput.Icon name={rightIcon} onPress={handlePasswordVisibility} />
  ) : (
    right
  );

  return <RNPTextInput ref={ref} left={l} right={r} {...otherProps} />;
});
