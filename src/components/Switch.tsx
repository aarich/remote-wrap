import React from 'react';
import { StyleSheet, View } from 'react-native';
import {
  Caption,
  Switch as RNPSwitch,
  Text,
  useTheme,
} from 'react-native-paper';

type Props = {
  value: boolean;
  label: string;
  caption: string;
  onToggle: VoidFunction;
};

export const Switch = ({ value, label, caption, onToggle }: Props) => {
  const theme = useTheme();
  return (
    <>
      <View style={styles.container}>
        <RNPSwitch
          color={theme.colors.primary}
          value={value}
          onValueChange={onToggle}
        />
        <View style={styles.flex}>
          <View style={styles.center}>
            <Text>{label}</Text>
          </View>
        </View>
      </View>
      <Caption style={styles.caption}>{caption}</Caption>
    </>
  );
};

const styles = StyleSheet.create({
  caption: { marginHorizontal: 10 },
  center: { flex: 1, justifyContent: 'center' },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    marginHorizontal: 10,
  },
  flex: { flex: 1, marginHorizontal: 10 },
});
