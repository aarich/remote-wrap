import { deleteUser } from '@firebase/auth';
import { useIsFocused } from '@react-navigation/core';
import {
  AdMobInterstitial,
  AdMobRewarded,
  isAvailableAsync as isAdMobAvailable,
} from 'expo-ads-admob';
import * as Clipboard from 'expo-clipboard';
import * as FileSystem from 'expo-file-system';
import { storeUrl as getStoreUrl } from 'expo-store-review';
import React, { useCallback, useEffect, useState } from 'react';
import { Linking, Platform, Share } from 'react-native';
import { Settings } from '../../components/app';
import {
  PromptOptions,
  useCurrentUser,
  usePrompt,
  useToast,
} from '../../providers';
import { AdUnit, getAdUnitId } from '../../utils';

type Props = {
  onDeleteGifts?: () => Promise<boolean>;
  onLogInOut: () => void;
  logInOutTitle: 'Log In' | 'Sign Out';
  onNavigate: (screen: 'About' | 'Storybook') => void;
};

const calcCache = (setter: (size?: number) => void) => {
  Platform.OS !== 'web' &&
    FileSystem.cacheDirectory &&
    FileSystem.getInfoAsync(FileSystem.cacheDirectory).then((info) =>
      setter(info.size)
    );
};

export const SettingsContainer = ({
  onDeleteGifts,
  onLogInOut,
  onNavigate,
  logInOutTitle,
}: Props) => {
  const toast = useToast();
  const prompt = usePrompt();
  const isFocused = useIsFocused();
  const currentUser = useCurrentUser();

  const [storage, setStorage] = useState<number>();
  const [showInterstitial, setShowInterstitial] = useState<VoidFunction>();
  const [showRewarded, setShowRewarded] = useState<VoidFunction>();

  useEffect(() => calcCache(setStorage), [isFocused]);

  const storeUrl = getStoreUrl();
  const openStoreURL = storeUrl ? () => Linking.openURL(storeUrl) : undefined;
  const resetCache = useCallback(
    () =>
      FileSystem.cacheDirectory &&
      FileSystem.readDirectoryAsync(FileSystem.cacheDirectory)
        .then((files) =>
          Promise.all(
            files.map((file) =>
              FileSystem.deleteAsync(FileSystem.cacheDirectory + file)
            )
          )
        )
        .then(() => calcCache(setStorage))
        .then(() => toast({ text: 'Cache Cleared!' })),
    [toast]
  );

  const onDeleteAccount = useCallback(() => {
    onDeleteGifts &&
      currentUser &&
      onDeleteGifts().then((deleted) => {
        if (deleted) {
          deleteUser(currentUser)
            .then(() => toast({ text: 'Account Deleted' }))
            .catch((error) =>
              toast({ text: error.message, duration: 5000, color: 'error' })
            );
        }
      });
  }, [currentUser, onDeleteGifts, toast]);

  useEffect(() => {
    isAdMobAvailable().then((available) => {
      if (!available) {
        return;
      }

      // set up rewarded
      AdMobRewarded.setAdUnitID(getAdUnitId(AdUnit.SettingsRewarded)).then(
        () => {
          AdMobRewarded.addEventListener('rewardedVideoDidLoad', () =>
            setShowRewarded(() => () => AdMobRewarded.showAdAsync())
          );

          AdMobRewarded.addEventListener(
            'rewardedVideoUserDidEarnReward',
            () => {
              setShowRewarded(undefined);
              setTimeout(() => {
                toast({ text: 'Thanks for your support!' });
              }, 300);
            }
          );

          AdMobRewarded.requestAdAsync({
            servePersonalizedAds: false,
          });
        }
      );

      // set up interstitial
      AdMobInterstitial.setAdUnitID(
        getAdUnitId(AdUnit.SettingsInterstitial)
      ).then(() => {
        AdMobInterstitial.addEventListener('interstitialDidLoad', () =>
          setShowInterstitial(() => () => AdMobInterstitial.showAdAsync())
        );

        AdMobInterstitial.addEventListener('interstitialDidClose', () => {
          setShowInterstitial(undefined);
          setTimeout(() => {
            toast({ text: 'Thanks for your support!' });
          }, 300);
        });

        AdMobInterstitial.requestAdAsync({ servePersonalizedAds: false });
      });
    });

    return () => {
      AdMobRewarded.removeAllListeners && AdMobRewarded.removeAllListeners();
      AdMobRewarded.dismissAdAsync && AdMobRewarded.dismissAdAsync();
      AdMobInterstitial.removeAllListeners &&
        AdMobInterstitial.removeAllListeners();
      AdMobInterstitial.dismissAdAsync && AdMobInterstitial.dismissAdAsync();
    };
  }, [toast]);

  const onSupportApp = useCallback(() => {
    const actions: PromptOptions['actions'] = [];
    if (storeUrl) {
      actions.push(
        {
          text: 'Share the app',
          onPress: () => Share.share({ url: storeUrl }),
        },
        {
          text: 'Rate the app',
          onPress: () => Linking.openURL(storeUrl),
        }
      );
    } else {
      actions.push({
        text: 'Tell a friend about Presence',
        onPress: () => {
          Clipboard.setString('https://presence.mrarich.com');
          toast({ text: 'Link copied to clipboard!' });
        },
      });
    }
    if (showInterstitial) {
      actions.push({ text: 'Watch a short ad', onPress: showInterstitial });
    }
    if (showRewarded) {
      actions.push({ text: 'Watch a longer ad', onPress: showRewarded });
    }
    actions.push({
      text: 'Reach out directly',
      onPress: () => Linking.openURL('https://mrarich.com/contact'),
    });
    actions.push({ text: 'Cancel' });
    prompt({
      title: 'Support Presence',
      message:
        'If you found this app useful and want to support the human that made it, there are lots of ways to do so. Happy Holidays!',
      actions,
      vertical: true,
    });
  }, [prompt, showInterstitial, showRewarded, storeUrl, toast]);

  return (
    <Settings
      logInOutTitle={logInOutTitle}
      onDeleteGifts={onDeleteGifts}
      onDeleteAccount={currentUser ? onDeleteAccount : undefined}
      onLogInOut={onLogInOut}
      onNavigate={onNavigate}
      onOpenStoreURL={openStoreURL}
      onResetCache={Platform.OS !== 'web' ? resetCache : undefined}
      onSupportApp={onSupportApp}
      storage={storage}
    />
  );
};
