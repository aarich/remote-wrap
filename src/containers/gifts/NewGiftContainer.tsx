import { addDoc, collection, serverTimestamp } from '@firebase/firestore';
import { ref, uploadBytesResumable, UploadTask } from '@firebase/storage';
import { signInAnonymously } from 'firebase/auth';
import React, { ComponentProps, useCallback, useState } from 'react';
import { v4 as uuid } from 'uuid';
import { NewGift } from '../../components/gifts';
import { WrappingPaperSelector } from '../../components/gifts/create/WrappingPaperSelector';
import { auth, firestore, storage } from '../../config';
import { NavProp } from '../../navigation/AppStack';
import { usePrompt, useToast } from '../../providers';
import { useCurrentUser } from '../../providers/AuthenticatedUserProvider';
import {
  deleteImage,
  FULLY_WRAPPED_DB_VALUE,
  Gift,
  makeName,
  selectImage,
  StandardWrap,
} from '../../utils';

type Props = { navigation: NavProp<'Create'> };

type ValuesType = Parameters<ComponentProps<typeof NewGift>['onCreate']>[0];
const STATE_CHANGED = 'state_changed';

export const NewGiftContainer = ({ navigation }: Props) => {
  const [image, setImage] = useState<string>();
  const [wrap, setWrap] = useState<StandardWrap | string>();
  const [showWrapSelect, setShowWrapSelect] = useState(false);
  const user = useCurrentUser();
  const prompt = usePrompt();
  const toast = useToast();
  const [imageUploadProgress, setImageUploadProgress] = useState<number>();

  const handleCreate = useCallback(
    async (values: ValuesType) => {
      if (!image) {
        toast({ text: "Couldn't locate that image...", color: 'error' });
        return;
      } else if (!wrap) {
        toast({
          text: 'We had trouble locating your selected wrapping paper',
          color: 'error',
        });
        return;
      }

      const uploadWrap = !Object.values(StandardWrap).includes(
        wrap as StandardWrap
      );

      if (!user) {
        console.log('Signing in anonymously');
        await signInAnonymously(auth);
        console.log(`Signed in as ${auth.currentUser?.uid}`);
      }

      const createdById = auth.currentUser?.uid;
      if (!createdById) {
        toast({ text: 'We had trouble signing you in', color: 'error' });
        return;
      }

      const createGiftDoc = (photoUID: string, wrapUID: string) => {
        // Success!
        const { title, message, age } = values;
        const doc: Omit<Gift, 'id'> = {
          title,
          message,
          age: age ? parseInt(age) : -1,
          createdById,
          createdOn: serverTimestamp(),
          following: [],
          photoUID,
          wrapUID,
          wrapState: FULLY_WRAPPED_DB_VALUE,
        };

        addDoc(collection(firestore, 'gifts'), doc)
          .then((docRef) => {
            console.log('Created new gift');
            navigation.replace('View', { id: docRef.id });
            toast({ text: 'Created!' });
          })
          .catch((error) => {
            console.log('Failed to create gift');
            setImageUploadProgress(undefined);
            toast({ text: error.message, color: 'error', duration: 5000 });
          });
      };

      const createTask = async (
        file: string
      ): Promise<[string, UploadTask]> => {
        const uid = uuid();
        const response = await fetch(file);
        const blob = await response.blob();
        const photoRef = ref(storage, makeName(uid));
        const uploadTask = uploadBytesResumable(photoRef, blob);
        return [uid, uploadTask];
      };

      const onError = (error) => {
        toast({ text: error.message, color: 'error' });
        setImageUploadProgress(undefined);
      };

      const [photoUID, uploadPhotoTask] = await createTask(image);
      uploadPhotoTask.on(
        STATE_CHANGED,
        (snapshot) => {
          const progress = snapshot.bytesTransferred / snapshot.totalBytes;
          setImageUploadProgress(uploadWrap ? progress / 2 : progress);
        },
        onError,
        async () => {
          if (uploadWrap) {
            const [wrapUID, uploadWrapTask] = await createTask(wrap);
            uploadWrapTask.on(
              STATE_CHANGED,
              (snapshot) => {
                const progress =
                  snapshot.bytesTransferred / snapshot.totalBytes;
                setImageUploadProgress(0.5 + progress / 2);
              },
              (error) => {
                onError(error);
                deleteImage(photoUID);
              },
              () => createGiftDoc(photoUID, wrapUID)
            );
          } else {
            // Simple!
            createGiftDoc(photoUID, wrap);
          }
        }
      );
    },
    [image, navigation, toast, user, wrap]
  );

  const onPressImageSelector = useCallback(() => {
    selectImage(
      prompt,
      'Choose the image that shows your gift. This will be hidden by the wrapping paper'
    ).then((uri) => {
      uri && setImage(uri);
    });
  }, [prompt]);

  const onPressWrapSelector = useCallback(() => {
    prompt({
      title: 'Select Wrapping Paper',
      message:
        'This will cover the gift. Choose from our catalog or upload your own!',
      actions: [
        { text: 'Browse Catalog', onPress: () => setShowWrapSelect(true) },
        {
          text: 'Custom Upload',
          // onPress: () =>
          //   prompt({
          //     message: 'Do you need this feature? Reach out to enable it!',
          //     actions: [{ text: 'Ok' }],
          //   }),
          onPress: () =>
            selectImage(
              prompt,
              'Choose the image that will hide your gift'
            ).then((uri) => uri && setWrap(uri)),
        },
        { text: 'Cancel' },
      ],
      vertical: true,
    });
  }, [prompt]);

  return (
    <>
      <WrappingPaperSelector
        selected={
          wrap && wrap in StandardWrap ? (wrap as StandardWrap) : undefined
        }
        visible={showWrapSelect}
        onSelect={setWrap}
        onRequestClose={() => setShowWrapSelect(false)}
      />
      <NewGift
        hasSelectedPhoto={!!image}
        hasSelectedWrap={typeof wrap !== 'undefined'}
        imageUploadProgress={imageUploadProgress}
        onCreate={handleCreate}
        onPressImageSelect={onPressImageSelector}
        onPressWrapSelect={onPressWrapSelector}
      />
    </>
  );
};
