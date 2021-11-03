import { Platform } from 'react-native';

export enum AdUnit {
  Settings,
  SettingsInterstitial,
}

export const getAdUnitId = (unit: AdUnit) => {
  if (__DEV__) {
    if ([AdUnit.SettingsInterstitial].includes(unit)) {
      return Platform.select({
        ios: 'ca-app-pub-3940256099942544/1712485313',
        android: 'ca-app-pub-3940256099942544/5224354917',
      });
    }
    return Platform.select({
      ios: 'ca-app-pub-3940256099942544/2934735716',
      android: 'ca-app-pub-3940256099942544/6300978111',
    });
  }
  switch (unit) {
    case AdUnit.Settings:
      return Platform.select({ ios: 'ca-app-pub-6949812709353975/5363967818' });
    case AdUnit.SettingsInterstitial:
      return Platform.select({ ios: 'ca-app-pub-6949812709353975/5815038736' });
  }
};
