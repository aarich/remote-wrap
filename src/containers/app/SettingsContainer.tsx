import { useIsFocused } from '@react-navigation/core';
import { AdMobRewarded, isAvailableAsync } from 'expo-ads-admob';
import * as FileSystem from 'expo-file-system';
import { storeUrl as getStoreUrl } from 'expo-store-review';
import React, { useCallback, useEffect, useState } from 'react';
import { Linking, Platform } from 'react-native';
import { Settings } from '../../components/app';
import { useToast } from '../../providers';
import { AdUnit, getAdUnitId } from '../../utils';

type Props = {
  onDeleteGifts?: () => void;
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
  const isFocused = useIsFocused();

  const [storage, setStorage] = useState<number>();
  const [showAd, setShowAd] = useState<VoidFunction>();

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

  useEffect(() => {
    isAvailableAsync().then((available) => {
      available &&
        AdMobRewarded.setAdUnitID(
          getAdUnitId(AdUnit.SettingsInterstitial)
        ).then(() => {
          AdMobRewarded.addEventListener('rewardedVideoDidLoad', () =>
            setShowAd(() => () => AdMobRewarded.showAdAsync())
          );

          AdMobRewarded.addEventListener(
            'rewardedVideoUserDidEarnReward',
            () => {
              setShowAd(undefined);
              setTimeout(() => {
                toast({ text: 'Thanks for your support!' });
              }, 300);
            }
          );

          AdMobRewarded.requestAdAsync({
            servePersonalizedAds: false,
          });
        });
    });

    return () =>
      AdMobRewarded.removeAllListeners && AdMobRewarded.removeAllListeners();
  }, [toast]);

  return (
    <Settings
      logInOutTitle={logInOutTitle}
      onDeleteGifts={onDeleteGifts}
      onLogInOut={onLogInOut}
      onNavigate={onNavigate}
      onOpenStoreURL={openStoreURL}
      onResetCache={Platform.OS !== 'web' ? resetCache : undefined}
      onShowAd={showAd}
      storage={storage}
    />
  );
};
