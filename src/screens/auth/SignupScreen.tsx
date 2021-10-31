import { EmailAuthProvider, linkWithCredential } from 'firebase/auth';
import { Formik } from 'formik';
import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Headline } from 'react-native-paper';
import {
  Button,
  FormErrorMessage,
  Logo,
  TextInput,
  View,
} from '../../components';
import { auth, Images } from '../../config';
import { useTogglePasswordVisibility } from '../../hooks';
import { ScreenProps } from '../../navigation/AppStack';
import { signupValidationSchema } from '../../utils';

type Props = ScreenProps<'Signup'>;

export const SignupScreen = ({ navigation }: Props) => {
  const [errorState, setErrorState] = useState('');

  const {
    passwordVisibility,
    handlePasswordVisibility,
    rightIcon,
    handleConfirmPasswordVisibility,
    confirmPasswordIcon,
    confirmPasswordVisibility,
  } = useTogglePasswordVisibility();

  const handleSignup = async ({ email, password }) => {
    const credential = EmailAuthProvider.credential(email, password);
    linkWithCredential(auth.currentUser, credential)
      .then(() => {
        console.log('done');
        navigation.popToTop();
      })
      .catch((e) => {
        setErrorState(e.message);
      });
  };

  return (
    <View isSafe style={styles.container}>
      <KeyboardAwareScrollView
        enableOnAndroid={true}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.logoContainer}>
          <Logo uri={Images.logo} />
          <Headline>Create account</Headline>
        </View>

        <Formik
          initialValues={{
            email: '',
            password: '',
            confirmPassword: '',
          }}
          validationSchema={signupValidationSchema}
          onSubmit={(values) => handleSignup(values)}
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
                leftIcon="mail"
                label="Enter email"
                autoCapitalize="none"
                keyboardType="email-address"
                textContentType="emailAddress"
                autoFocus={true}
                value={values.email}
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
                style={styles.textInput}
              />
              <FormErrorMessage error={errors.email} visible={touched.email} />
              <TextInput
                leftIcon="key"
                label="Enter password"
                autoCapitalize="none"
                autoCorrect={false}
                secureTextEntry={passwordVisibility}
                textContentType="newPassword"
                rightIcon={rightIcon}
                handlePasswordVisibility={handlePasswordVisibility}
                value={values.password}
                onChangeText={handleChange('password')}
                onBlur={handleBlur('password')}
                style={styles.textInput}
              />
              <FormErrorMessage
                error={errors.password}
                visible={touched.password}
              />
              <TextInput
                leftIcon="key"
                label="Confirm password"
                autoCapitalize="none"
                autoCorrect={false}
                secureTextEntry={confirmPasswordVisibility}
                textContentType="password"
                rightIcon={confirmPasswordIcon}
                handlePasswordVisibility={handleConfirmPasswordVisibility}
                value={values.confirmPassword}
                onChangeText={handleChange('confirmPassword')}
                onBlur={handleBlur('confirmPassword')}
                style={styles.textInput}
              />
              <FormErrorMessage
                error={errors.confirmPassword}
                visible={touched.confirmPassword}
              />

              {errorState !== '' ? (
                <FormErrorMessage error={errorState} visible={true} />
              ) : null}

              <Button
                style={styles.button}
                mode="contained"
                onPress={handleSubmit}
              >
                Sign Up
              </Button>
            </>
          )}
        </Formik>

        <Button
          style={styles.button}
          onPress={() => navigation.navigate('Login')}
        >
          Already have an account?
        </Button>

        <Button style={styles.button} onPress={() => navigation.pop()}>
          Cancel
        </Button>
      </KeyboardAwareScrollView>
    </View>
  );
};

export const styles = StyleSheet.create({
  button: { marginTop: 16 },
  container: { flex: 1, paddingHorizontal: 12 },
  logoContainer: { alignItems: 'center' },
  textInput: { marginTop: 12 },
});
