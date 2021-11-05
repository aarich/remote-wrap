import { doc, onSnapshot } from '@firebase/firestore';
import { useEffect, useMemo, useState } from 'react';
import { ImageSourcePropType } from 'react-native';
import { useAssetOrCachedImageSource, useCachedImageUri } from '.';
import { firestore } from '../config';
import { dbValueToWrapState, Gift, WrapState } from '../utils';

export const useGiftInfo = (
  id: string,
  onError: (message: string) => void
): {
  gift?: Gift;
  giftSource?: ImageSourcePropType;
  wrapSource?: ImageSourcePropType;
  wrapState?: WrapState;
} => {
  const [gift, setGift] = useState<Gift>();

  useEffect(() => {
    const unsub = onSnapshot(
      doc(firestore, 'gifts', id),
      (doc) => {
        if (!doc.exists()) {
          onError('Gift not found. Was it deleted?');
          return;
        }

        console.log(`successfully queried gift ${id}`);
        const data = doc.data();
        // @ts-ignore
        setGift({ ...data, id });
      },
      (error) => console.warn(`failed to get gift ${id}`, error)
    );

    return () => unsub();
  }, [id, onError]);

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
