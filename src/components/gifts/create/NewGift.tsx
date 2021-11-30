import { Formik } from 'formik';
import React from 'react';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import {
  Button,
  FormErrorMessage,
  LoadingIndicator,
  Switch,
  TextInput,
} from '../..';
import { formStyles, newGiftValidationSchema } from '../../../utils';

type Props = {
  hasSelectedPhoto: boolean;
  hasSelectedWrap: boolean;
  imageUploadProgress?: number;
  onPressImageSelect: () => void;
  onPressWrapSelect: () => void;
  onCreate: (v: {
    title: string;
    message?: string;
    age?: string;
    resets?: boolean;
  }) => void;
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
          resets: false,
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
          setFieldValue,
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

            <Switch
              value={values.resets}
              label="Reset each time the gift is opened"
              caption={
                values.resets
                  ? "You won't be able to follow along as someone unwraps the gift. Every time the gift is opened it will initially appear as wrapped."
                  : 'The gift will be in the same unwrapped-state for everyone. You can watch it be unwrapped from any device in real-time.'
              }
              onToggle={() => setFieldValue('resets', !values.resets)}
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
