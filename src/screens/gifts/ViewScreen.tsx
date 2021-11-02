import React from 'react';
import { View } from '../../components';
import { ViewContainer } from '../../containers/gifts';
import { ScreenProps } from '../../navigation/AppStack';

type Props = ScreenProps<'View'>;

export const ViewScreen = ({ route, navigation }: Props) => {
  const { id } = route.params;

  const onNavigateToUnwrap = () => navigation.replace('Unwrap', { id });
  const onDone = () => navigation.pop();

  return (
    <View isSafe>
      <ViewContainer
        id={id}
        onNavigateToUnwrap={onNavigateToUnwrap}
        onDone={onDone}
      />
    </View>
  );
};
