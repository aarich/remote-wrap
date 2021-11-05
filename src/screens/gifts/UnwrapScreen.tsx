import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { View } from '../../components';
import { UnwrapContainer } from '../../containers/gifts/UnwrapContainer';
import { ScreenProps } from '../../navigation/AppStack';

type Props = ScreenProps<'Unwrap'>;

export const UnwrapScreen = ({ route, navigation }: Props) => {
  const { id } = route.params;
  return (
    <View isSafe style={styles.flex}>
      <ScrollView style={styles.flex}>
        <UnwrapContainer id={id} onDone={() => navigation.pop()} />
      </ScrollView>
    </View>
  );
};
const styles = StyleSheet.create({ flex: { flex: 1 } });
