import * as Linking from 'expo-linking';
import React, { FC, Fragment, ReactNode } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Paragraph, Title, useTheme } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Constants from '../../config/constants';
import { ScreenProps } from '../../navigation/AppStack';

const p = (...c: ReactNode[]) => (
  <Paragraph>
    {Array.isArray(c) ? c.map((e, i) => <Fragment key={i}>{e}</Fragment>) : c}
  </Paragraph>
);
const t = (text: string) => <Title>{text}</Title>;

type Props = ScreenProps<'About'>;

export const AboutScreen: FC<Props> = () => {
  const theme = useTheme();
  const linkStyle = { color: theme.colors.primary };
  const bottomViewStyle = { height: useSafeAreaInsets().bottom };

  const a = (url: string, text: string) => (
    <Paragraph
      style={linkStyle}
      onPress={() => Linking.openURL('https://' + url)}
    >
      {text}
    </Paragraph>
  );

  return (
    <ScrollView style={styles.container}>
      {p(`Thanks for using ${Constants.appName}!`)}
      {p(
        'This project started when it became difficult to unwrap gifts in person. After sharing ' +
          "a simple website for my family's holidays in 2020, everyone agreed more people should be able to do this!"
      )}
      {t('How it works')}
      {p(
        'To share a present, simply hit the create button on the home screen. Upload a photo, choose a wrapping paper, and share the link!'
      )}
      {p(
        'The gift recipient can open the gift in the app or in a browser and scrub off the wrapping paper. ' +
          'Meanwhile, you can watch on your own device.'
      )}
      {p(
        'Note that anyone with the link can access your uploads until you delete them.'
      )}
      {t('Acknowledgements')}
      {p(
        'Thanks to the following open source software for making this project possible.'
      )}
      {[
        { name: 'Dreamhost', url: 'mrarich.com/url/dreamhostrw' },
        { name: 'Expo', url: 'expo.dev' },
        { name: 'GitHub', url: 'github.com' },
        { name: 'React Native', url: 'reactnative.dev' },
        {
          name: 'React Native Paper',
          url: 'callstack.github.io/react-native-paper/',
        },
      ].map((link, i) => (
        <Paragraph key={i} style={styles.list}>
          {a(link.url, link.name)}
        </Paragraph>
      ))}
      {t("Who's building this?")}
      {p(
        'You can find out more about the developer ',
        a('mrarich.com/about', 'here'),
        '.'
      )}
      {t('Terms of use')}
      {p(
        'This app involves user-generated content. By using the app you agree ' +
          'to only generate family-friendly content. You may ',
        a('mrarich.com/contact', 'report'),
        ' any inappropriate content for review.'
      )}
      {t('Privacy')}
      {p(
        'You can find the full privacy policy for this app ',
        a('mrarich.com/privacy', 'here'),
        '.'
      )}

      {p(
        'In brief, no information is stored unless you explicitly provide it.' +
          ' No app information is shared except where required by law.'
      )}
      {t('Ads')}
      {p(
        'App stores charge to publish apps. As a hobby project, this app' +
          ' includes ads to offset the cost. Although they are intended to be' +
          ' unobtrusive, disabling ads is coming soon to this app!'
      )}
      {t('Looking for more fun?')}
      {p(
        'Create your own Bingo boards and compete with friends. ',
        a(
          Platform.select({
            android:
              'play.google.com/store/apps/details?id=rich.alex.CustomBingo',
            ios: 'apps.apple.com/app/apple-store/id1030627713?pt=117925864&ct=presencerefer&mt=8',
            default: 'bingo.mrarich.com/app',
          }),
          'Custom Bingo'
        ),
        ' is freely available for iOS and Android!'
      )}
      {Platform.OS === 'ios'
        ? p(
            'Also try out the handy ',
            a(
              'apps.apple.com/app/apple-store/id1552960395?pt=117925864&ct=presencerefer&mt=8',
              'Note Widget'
            ),
            ' app for iOS.'
          )
        : null}
      {t('Copyright')}
      {p(
        `Version ${
          Constants.displayVersion
        } \u00A9 ${new Date().getFullYear()} Alex Rich`
      )}
      <View style={bottomViewStyle} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 8 },
  list: { paddingHorizontal: 12 },
});
