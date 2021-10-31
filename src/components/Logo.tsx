import React, { ComponentProps } from 'react';
import { Image, StyleSheet } from 'react-native';

type Props = {
  uri: ComponentProps<typeof Image>['source'];
};
export const Logo = ({ uri }: Props) => {
  return <Image source={uri} style={styles.image} />;
};

const styles = StyleSheet.create({
  image: {
    width: 200,
    height: 200,
  },
});
