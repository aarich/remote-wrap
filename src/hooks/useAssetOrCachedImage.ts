import { useEffect, useState } from 'react';
import { ImageSourcePropType } from 'react-native';
import { Images } from '../config';
import { getImageFromWrap, StandardWrap } from '../utils';
import { useCachedImageUri } from './useCachedImage';

const getAssetFromType = (guid: string, enumType: 'wrap' | 'image') => {
  switch (enumType) {
    case 'wrap':
      return getImageFromWrap(guid as StandardWrap);
    case 'image':
      return Images[guid];
  }
};

export const useAssetOrCachedImageSource = (
  guid?: string | undefined,
  enumType: 'wrap' | 'image' = 'wrap'
): ImageSourcePropType => {
  const [source, setSource] = useState<ImageSourcePropType>();
  const [remoteGUID, setRemoteGUID] = useState<string>();
  const localCachedURI = useCachedImageUri(remoteGUID);

  useEffect(() => {
    if (guid) {
      const assetSource = getAssetFromType(guid, enumType);
      if (assetSource) {
        setSource(assetSource);
        setRemoteGUID(undefined);
      } else {
        setSource(undefined);
        setRemoteGUID(guid);
      }
    }
  }, [enumType, guid]);

  const localSource = { uri: localCachedURI };

  return source ?? localSource;
};
