import { AdMobBanner } from 'expo-ads-admob';
import React from 'react';
import { Platform } from 'react-native';
import { isScreenshotting } from '../containers/gifts';
import { AdUnit, getAdUnitId } from '../utils';

type Props = {
  unit: AdUnit;
};

export const PotentialAd = ({ unit }: Props) => {
  if (Platform.OS === 'web' || isScreenshotting) {
    return null;
  }

  return (
    <AdMobBanner servePersonalizedAds={false} adUnitID={getAdUnitId(unit)} />
  );
};
