import { useTheme } from '@react-navigation/native';
import React from 'react';
import { Image, StyleSheet } from 'react-native';
import { Images } from '../config';

export const Logo = () => {
  const isDark = useTheme().dark;
  const uri = isDark ? Images.logoForDarkMode : Images.logoForLightMode;
  return <Image source={uri} style={styles.image} />;
};

const styles = StyleSheet.create({
  image: {
    width: 200,
    height: 200,
  },
});
