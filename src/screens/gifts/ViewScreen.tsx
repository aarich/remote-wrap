import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { View } from '../../components';
import {
  DemoContainer,
  isScreenshotting,
  ViewContainer,
} from '../../containers/gifts';
import { ScreenProps } from '../../navigation/AppStack';

type Props = ScreenProps<'View'>;

export const ViewScreen = ({ route, navigation }: Props) => {
  const { id } = route.params;

  const onNavigateToUnwrap = () => navigation.replace('Unwrap', { id });
  const onDone = () => navigation.pop();

  return (
    <View isSafe style={styles.flex}>
      {isScreenshotting ? (
        <DemoContainer />
      ) : (
        <ScrollView style={styles.flex}>
          <ViewContainer
            id={id}
            onNavigateToUnwrap={onNavigateToUnwrap}
            onDone={onDone}
          />
        </ScrollView>
      )}
    </View>
  );
};
const styles = StyleSheet.create({ flex: { flex: 1 } });
