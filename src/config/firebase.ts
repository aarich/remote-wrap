import Constants from 'expo-constants';
import { FirebaseApp, FirebaseOptions, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { Firestore, initializeFirestore } from 'firebase/firestore';
import { FirebaseStorage, getStorage } from 'firebase/storage';

const firebaseConfig: FirebaseOptions = {
  apiKey: Constants.manifest?.extra?.apiKey,
  authDomain: Constants.manifest?.extra?.authDomain,
  databaseURL: Constants.manifest?.extra?.databaseURL,
  projectId: Constants.manifest?.extra?.projectId,
  storageBucket: Constants.manifest?.extra?.storageBucket,
  messagingSenderId: Constants.manifest?.extra?.messagingSenderId,
  appId: Constants.manifest?.extra?.appId,
  measurementId: Constants.manifest?.extra?.measurementId,
};

//  app:FirebaseApp;
// let firestore:Firestore

let isSet = false;

let app: FirebaseApp;
let firestore: Firestore;
let storage: FirebaseStorage;

if (!isSet) {
  app = initializeApp(firebaseConfig);
  firestore = initializeFirestore(app, {
    experimentalForceLongPolling: true,
  });
  storage = getStorage();
  isSet = true;
}

const auth = getAuth();

export { auth, firestore, storage };
