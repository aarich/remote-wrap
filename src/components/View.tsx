import React, { FC } from 'react';
import {
  SafeAreaView,
  StyleProp,
  StyleSheet,
  View as RNView,
  ViewStyle,
} from 'react-native';

type Props = {
  isSafe?: boolean;
  style?: StyleProp<ViewStyle>;
};

export const View: FC<Props> = ({ isSafe, style, children }) => {
  const content = <RNView style={StyleSheet.flatten(style)}>{children}</RNView>;

  return isSafe ? (
    <SafeAreaView style={{ flex: 1 }}>{content}</SafeAreaView>
  ) : (
    content
  );
};
