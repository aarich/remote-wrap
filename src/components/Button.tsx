import React, { ComponentPropsWithoutRef, FC } from 'react';
import { Button as RNPButton } from 'react-native-paper';

type Props = ComponentPropsWithoutRef<typeof RNPButton>;

export const Button: FC<Props> = (props) => {
  return <RNPButton {...props} />;
  // const styleCB = useCallback(
  //   ({ pressed }) => [style, { opacity: pressed ? activeOpacity : 1 }],
  //   [style, activeOpacity]
  // );

  // if (borderless) {
  //   return (
  //     <Pressable onPress={onPress} style={styleCB}>
  //       <Text style={styles.borderlessButtonText}>{title}</Text>
  //     </Pressable>
  //   );
  // }

  // return <RNPButton onPress={onPress}>{title}</RNPButton>;
};

// const styles = StyleSheet.create({
//   borderlessButtonText: {
//     fontSize: 16,
//     color: Colors.blue,
//   },
// });
