import * as Clipboard from 'expo-clipboard';
import * as Linking from 'expo-linking';
import { doc, onSnapshot } from 'firebase/firestore';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Share } from 'react-native';
import { LoadingIndicator } from '../../components';
import { ViewGift } from '../../components/gifts';
import { firestore } from '../../config';
import { useAssetOrCachedImageSource, useCachedImageUri } from '../../hooks';
import { useCurrentUser, usePrompt, useToast } from '../../providers';
import { dbValueToWrapState, deleteGift, Gift } from '../../utils';

type Props = {
  id: string;
  onNavigateToUnwrap: VoidFunction;
  onDone: VoidFunction;
};

export const ViewContainer = ({ id, onNavigateToUnwrap, onDone }: Props) => {
  const prompt = usePrompt();
  const toast = useToast();

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
  const wrapState = useMemo(
    () => gift?.wrapState != null && dbValueToWrapState(gift.wrapState),
    [gift?.wrapState]
  );

  const onEdit = undefined; // useCallback(() => {}, []);

  const onDelete = useCallback(() => {
    const performDelete = () => {
      deleteGift(gift)
        .then(() => toast({ text: 'Gift deleted.' }))
        .catch((e) =>
          toast({
            text:
              'Hmm.. Something went wrong. Please try again later. ' +
              e.message,
            color: 'error',
          })
        );
    };
    prompt({
      title: 'Are you sure?',
      message: 'Everyone will lose access immediately',
      actions: [{ text: 'Delete', onPress: performDelete }, { text: 'Cancel' }],
    });
  }, [gift, prompt, toast]);

  const isOwner = useCurrentUser()?.uid === gift?.createdById;
  const onShare = useCallback(() => {
    const url = Linking.createURL('gift', { queryParams: { id } });
    prompt({
      title: 'Share',
      message:
        "At the moment your recipient must download the app first, but we're working on a solution to fix that soon!",
      actions: [
        {
          text: 'Copy link to clipboard',
          onPress: () => Clipboard.setString(url),
        },
        { text: 'Share via...', onPress: () => Share.share({ url }) },
        { text: 'Cancel' },
      ],
      vertical: true,
    });
  }, [id, prompt]);

  if (!gift) {
    return <LoadingIndicator />;
  }

  return (
    <ViewGift
      gift={gift}
      giftSource={{ uri: cachedImageURI }}
      wrapSource={cachedWrapSource}
      wrapState={wrapState}
      onNavigateToUnwrap={onNavigateToUnwrap}
      onEdit={isOwner ? onEdit : undefined}
      onDelete={isOwner ? onDelete : undefined}
      onDone={onDone}
      onShare={onShare}
    />
  );
};
