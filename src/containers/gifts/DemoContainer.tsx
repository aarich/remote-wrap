import { serverTimestamp } from '@firebase/firestore';
import React, { useCallback, useState } from 'react';
import { UnwrapGift } from '../../components/gifts';
import { useAssetOrCachedImageSource } from '../../hooks';
import {
  FULLY_UNWRAPPED_STATE,
  FULLY_WRAPPED_STATE,
  Gift,
  StandardWrap,
  WrapState,
  WRAP_WIDTH,
} from '../../utils';

const DEMO_GIFT: Gift = {
  createdById: '',
  id: '',
  createdOn: serverTimestamp(),
  following: [],
  photoUID: '',
  title: 'Unwrap Demo',
  wrapState: '',
  wrapUID: '',
  message:
    "To create a gift, choose two images: one as the wrapping paper and one as the hidden gift. The recipient of your gift will be able to scratch off the wrapping paper to reveal your gift. You'll be able to watch in real time!",
};

export const DemoContainer = () => {
  const [wrapState, setWrapState] = useState<WrapState>(FULLY_WRAPPED_STATE);
  const onUncover = useCallback(
    (x, y) => {
      let newWrapState: boolean[][];
      if (typeof wrapState === 'boolean') {
        if (wrapState === FULLY_WRAPPED_STATE) {
          // convert to array first
          newWrapState = new Array(WRAP_WIDTH)
            .fill([])
            .map(() => new Array(WRAP_WIDTH).fill(true));
        } else if (wrapState === FULLY_UNWRAPPED_STATE) {
          // nothing to do
          return;
        }
      } else {
        newWrapState = [...wrapState];
      }

      const clampedY = Math.max(0, Math.min(newWrapState.length - 1, y));
      const clampedX = Math.max(0, Math.min(newWrapState.length - 1, x));

      const oldVal = newWrapState[clampedY][clampedX];

      if (!oldVal) {
        // already false, no need to do anything
        return;
      }

      newWrapState[clampedY][clampedX] = false;
      setWrapState(newWrapState);
    },
    [wrapState]
  );

  const setAllWrap = useCallback((b: WrapState) => {
    setWrapState(b);
  }, []);

  const giftSource = useAssetOrCachedImageSource('demoImage', 'image');
  const wrapSource = useAssetOrCachedImageSource(StandardWrap.CHRISTMAS_4);

  return (
    <UnwrapGift
      gift={DEMO_GIFT}
      giftSource={giftSource}
      wrapSource={wrapSource}
      wrapState={wrapState}
      onUncoverWrap={onUncover}
      onResetWrap={() => setAllWrap(FULLY_WRAPPED_STATE)}
      onRemoveWrap={() => setAllWrap(FULLY_UNWRAPPED_STATE)}
    />
  );
};
