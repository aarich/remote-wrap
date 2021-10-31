import { signInWithEmailAndPassword } from 'firebase/auth';
import { Formik } from 'formik';
import React, { useState } from 'react';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Headline } from 'react-native-paper';
import {
  Button,
  FormErrorMessage,
  Icons,
  Logo,
  TextInput,
  View,
} from '../../components';
import { auth, Images } from '../../config';
import { useTogglePasswordVisibility } from '../../hooks';
import { NavProp } from '../../navigation/AppStack';
import { formStyles, loginValidationSchema } from '../../utils';

type Props = { navigation: NavProp<'Login'> };

export const LoginScreen = ({ navigation }: Props) => {
  const [errorState, setErrorState] = useState('');

  const { passwordVisibility, handlePasswordVisibility, rightIcon } =
    useTogglePasswordVisibility();

  const handleLogin = ({ email, password }) => {
    signInWithEmailAndPassword(auth, email, password)
      .then(() => navigation.popToTop())
      .catch((error) => {
        if (error.code === 'auth/user-not-found') {
          setErrorState('The information provided did not match our records');
        } else {
          setErrorState(error.message);
        }
      });
  };

  return (
    <View isSafe style={formStyles.container}>
      <KeyboardAwareScrollView
        enableOnAndroid={true}
        showsVerticalScrollIndicator={false}
      >
        <View style={formStyles.logoContainer}>
          <Logo uri={Images.logo} />
          <Headline>Welcome back!</Headline>
        </View>
        <Formik
          initialValues={{
            email: '',
            password: '',
          }}
          validationSchema={loginValidationSchema}
          onSubmit={(values) => handleLogin(values)}
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
                label="Email"
                leftIcon={Icons.EMAIL}
                autoCapitalize="none"
                keyboardType="email-address"
                textContentType="emailAddress"
                autoFocus={true}
                value={values.email}
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
                style={formStyles.textInput}
              />
              <FormErrorMessage error={errors.email} visible={touched.email} />
              <TextInput
                label="Password"
                leftIcon={Icons.PASSWORD}
                autoCapitalize="none"
                autoCorrect={false}
                secureTextEntry={passwordVisibility}
                textContentType="password"
                rightIcon={rightIcon}
                handlePasswordVisibility={handlePasswordVisibility}
                value={values.password}
                onChangeText={handleChange('password')}
                onBlur={handleBlur('password')}
                style={formStyles.textInput}
              />
              <FormErrorMessage
                error={errors.password}
                visible={touched.password}
              />

              {errorState !== '' ? (
                <FormErrorMessage error={errorState} visible={true} />
              ) : null}

              <Button
                style={formStyles.button}
                mode="contained"
                onPress={handleSubmit}
                disabled={!!(errors.email || errors.password)}
              >
                Login
              </Button>
            </>
          )}
        </Formik>
        <Button style={formStyles.button} onPress={() => navigation.pop()}>
          Create a new account?
        </Button>
        <Button
          style={formStyles.button}
          onPress={() => navigation.navigate('ForgotPassword')}
        >
          Forgot Password
        </Button>
      </KeyboardAwareScrollView>
    </View>
  );
};
