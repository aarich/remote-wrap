import { doc, onSnapshot } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { LoadingIndicator } from '../../components';
import { firestore } from '../../config';
import { ScreenProps } from '../../navigation/AppStack';
import { Gift } from '../../utils';

type Props = ScreenProps<'View'>;

export const ViewScreen = ({ navigation, route }: Props) => {
  const { id } = route.params;
  const [gift, setGift] = useState<Gift>();
  useEffect(() => {
    const unsub = onSnapshot(doc(firestore, 'gifts', id), (doc) => {
      const data = doc.data();
      // @ts-ignore
      setGift({ ...data, id });
    });

    return unsub;
  }, [id]);

  if (!gift) {
    return <LoadingIndicator />;
  }
  return (
    <View>
      <Text>{gift.title}</Text>
      <Text>{gift.message}</Text>
      <Text selectable>{gift.photoURL}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
