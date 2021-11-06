import { StackActions, useNavigation } from '@react-navigation/core';
import * as Analytics from 'expo-firebase-analytics';
import * as Linking from 'expo-linking';
import React, { useEffect } from 'react';
import { ViewAllContainer } from '../../containers/gifts';

export const HomeScreen = () => {
  const navigation = useNavigation();
  const url = Linking.useURL();

  useEffect(() => {
    if (url) {
      const { path, queryParams } = Linking.parse(url);
      console.log({ path, queryParams });
      Analytics.logEvent('handle_url', {
        url,
        path,
        params: JSON.stringify(queryParams),
      });

      if (path === 'gift' && queryParams.id) {
        navigation.dispatch(StackActions.push('View', { id: queryParams.id }));
      } else if (path === 'About') {
        navigation.dispatch(StackActions.push('About'));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);

  return <ViewAllContainer />;
};
