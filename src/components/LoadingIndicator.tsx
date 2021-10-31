import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { ProgressBar, Subheading, useTheme } from 'react-native-paper';

type Props = { message?: string; progress?: number };

export const LoadingIndicator = ({ message, progress }: Props) => {
  const theme = useTheme();

  const color = theme.colors.primary;
  return (
    <View style={styles.container}>
      {message !== undefined ? <Subheading>{message}</Subheading> : null}
      {progress !== undefined ? (
        <View style={styles.row}>
          <View style={styles.half}>
            <ProgressBar progress={progress} color={color} />
          </View>
        </View>
      ) : (
        <ActivityIndicator size="large" color={color} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  half: { flex: 0.5 },
  row: { flexDirection: 'row' },
});
