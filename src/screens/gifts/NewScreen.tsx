import React from 'react';
import { View } from '../../components';
import { NewGiftContainer } from '../../containers/gifts';
import { ScreenProps } from '../../navigation/AppStack';
import { formStyles } from '../../utils';

type Props = ScreenProps<'Create'>;

export const NewScreen = ({ navigation }: Props) => {
  return (
    <View isSafe style={formStyles.container}>
      <NewGiftContainer navigation={navigation} />
    </View>
  );
};
