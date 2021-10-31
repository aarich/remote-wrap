import { Formik } from 'formik';
import React from 'react';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import {
  Button,
  FormErrorMessage,
  LoadingIndicator,
  TextInput,
} from '../../components';
import { styles as formStyles } from '../../screens';
import { newGiftValidationSchema } from '../../utils';

type Props = {
  hasSelectedPhoto: boolean;
  imageUploadProgress?: number;
  onPressImageSelect: () => void;
  onCreate: (v: { title: string; message?: string; age?: string }) => void;
};

export const NewGift = ({
  imageUploadProgress,
  hasSelectedPhoto,
  onPressImageSelect,
  onCreate,
}: Props) => {
  if (imageUploadProgress !== undefined) {
    return (
      <LoadingIndicator
        message={imageUploadProgress < 1 ? 'Just a sec...' : 'Finishing up...'}
        progress={imageUploadProgress}
      />
    );
  }

  return (
    <KeyboardAwareScrollView enableOnAndroid={true}>
      <Formik
        initialValues={{
          title: '',
          message: '',
          age: '',
        }}
        validationSchema={newGiftValidationSchema}
        onSubmit={(values) => onCreate(values)}
      >
        {({
          values,
          touched,
          errors,
          handleChange,
          handleSubmit,
          handleBlur,
        }) => (
          <>
            <TextInput
              label="Gift Title"
              autoCapitalize="none"
              autoFocus={true}
              value={values.title}
              onChangeText={handleChange('title')}
              onBlur={handleBlur('title')}
              style={formStyles.textInput}
            />
            <FormErrorMessage error={errors.title} visible={touched.title} />
            <TextInput
              label="Message (optional)"
              value={values.message}
              onChangeText={handleChange('message')}
              onBlur={handleBlur('message')}
              style={formStyles.textInput}
            />
            <FormErrorMessage
              error={errors.message}
              visible={touched.message}
            />
            <TextInput
              label="Delete after how many days (optional)"
              keyboardType="number-pad"
              value={values.age}
              onChangeText={handleChange('age')}
              onBlur={handleBlur('age')}
              style={formStyles.textInput}
            />
            <FormErrorMessage error={errors.age} visible={touched.age} />

            <Button
              style={formStyles.button}
              mode={hasSelectedPhoto ? 'outlined' : 'contained'}
              onPress={onPressImageSelect}
            >
              Select Image
            </Button>
            <Button
              style={formStyles.button}
              mode="contained"
              onPress={handleSubmit}
              disabled={
                !!(errors.title || errors.message || errors.age) ||
                !hasSelectedPhoto
              }
            >
              Create
            </Button>
          </>
        )}
      </Formik>
    </KeyboardAwareScrollView>
  );
};
