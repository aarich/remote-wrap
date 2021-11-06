import { ExpoConfig } from '@expo/config-types';
import 'dotenv/config';

const config: ExpoConfig = {
  name: 'Presence',
  slug: 'remote-wrap',
  privacy: 'hidden',
  platforms: ['ios', 'android', 'web'],
  version: '1.0',
  scheme: 'remotewrap',
  orientation: 'portrait',
  icon: './assets/gift-outline-white-background.png',
  splash: {
    image: './assets/splash.png',
    resizeMode: 'cover',
    backgroundColor: '#3d3d3d',
  },
  updates: {
    fallbackToCacheTimeout: 3000,
  },
  assetBundlePatterns: ['**/*'],
  android: {
    package: 'rich.alex.presence',
    googleServicesFile: './google-services.json',
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
    googleServicesFile: './GoogleService-Info.plist',
    supportsTablet: true,
    infoPlist: {
      NSPhotoLibraryUsageDescription: 'Upload photos to share as a surprise',
      NSCameraUsageDescription: 'Take photos to share as a surprise',
    },
    associatedDomains: ['applinks:presence.mrarich.com'],
    config: {
      googleMobileAdsAppId: 'ca-app-pub-6949812709353975~8167043362',
    },
    buildNumber: '2',
  },
  web: {
    name: 'Presence',
    backgroundColor: '#000',
    description: 'An app for sharing gifts remotely',
    themeColor: '#000',
    config: {
      apiKey: process.env.API_KEY,
      authDomain: process.env.AUTH_DOMAIN,
      databaseURL: process.env.DATABASE_URL,
      projectId: process.env.PROJECT_ID,
      storageBucket: process.env.STORAGE_BUCKET,
      messagingSenderId: process.env.MESSAGING_SENDER_ID,
      appId: process.env.APP_ID,
      measurementId: process.env.MEASUREMENT_ID,
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
    MyVersion: '2',
  },
};

export default config;
