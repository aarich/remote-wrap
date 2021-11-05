import { ExpoConfig } from '@expo/config-types';
import 'dotenv/config';

const config: ExpoConfig = {
  name: 'Presence',
  slug: 'remote-wrap',
  privacy: 'hidden',
  platforms: ['ios', 'android', 'web'],
  version: '0.0.1',
  scheme: 'remotewrap',
  orientation: 'portrait',
  icon: './assets/gift-outline-white-background.png',
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
    intentFilters: [
      {
        action: 'VIEW',
        data: [
          {
            scheme: 'https',
            host: 'presence.mrarich.com',
            pathPrefix: '/gift',
          },
        ],
        category: ['BROWSABLE', 'DEFAULT'],
      },
    ],
  },
  ios: {
    bundleIdentifier: 'com.mrarich.presence',
    appStoreUrl:
      'https://apps.apple.com/app/apple-store/id1593320208?pt=117925864&ct=appconfig&mt=8',
    supportsTablet: true,
    infoPlist: {
      NSPhotoLibraryUsageDescription: 'Upload photos to share as a surprise',
      NSCameraUsageDescription: 'Take photos to share as a surprise',
    },
    associatedDomains: ['applinks:presence.mrarich.com'],
    config: {
      googleMobileAdsAppId: 'ca-app-pub-6949812709353975~8167043362',
    },
  },
  web: {
    name: 'Presence',
    backgroundColor: '#000',
    description: 'An app for sharing gifts remotely',
    themeColor: '#000',
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
    MyVersion: '1.0',
  },
};

export default config;
