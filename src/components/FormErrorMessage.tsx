import React from 'react';
import { StyleSheet } from 'react-native';
import { Text, useTheme } from 'react-native-paper';

type Props = { error?: string; visible: boolean };

export const FormErrorMessage = ({ error, visible }: Props) => {
  const theme = useTheme();
  if (!error || !visible) {
    return null;
  }

  const style = { color: theme.colors.error };
  return <Text style={[styles.errorText, style]}>{error}</Text>;
};

const styles = StyleSheet.create({
  errorText: {
    marginHorizontal: 15,
    marginTop: 8,
  },
});
