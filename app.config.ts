import { ExpoConfig } from '@expo/config-types';
import 'dotenv/config';

const config: ExpoConfig = {
  name: 'Remote Wrap',
  slug: 'remote-wrap',
  privacy: 'hidden',
  platforms: ['ios', 'android', 'web'],
  version: '0.0.1',
  orientation: 'portrait',
  icon: './assets/flame.png',
  splash: {
    image: './assets/splash.png',
    resizeMode: 'cover',
    backgroundColor: '#F57C00',
  },
  updates: {
    fallbackToCacheTimeout: 3000,
  },
  assetBundlePatterns: ['**/*'],
  android: {
    permissions: ['CAMERA', 'READ_EXTERNAL_STORAGE', 'WRITE_EXTERNAL_STORAGE'],
  },
  ios: {
    supportsTablet: true,
    infoPlist: {
      NSPhotoLibraryUsageDescription: 'Upload photos to share as a surprise',
      NSCameraUsageDescription: 'Take photos to share as a surprise',
    },
  },
  userInterfaceStyle: 'automatic',
  extra: {
    apiKey: process.env.API_KEY,
    authDomain: process.env.AUTH_DOMAIN,
    databaseURL: process.env.DATABASE_URL,
    projectId: process.env.PROJECT_ID,
    storageBucket: process.env.STORAGE_BUCKET,
    messagingSenderId: process.env.MESSAGING_SENDER_ID,
    appId: process.env.APP_ID,
    measurementId: process.env.MEASUREMENT_ID,
  },
};

export default config;
