import { useState } from 'react';
import { IconName } from '../components/Icon';

const visibleIcon: IconName = 'eye';
const hiddenIcon: IconName = 'eye-closed';

export const useTogglePasswordVisibility = () => {
  // password will not be initially visible
  const [passwordVisibility, setPasswordVisibility] = useState(true);
  const [rightIcon, setRightIcon] = useState<IconName>('eye');
  const [confirmPasswordIcon, setConfirmPasswordIcon] =
    useState<IconName>('eye');
  const [confirmPasswordVisibility, setConfirmPasswordVisibility] =
    useState(true);

  // function that toggles password visibility on a TextInput component on a password field
  const handlePasswordVisibility = () => {
    if (rightIcon === visibleIcon) {
      setRightIcon('eye-closed');
      setPasswordVisibility(!passwordVisibility);
    } else if (rightIcon === hiddenIcon) {
      setRightIcon(visibleIcon);
      setPasswordVisibility(!passwordVisibility);
    }
  };

  // function that toggles password visibility on a TextInput component on a confirm password field
  const handleConfirmPasswordVisibility = () => {
    if (confirmPasswordIcon === visibleIcon) {
      setConfirmPasswordIcon(hiddenIcon);
      setConfirmPasswordVisibility(!confirmPasswordVisibility);
    } else if (confirmPasswordIcon === hiddenIcon) {
      setConfirmPasswordIcon(visibleIcon);
      setConfirmPasswordVisibility(!confirmPasswordVisibility);
    }
  };

  return {
    passwordVisibility,
    handlePasswordVisibility,
    rightIcon,
    confirmPasswordVisibility,
    handleConfirmPasswordVisibility,
    confirmPasswordIcon,
  };
};
