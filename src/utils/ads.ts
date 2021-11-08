import { Platform } from 'react-native';

export enum AdUnit {
  Settings,
  SettingsInterstitial,
  SettingsRewarded,
}

export const getAdUnitId = (unit: AdUnit): string => {
  let unitId: string | undefined;
  if (__DEV__) {
    if ([AdUnit.SettingsInterstitial].includes(unit)) {
      unitId = Platform.select({
        ios: 'ca-app-pub-3940256099942544/4411468910',
        android: 'ca-app-pub-3940256099942544/1033173712',
      });
    } else if ([AdUnit.SettingsRewarded].includes(unit)) {
      unitId = Platform.select({
        ios: 'ca-app-pub-3940256099942544/1712485313',
        android: 'ca-app-pub-3940256099942544/5224354917',
      });
    }
    unitId = Platform.select({
      ios: 'ca-app-pub-3940256099942544/2934735716',
      android: 'ca-app-pub-3940256099942544/6300978111',
    });
  }
  switch (unit) {
    case AdUnit.Settings:
      unitId = Platform.select({
        ios: 'ca-app-pub-6949812709353975/5363967818',
        android: 'ca-app-pub-6949812709353975/1217334088',
      });
      break;
    case AdUnit.SettingsInterstitial:
      unitId = Platform.select({
        ios: 'ca-app-pub-6949812709353975/7108449859',
        android: 'ca-app-pub-6949812709353975/6531232337',
      });
      break;
    case AdUnit.SettingsRewarded:
      unitId = Platform.select({
        ios: 'ca-app-pub-6949812709353975/5815038736',
        android: 'ca-app-pub-6949812709353975/3485238923',
      });
      break;
  }

  if (!unitId) {
    console.warn('Missing unit id for ' + unit);
  }

  return unitId || '';
};
