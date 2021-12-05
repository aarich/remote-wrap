import { AdMobBanner } from 'expo-ads-admob';
import React from 'react';
import { isScreenshotting } from '../../containers/gifts';
import { AdUnit, getAdUnitId } from '../../utils';

type Props = {
  unit: AdUnit;
};

export const Ad = ({ unit }: Props) => {
  if (isScreenshotting) {
    return null;
  }

  return (
    <AdMobBanner servePersonalizedAds={false} adUnitID={getAdUnitId(unit)} />
  );
};
