import * as Clipboard from 'expo-clipboard';
import * as Linking from 'expo-linking';
import { isAvailableAsync as isSharingAvailable } from 'expo-sharing';
import React, { useCallback, useEffect } from 'react';
import { Share } from 'react-native';
import { LoadingIndicator } from '../../components';
import { ViewGift } from '../../components/gifts';
import { useGiftInfo } from '../../hooks/useGiftInfo';
import { useCurrentUser, usePrompt, useToast } from '../../providers';
import { deleteGift, toggleFollow } from '../../utils';

type Props = {
  id: string;
  onNavigateToUnwrap: VoidFunction;
  onDone: VoidFunction;
};

export const ViewContainer = ({ id, onNavigateToUnwrap, onDone }: Props) => {
  const prompt = usePrompt();
  const toast = useToast();
  const onFailedToLoadGift = useCallback(
    (text: string) => {
      toast({ text });
      onDone();
    },
    [onDone, toast]
  );

  const { gift, giftSource, wrapSource, wrapState } = useGiftInfo(
    id,
    onFailedToLoadGift
  );
  const currentUserId = useCurrentUser()?.uid;
  const isOwner = currentUserId === gift?.createdById;

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

  useEffect(() => {
    if (
      gift &&
      !isOwner &&
      currentUserId &&
      !gift.following.includes(currentUserId)
    ) {
      // Need to add our name to the following list
      toggleFollow(gift, currentUserId, true);
    }
  }, [gift, isOwner, currentUserId]);

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
      giftSource={giftSource}
      wrapSource={wrapSource}
      wrapState={wrapState}
      onNavigateToUnwrap={onNavigateToUnwrap}
      onEdit={isOwner ? onEdit : undefined}
      onDelete={isOwner ? onDelete : undefined}
      onDone={onDone}
      onShare={onShare}
    />
  );
};
