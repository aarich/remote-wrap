import { addDoc, collection, serverTimestamp } from '@firebase/firestore';
import { getDownloadURL, ref, uploadBytesResumable } from '@firebase/storage';
import React, { useCallback, useState } from 'react';
import { NewGift } from '../../components/gifts';
import { firestore, storage } from '../../config';
import { NavProp } from '../../navigation/AppStack';
import { usePrompt, useToast } from '../../providers';
import { useCurrentUser } from '../../providers/AuthenticatedUserProvider';
import { Gift, selectImage } from '../../utils';

type Props = { navigation: NavProp<'Create'> };

export const NewGiftContainer = ({ navigation }: Props) => {
  const [image, setImage] = useState<string>();
  const user = useCurrentUser();
  const prompt = usePrompt();
  const toast = useToast();
  const [imageUploadProgress, setImageUploadProgress] = useState<number>();

  const handleCreate = useCallback(
    async ({ title, message, age }) => {
      if (!image) {
        toast({ text: "Couldn't locate that image...", color: 'error' });
        return;
      }

      const response = await fetch(image);
      const blob = await response.blob();
      const photoRef = ref(storage, 'images/');
      const uploadTask = uploadBytesResumable(photoRef, blob);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = snapshot.bytesTransferred / snapshot.totalBytes;
          setImageUploadProgress(progress);
        },
        (error) => {
          toast({ text: error.message, color: 'error' });
          setImageUploadProgress(undefined);
        },
        () => {
          // Success!
          getDownloadURL(uploadTask.snapshot.ref).then((photoURL) => {
            const doc: Omit<Gift, 'id'> = {
              title,
              message,
              age,
              createdById: user?.uid,
              createdOn: serverTimestamp(),
              following: [],
              photoURL,
            };

            addDoc(collection(firestore, 'gifts'), doc)
              .then((docRef) => {
                navigation.replace('View', { id: docRef.id });
                toast({ text: 'Created!' });
              })
              .catch((error) => {
                setImageUploadProgress(undefined);
                toast({ text: error.message, color: 'error', duration: 5000 });
              });
          });
        }
      );
    },
    [image, navigation, toast, user?.uid]
  );

  const onPressImageSelector = useCallback(() => {
    selectImage(prompt).then((uri) => {
      uri && setImage(uri);
    });
  }, [prompt]);

  return (
    <NewGift
      hasSelectedPhoto={!!image}
      imageUploadProgress={imageUploadProgress}
      onCreate={handleCreate}
      onPressImageSelect={onPressImageSelector}
    />
  );
};
