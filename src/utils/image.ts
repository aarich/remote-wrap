import * as FileSystem from 'expo-file-system';
import { manipulateAsync } from 'expo-image-manipulator';
import {
  launchCameraAsync,
  launchImageLibraryAsync,
  MediaTypeOptions,
  requestCameraPermissionsAsync,
  requestMediaLibraryPermissionsAsync,
} from 'expo-image-picker';
import { Linking, Platform } from 'react-native';
import { usePrompt } from '../providers';

type ImagePickerType = 'camera' | 'picker';

const MAX_IMAGE_DIM = 800;

const resizeImage = async (
  imageURI: string,
  currentWidth: number,
  currentHeight: number
) => {
  let resize = null;
  if (currentWidth > currentHeight) {
    if (currentWidth > MAX_IMAGE_DIM) {
      resize = { width: MAX_IMAGE_DIM };
    }
  } else {
    if (currentHeight > MAX_IMAGE_DIM) {
      resize = { height: MAX_IMAGE_DIM };
    }
  }

  return resize
    ? (await manipulateAsync(imageURI, [{ resize }])).uri
    : imageURI;
};

const checkPermission = async (
  prompt: ReturnType<typeof usePrompt>,
  type: ImagePickerType
): Promise<boolean> => {
  if (Platform.OS !== 'web') {
    const { status } = await (type === 'camera'
      ? requestCameraPermissionsAsync()
      : requestMediaLibraryPermissionsAsync());
    if (status !== 'granted') {
      prompt({
        title: 'Missing Permissions',
        message: 'We need your permission to do that, first',
        actions: [
          { text: 'Open Settings', onPress: () => Linking.openSettings() },
          { text: 'Ok' },
        ],
      });
      return;
    }
  }

  return true;
};

const launch = async (
  prompt: ReturnType<typeof usePrompt>,
  type: ImagePickerType
): Promise<string | void> => {
  if (!(await checkPermission(prompt, type))) {
    return;
  }

  const launchFn =
    type === 'camera' ? launchCameraAsync : launchImageLibraryAsync;

  const result = await launchFn({
    mediaTypes: MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [1, 1],
    quality: 1,
    allowsMultipleSelection: false,
  });

  if (!result.cancelled && 'uri' in result) {
    return await resizeImage(result.uri, result.width, result.height);
  }
};

export const selectImage = async (
  prompt: ReturnType<typeof usePrompt>,
  message: string
): Promise<string | void> => {
  return new Promise((resolve) => {
    prompt({
      title: 'Upload Photo',
      message,
      actions: [
        {
          text: 'Choose from Library',
          onPress: () => launch(prompt, 'picker').then(resolve),
        },
        {
          text: 'Take Photo',
          onPress: () => launch(prompt, 'camera').then(resolve),
        },
        { text: 'Cancel', onPress: resolve },
      ],
      vertical: true,
    });
  });
};

export const getCachedUri = (guid: string) => FileSystem.cacheDirectory + guid;

export const deleteCachedImage = (guid: string) => {
  const cachedURI = getCachedUri(guid);
  return FileSystem.getInfoAsync(cachedURI, { size: false }).then(
    ({ exists }) => exists && FileSystem.deleteAsync(cachedURI)
  );
};
