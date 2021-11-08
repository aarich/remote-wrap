import { serverTimestamp } from '@firebase/firestore';
import React, { useCallback, useReducer, useState } from 'react';
import { UnwrapGift } from '../../components/gifts';
import { DEMO_IMAGES_COUNT } from '../../config/images';
import { useAssetOrCachedImageSource } from '../../hooks';
import {
  FULLY_UNWRAPPED_STATE,
  FULLY_WRAPPED_STATE,
  Gift,
  StandardWrap,
  WrapState,
  WRAP_WIDTH,
} from '../../utils';

export const isScreenshotting = __DEV__ && false;
const title = isScreenshotting ? 'Happy Holidays, Alex!' : '';
const message = isScreenshotting
  ? undefined
  : 'A gift is an uploaded image hidden by wrapping paper. The recipient scratches off the wrapping paper to reveal the gift, which you can watch in real time!\nGive it a try! Scratch the image below.';

const DEMO_GIFT: Gift = {
  createdById: '',
  id: '',
  createdOn: serverTimestamp(),
  following: [],
  photoUID: '',
  title,
  wrapState: '',
  wrapUID: '',
  message,
};

const randomDemo = () => `demo${Math.floor(Math.random() * DEMO_IMAGES_COUNT)}`;

export const DemoContainer = () => {
  const [wrapState, setWrapState] = useState<WrapState>(FULLY_WRAPPED_STATE);
  const [demoImage, resetDemo] = useReducer(randomDemo, randomDemo());

  const onUncover = useCallback(
    (x, y) => {
      let newWrapState: boolean[][];
      if (typeof wrapState === 'boolean') {
        if (wrapState === FULLY_WRAPPED_STATE) {
          // convert to array first
          newWrapState = new Array(WRAP_WIDTH)
            .fill([])
            .map(() => new Array(WRAP_WIDTH).fill(true));
        } else {
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

  const giftSource = useAssetOrCachedImageSource(demoImage, 'image');
  const wrapSource = useAssetOrCachedImageSource(StandardWrap.CHRISTMAS_4);

  return (
    <UnwrapGift
      gift={DEMO_GIFT}
      giftSource={giftSource}
      wrapSource={wrapSource}
      wrapState={wrapState}
      onUncoverWrap={onUncover}
      onResetWrap={() => {
        setAllWrap(FULLY_WRAPPED_STATE);
        resetDemo();
      }}
      onRemoveWrap={() => setAllWrap(FULLY_UNWRAPPED_STATE)}
      isDemo
    />
  );
};
