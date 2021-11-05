import React from 'react';
import { StyleSheet } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { View } from '../../components';
import { DemoContainer } from '../../containers/gifts';

export const DemoScreen = () => {
  return (
    <View isSafe style={styles.flex}>
      <ScrollView style={styles.flex}>
        <DemoContainer />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({ flex: { flex: 1 } });
