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
    aspect: [4, 3],
    quality: 1,
  });

  if (!result.cancelled && 'uri' in result) {
    return result.uri;
  }
};

export const selectImage = async (
  prompt: ReturnType<typeof usePrompt>
): Promise<string | void> => {
  return new Promise((resolve) => {
    prompt({
      title: 'Upload Photo',
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
    });
  });
};
