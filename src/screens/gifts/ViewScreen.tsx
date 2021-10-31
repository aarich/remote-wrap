import { doc, onSnapshot } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { Image, View } from 'react-native';
import { Text } from 'react-native-paper';
import { LoadingIndicator } from '../../components';
import { firestore } from '../../config';
import { useAssetOrCachedImageSource, useCachedImageUri } from '../../hooks';
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

  const cachedImageURI = useCachedImageUri(gift?.photoUID);
  const cachedWrapSource = useAssetOrCachedImageSource(gift?.wrapUID);

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
      <Image
        source={cachedWrapSource}
        style={{ minWidth: 100, minHeight: 100 }}
        resizeMethod="auto"
        resizeMode="contain"
      />
    </View>
  );
};
