import React, { FC } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View as RNView,
  ViewProps,
} from 'react-native';

type Props = {
  isSafe?: boolean;
} & ViewProps;

export const View: FC<Props> = ({ isSafe, children, ...other }) => {
  const content = <RNView {...other}>{children}</RNView>;

  return isSafe ? (
    <SafeAreaView style={styles.container}>{content}</SafeAreaView>
  ) : (
    content
  );
};

const styles = StyleSheet.create({ container: { flex: 1 } });
