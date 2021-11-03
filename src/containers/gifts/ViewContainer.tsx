import * as Clipboard from 'expo-clipboard';
import * as Linking from 'expo-linking';
import { isAvailableAsync as isSharingAvailable } from 'expo-sharing';
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

    isSharingAvailable().then((canShare) => {
      const actions: Parameters<typeof prompt>[0]['actions'] = [
        {
          text: 'Copy link to clipboard',
          onPress: () => Clipboard.setString(url),
        },
      ];

      if (canShare) {
        actions.push({
          text: 'Share via...',
          onPress: () => Share.share({ url }),
        });
      }

      actions.push({ text: 'Cancel' });

      prompt({
        title: 'Share',
        message: "How would you like to make someone's day?",
        actions,
        vertical: true,
      });
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
