import Constants from 'expo-constants';
import { Platform } from 'react-native';

export default {
  displayVersion:
    Platform.select({ web: '', default: Constants.nativeAppVersion + '-' }) +
    Constants.manifest?.extra?.MyVersion,
  appName: 'Presence',
};
