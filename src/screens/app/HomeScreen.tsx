import { StackActions, useNavigation } from '@react-navigation/core';
import * as Linking from 'expo-linking';
import React, { useEffect, useReducer } from 'react';
import { ViewAllContainer } from '../../containers/gifts';

export const HomeScreen = () => {
  const [hasNavigated, setHasNavigated] = useReducer(() => true, false);
  const navigation = useNavigation();
  const url = Linking.useURL();

  useEffect(() => {
    if (url && !hasNavigated) {
      const { path, queryParams } = Linking.parse(url);
      console.log({ path, queryParams });

      if (path === 'gift' && queryParams.id) {
        navigation.dispatch(StackActions.push('View', { id: queryParams.id }));
        setHasNavigated();
      } else if (path === 'About') {
        navigation.dispatch(StackActions.push('About'));
        setHasNavigated();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);

  return <ViewAllContainer />;
};
