import { sendPasswordResetEmail } from 'firebase/auth';
import { Formik } from 'formik';
import React, { useCallback, useState } from 'react';
import { Headline } from 'react-native-paper';
import {
  Button,
  FormErrorMessage,
  Icons,
  TextInput,
  View,
} from '../../components';
import { auth } from '../../config';
import { ScreenProps } from '../../navigation/AppStack';
import { useToast } from '../../providers';
import { passwordResetSchema } from '../../utils';
import { styles } from './SignupScreen';

type Props = ScreenProps<'ForgotPassword'>;

export const ForgotPasswordScreen = ({ navigation }: Props) => {
  const [errorState, setErrorState] = useState('');
  const toast = useToast();

  const handleSendPasswordResetEmail = useCallback(
    ({ email }) => {
      sendPasswordResetEmail(auth, email)
        .then(() => {
          toast({ text: 'Email will be delivered shortly', duration: 3000 });
          navigation.navigate('Login');
        })
        .catch((error) => setErrorState(error.message));
    },
    [navigation, toast]
  );

  return (
    <View isSafe style={styles.container}>
      <View style={styles.logoContainer}>
        <Headline>Reset your password</Headline>
      </View>
      <Formik
        initialValues={{ email: '' }}
        validationSchema={passwordResetSchema}
        onSubmit={(values) => handleSendPasswordResetEmail(values)}
      >
        {({
          values,
          touched,
          errors,
          handleChange,
          handleSubmit,
          handleBlur,
        }) => {
          console.log(touched);
          return (
            <>
              <TextInput
                label="Email"
                leftIcon={Icons.EMAIL}
                autoCapitalize="none"
                keyboardType="email-address"
                textContentType="emailAddress"
                value={values.email}
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
                style={styles.textInput}
              />
              <FormErrorMessage error={errors.email} visible={touched.email} />

              {errorState !== '' ? (
                <FormErrorMessage error={errorState} visible={true} />
              ) : null}

              <Button
                mode="contained"
                style={styles.button}
                onPress={handleSubmit}
                disabled={!!errors.email}
              >
                Send Reset Email
              </Button>
            </>
          );
        }}
      </Formik>
      <Button
        onPress={() => navigation.navigate('Login')}
        style={styles.button}
      >
        Back to Login
      </Button>
    </View>
  );
};
