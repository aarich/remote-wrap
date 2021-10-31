import Constants from 'expo-constants';
import { FirebaseOptions, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { initializeFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig: FirebaseOptions = {
  apiKey: Constants.manifest.extra.apiKey,
  authDomain: Constants.manifest.extra.authDomain,
  databaseURL: Constants.manifest.extra.databaseURL,
  projectId: Constants.manifest.extra.projectId,
  storageBucket: Constants.manifest.extra.storageBucket,
  messagingSenderId: Constants.manifest.extra.messagingSenderId,
  appId: Constants.manifest.extra.appId,
  measurementId: Constants.manifest.extra.measurementId,
};

let app = null;
let firestore = null;
let storage = null;

if (!app) {
  app = initializeApp(firebaseConfig);
  firestore = initializeFirestore(app, {
    experimentalForceLongPolling: true,
  });
  storage = getStorage();
}

const auth = getAuth();

export { auth, firestore, storage };
