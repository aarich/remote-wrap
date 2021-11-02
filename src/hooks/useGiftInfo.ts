import { doc, onSnapshot } from '@firebase/firestore';
import { useEffect, useMemo, useState } from 'react';
import { ImageSourcePropType } from 'react-native';
import { useAssetOrCachedImageSource, useCachedImageUri } from '.';
import { firestore } from '../config';
import { dbValueToWrapState, Gift, WrapState } from '../utils';

export const useGiftInfo = (
  id: string
): {
  gift?: Gift;
  giftSource?: ImageSourcePropType;
  wrapSource?: ImageSourcePropType;
  wrapState?: WrapState;
} => {
  const [gift, setGift] = useState<Gift>();

  useEffect(() => {
    const unsub = onSnapshot(doc(firestore, 'gifts', id), (doc) => {
      const data = doc.data();
      // @ts-ignore
      setGift({ ...data, id });
    });

    return unsub;
  }, [id]);

  const giftURI = useCachedImageUri(gift?.photoUID);
  const wrapSource = useAssetOrCachedImageSource(gift?.wrapUID);
  const wrapState = useMemo(
    () => gift?.wrapState != null && dbValueToWrapState(gift.wrapState),
    [gift?.wrapState]
  );

  return {
    gift,
    giftSource: giftURI ? { uri: giftURI } : undefined,
    wrapSource,
    wrapState,
  };
};
