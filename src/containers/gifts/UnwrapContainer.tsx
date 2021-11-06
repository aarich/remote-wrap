import { doc, updateDoc } from '@firebase/firestore';
import React, {
  useCallback,
  useEffect,
  useReducer,
  useRef,
  useState,
} from 'react';
import { LoadingIndicator } from '../../components';
import { UnwrapGift } from '../../components/gifts';
import { firestore } from '../../config';
import { useGiftInfo } from '../../hooks/useGiftInfo';
import { useToast } from '../../providers';
import {
  FULLY_UNWRAPPED_STATE,
  FULLY_WRAPPED_STATE,
  Gift,
  WrapState,
  wrapStateToDbValue,
  WRAP_WIDTH,
} from '../../utils';

type Props = { id: string; onDone: VoidFunction };

const THROTTLE_INTERVAL_MS = 3000;

export const UnwrapContainer = ({ id, onDone }: Props) => {
  const toast = useToast();
  const onLoadError = useCallback(
    (text) => {
      toast({ text });
      onDone();
    },
    [onDone, toast]
  );
  const {
    gift,
    giftSource,
    wrapSource,
    wrapState: wrapStateFirestore,
  } = useGiftInfo(id, onLoadError);
  const wrapStateRef = useRef(wrapStateFirestore);
  const [wrapState, setWrapState] = useState(wrapStateFirestore);
  const hasWrapStateChanged = useRef(false);
  const [hasWrapStateBeenLoaded, setWrapStateLoadedOnce] = useReducer(
    () => true,
    false
  );

  useEffect(() => {
    if (wrapStateFirestore && !hasWrapStateBeenLoaded) {
      wrapStateRef.current = wrapStateFirestore;
      setWrapState(wrapStateFirestore);
      setWrapStateLoadedOnce();
    }
  }, [hasWrapStateBeenLoaded, wrapStateFirestore]);

  const updateWrapStateInFirebase = useCallback(() => {
    if (typeof wrapStateRef.current === 'undefined') {
      return;
    }

    if (hasWrapStateChanged.current) {
      hasWrapStateChanged.current = false;

      const updates: Partial<Gift> = {
        wrapState: wrapStateToDbValue(wrapStateRef.current),
      };

      const giftRef = doc(firestore, 'gifts', id);
      updateDoc(giftRef, updates)
        .then(() => console.log('Updated wrapping state'))
        .catch((error) =>
          console.warn('failed to update wrapping state', error)
        );
    }
  }, [hasWrapStateChanged, id]);

  const onUncover = useCallback((x, y) => {
    if (typeof wrapStateRef.current === 'undefined') {
      return;
    }

    if (typeof wrapStateRef.current === 'boolean') {
      if (wrapStateRef.current === FULLY_WRAPPED_STATE) {
        // convert to array first
        wrapStateRef.current = new Array(WRAP_WIDTH)
          .fill([])
          .map(() => new Array(WRAP_WIDTH).fill(true));
      } else if (wrapStateRef.current === FULLY_UNWRAPPED_STATE) {
        // nothing to do
        return;
      }
    }

    const clampedY = Math.max(0, Math.min(wrapStateRef.current.length - 1, y));
    const clampedX = Math.max(0, Math.min(wrapStateRef.current.length - 1, x));

    const oldVal = wrapStateRef.current[clampedY][clampedX];

    if (!oldVal) {
      // already false, no need to do anything
      return;
    }

    wrapStateRef.current = [...wrapStateRef.current];
    wrapStateRef.current[clampedY][clampedX] = false;
    setWrapState(wrapStateRef.current);
    hasWrapStateChanged.current = true;
  }, []);

  const setAllWrap = useCallback((b: WrapState) => {
    setWrapState(b);
    wrapStateRef.current = b;
    hasWrapStateChanged.current = true;
  }, []);

  useEffect(() => {
    const timeout = setInterval(() => {
      updateWrapStateInFirebase();
    }, THROTTLE_INTERVAL_MS);

    return () => {
      clearInterval(timeout);
      updateWrapStateInFirebase();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (
    !gift ||
    !giftSource ||
    typeof wrapSource === 'undefined' ||
    typeof wrapState === 'undefined'
  ) {
    return <LoadingIndicator />;
  }

  return (
    <UnwrapGift
      gift={gift}
      giftSource={giftSource}
      wrapSource={wrapSource}
      wrapState={wrapState}
      onUncoverWrap={onUncover}
      onResetWrap={() => setAllWrap(FULLY_WRAPPED_STATE)}
      onRemoveWrap={() => setAllWrap(FULLY_UNWRAPPED_STATE)}
      onDone={onDone}
    />
  );
};
