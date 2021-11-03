import Constants from 'expo-constants';

export default {
  displayVersion:
    Constants.nativeAppVersion + '-' + Constants.manifest.extra.MyVersion,
  appName: 'Presence',
};
