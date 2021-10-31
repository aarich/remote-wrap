import React from 'react';
import { styles as formStyles } from '..';
import { View } from '../../components';
import { NewGiftContainer } from '../../containers/gifts';
import { ScreenProps } from '../../navigation/AppStack';

type Props = ScreenProps<'Create'>;

export const NewScreen = ({ navigation }: Props) => {
  return (
    <View isSafe style={formStyles.container}>
      <NewGiftContainer navigation={navigation} />
    </View>
  );
};
