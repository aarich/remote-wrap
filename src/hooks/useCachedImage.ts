import { getDownloadURL } from '@firebase/storage';
import * as FileSystem from 'expo-file-system';
import { useEffect, useState } from 'react';
import { makeRef } from '../utils';

const getCachedUri = (guid: string) => FileSystem.cacheDirectory + guid;

export const useCachedImageUri = (guid?: string) => {
  const [localUri, setLocalUri] = useState<string>();

  useEffect(() => {
    if (!guid) {
      return;
    }

    const cachedURI = getCachedUri(guid);
    FileSystem.getInfoAsync(cachedURI, { size: false }).then(({ exists }) => {
      if (exists) {
        setLocalUri(cachedURI);
      } else {
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

export const deleteCachedImageUri = (guid: string) => {
  const cachedURI = getCachedUri(guid);
  return FileSystem.getInfoAsync(cachedURI, { size: false }).then(
    ({ exists }) => exists && FileSystem.deleteAsync(cachedURI)
  );
};
