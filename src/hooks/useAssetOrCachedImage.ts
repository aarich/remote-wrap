import { useEffect, useState } from 'react';
import { ImageSourcePropType } from 'react-native';
import { getImageFromWrap, StandardWrap } from '../utils';
import { useCachedImageUri } from './useCachedImage';

const getAssetFromType = (guid: string, enumType: 'wrap') => {
  switch (enumType) {
    case 'wrap':
      return getImageFromWrap(guid as StandardWrap);
  }
};

export const useAssetOrCachedImageSource = (
  guid?: string | undefined,
  enumType: 'wrap' = 'wrap'
): ImageSourcePropType => {
  const [source, setSource] = useState<ImageSourcePropType>();
  const [remoteGUID, setRemoteGUID] = useState<string>();
  const localCachedURI = useCachedImageUri(remoteGUID);

  useEffect(() => {
    const assetSource = getAssetFromType(guid, enumType);
    if (assetSource) {
      setSource(assetSource);
      setRemoteGUID(undefined);
    } else {
      setSource(undefined);
      setRemoteGUID(guid);
    }
  }, [enumType, guid]);

  const localSource = localCachedURI ? { uri: localCachedURI } : undefined;

  return source || localSource;
};
