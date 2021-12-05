import * as Clipboard from 'expo-clipboard';
import Constants from 'expo-constants';
import { isAvailableAsync as isSharingAvailable } from 'expo-sharing';
import React, { useCallback, useEffect, useState } from 'react';
import { Linking, Platform, Share } from 'react-native';
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

const makeShareUrl = (base: string, id: string) => `${base}/gift?id=${id}`;

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

  useEffect(() => {
    if (Platform.OS === 'web') {
      const base = 'app-id=1593320208';
      const parameterized = `${base}, app-argument=remotewrap:///gift?id=${id}`;

      const setMeta = (val: string) =>
        document
          ?.querySelector('meta[name="apple-itunes-app"]')
          ?.setAttribute('content', val);

      setMeta(parameterized);
      return () => setMeta(base);
    }
  }, [id]);

  const { gift, giftSource, wrapSource, wrapState } = useGiftInfo(
    id,
    onFailedToLoadGift
  );
  const currentUserId = useCurrentUser()?.uid;
  const isOwner = currentUserId === gift?.createdById;

  const onEdit = undefined; // useCallback(() => {}, []);

  const onDelete = useCallback(() => {
    const performDelete = () => {
      gift &&
        deleteGift(gift)
          .then(() => {
            onDone();
            toast({ text: 'Gift deleted.' });
          })
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
  }, [gift, onDone, prompt, toast]);

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
    const url = makeShareUrl(`https://presence.mrarich.com`, id);

    isSharingAvailable().then((canShare) => {
      const actions: Parameters<typeof prompt>[0]['actions'] = [
        {
          text: 'Copy link to clipboard',
          onPress: () => {
            Clipboard.setString(url);
            toast({ text: 'Copied!' });
          },
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
  }, [id, prompt, toast]);

  const [onOpenInApp, setOnOpenInApp] = useState<VoidFunction>();

  useEffect(() => {
    if (Platform.OS === 'web') {
      const url = makeShareUrl(Constants.manifest?.scheme + '://', id);
      setOnOpenInApp(() => () => Linking.openURL(url));
    }
  }, [id]);

  if (
    !gift ||
    !giftSource ||
    typeof wrapSource === 'undefined' ||
    typeof wrapState === 'undefined'
  ) {
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
      onOpenInApp={onOpenInApp}
    />
  );
};
