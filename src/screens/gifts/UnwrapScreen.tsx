import React from 'react';
import { View } from '../../components';
import { UnwrapContainer } from '../../containers/gifts/UnwrapContainer';
import { ScreenProps } from '../../navigation/AppStack';

type Props = ScreenProps<'Unwrap'>;

export const UnwrapScreen = ({ route, navigation }: Props) => {
  const { id } = route.params;
  return (
    <View isSafe>
      <UnwrapContainer id={id} onDone={() => navigation.pop()} />
    </View>
  );
};
