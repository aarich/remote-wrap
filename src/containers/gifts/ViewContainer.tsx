import { doc, onSnapshot } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { Image, View } from 'react-native';
import { Text } from 'react-native-paper';
import { LoadingIndicator } from '../../components';
import { firestore } from '../../config';
import { useCachedImageUri } from '../../hooks';
import { Gift } from '../../utils';

type Props = { id: string };

export const ViewContainer = ({ id }: Props) => {
  const [gift, setGift] = useState<Gift>();

  useEffect(() => {
    const unsub = onSnapshot(doc(firestore, 'gifts', id), (doc) => {
      const data = doc.data();
      // @ts-ignore
      setGift({ ...data, id });
    });

    return unsub;
  }, [id]);

  const cachedImageURI = useCachedImageUri(gift?.photoUID);

  if (!gift) {
    return <LoadingIndicator />;
  }

  return (
    <View>
      <Text>{gift.title}</Text>
      <Text>{gift.message}</Text>
      <Image
        source={{ uri: cachedImageURI }}
        style={{ minWidth: 100, minHeight: 100 }}
        resizeMethod="auto"
        resizeMode="contain"
      />
    </View>
  );
};
