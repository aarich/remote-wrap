import * as Yup from 'yup';

export * from './image';
export * from './types';

export const loginValidationSchema = Yup.object().shape({
  email: Yup.string().required().email().label('Email'),
  password: Yup.string().required().min(6).label('Password'),
});

export const signupValidationSchema = Yup.object().shape({
  email: Yup.string().required().email().label('Email'),
  password: Yup.string().required().min(6).label('Password'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Confirm Password must match password.')
    .required('Confirm Password is required.'),
});

export const passwordResetSchema = Yup.object().shape({
  email: Yup.string()
    .required('Please enter a registered email')
    .label('Email')
    .email('Enter a valid email'),
});

export const newGiftValidationSchema: Yup.SchemaOf<{
  title: string;
  message: string;
}> = Yup.object().shape({
  title: Yup.string().required().label('Title'),
  message: Yup.string().label('Message'),
  age: Yup.number().label('Age'),
});
