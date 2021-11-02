import { getDownloadURL } from '@firebase/storage';
import * as FileSystem from 'expo-file-system';
import { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import { getCachedUri, makeRef } from '../utils';

export const useCachedImageUri = (guid?: string) => {
  const [localUri, setLocalUri] = useState<string>();

  useEffect(() => {
    if (!guid) {
      return;
    }

    if (Platform.OS === 'web') {
      // web doesn't support this-- just use public url
      getDownloadURL(makeRef(guid)).then(setLocalUri);
      return;
    }

    const cachedURI = getCachedUri(guid);
    FileSystem.getInfoAsync(cachedURI, { size: false }).then(({ exists }) => {
      if (exists) {
        setLocalUri(cachedURI);
      } else {
        console.log('Downloading ' + guid);
        getDownloadURL(makeRef(guid)).then((downloadURL) =>
          FileSystem.downloadAsync(downloadURL, cachedURI).then(({ uri }) =>
            setLocalUri(uri)
          )
        );
      }
    });
  }, [guid]);

  return localUri;
};
