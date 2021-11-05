import { Formik } from 'formik';
import React from 'react';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Button, FormErrorMessage, LoadingIndicator, TextInput } from '../..';
import { formStyles, newGiftValidationSchema } from '../../../utils';

type Props = {
  hasSelectedPhoto: boolean;
  hasSelectedWrap: boolean;
  imageUploadProgress?: number;
  onPressImageSelect: () => void;
  onPressWrapSelect: () => void;
  onCreate: (v: { title: string; message?: string; age?: string }) => void;
};

export const NewGift = ({
  imageUploadProgress,
  hasSelectedPhoto,
  hasSelectedWrap,
  onPressImageSelect,
  onPressWrapSelect,
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
            {/* <TextInput
              label="Delete after how many days (optional)"
              keyboardType="number-pad"
              value={values.age}
              onChangeText={handleChange('age')}
              onBlur={handleBlur('age')}
              style={formStyles.textInput}
            />
            <FormErrorMessage error={errors.age} visible={touched.age} /> */}

            <Button
              style={formStyles.button}
              mode={hasSelectedPhoto ? 'outlined' : 'contained'}
              onPress={onPressImageSelect}
            >
              Select Gift Image
            </Button>
            <Button
              style={formStyles.button}
              mode={hasSelectedWrap ? 'outlined' : 'contained'}
              onPress={onPressWrapSelect}
            >
              Select Wrapping Paper
            </Button>
            <Button
              style={formStyles.button}
              mode="contained"
              onPress={handleSubmit}
              disabled={
                !!(errors.title || errors.message || errors.age) ||
                !hasSelectedPhoto ||
                !hasSelectedWrap
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
