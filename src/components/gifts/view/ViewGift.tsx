import React, { memo, useState } from 'react';
import { ImageSourcePropType, Platform, View } from 'react-native';
import { Card, Divider, Menu, Paragraph } from 'react-native-paper';
import { Button, IconName, Icons } from '../..';
import { Gift, WrapState } from '../../../utils';
import { giftCardStyles, giftCardStyles as styles } from '../styles';
import CoveredImage from '../unwrap/CoveredImage';

type Props = {
  onNavigateToUnwrap: () => void;
  gift: Gift;
  giftSource: ImageSourcePropType;
  wrapSource: ImageSourcePropType;
  wrapState: WrapState;
  onEdit?: VoidFunction;
  onDelete?: VoidFunction;
  onDone: VoidFunction;
  onShare: VoidFunction;
  onOpenInApp?: VoidFunction;
};

export const ViewGift = memo(
  ({
    gift,
    giftSource,
    wrapSource,
    wrapState,
    onNavigateToUnwrap,
    onEdit,
    onDelete,
    onDone,
    onShare,
    onOpenInApp,
  }: Props) => {
    const [menuVisible, setMenuVisible] = useState(false);

    const [squareWidth, setSquareWidth] = useState(1);
    let followCount: string;
    if (gift.following.length == 0) {
      followCount = 'No logged-in users have seen this yet.';
    } else if (gift.following.length === 1) {
      followCount = 'Gift viewed by 1 other logged in user.';
    } else {
      followCount = `Gift viewed by ${gift.following.length} other logged in users.`;
    }

    const menuItems: (
      | undefined
      | { onPress: VoidFunction; title: string; icon: IconName }
    )[] = [
      {
        title: 'Share',
        onPress: onShare,
        icon: Platform.select({ web: Icons.LINK, default: Icons.SHARE }),
      },
      undefined,
    ];
    if (onOpenInApp) {
      menuItems.push({
        onPress: onOpenInApp,
        title: 'Open In App',
        icon: Icons.SHARE,
      });
    }
    if (onEdit) {
      menuItems.push({ onPress: onEdit, title: 'Edit', icon: Icons.EDIT });
    }
    if (onDelete) {
      menuItems.push({ onPress: onDelete, title: 'Delete', icon: Icons.TRASH });
    }

    return (
      <View>
        <Card style={giftCardStyles.card}>
          <Card.Title title={gift.title} subtitle={gift.message} />
          <Card.Content style={styles.zeroPadding}>
            <CoveredImage
              aboveSource={wrapSource}
              belowSource={giftSource}
              state={wrapState}
              squareWidth={squareWidth}
              onSetSquareWidth={setSquareWidth}
            />
            <Paragraph style={styles.text}>{followCount}</Paragraph>
          </Card.Content>
          <Card.Actions style={styles.flexEnd}>
            <Menu
              visible={menuVisible}
              onDismiss={() => setMenuVisible(false)}
              anchor={
                <Button onPress={() => setMenuVisible(true)}>More</Button>
              }
            >
              {menuItems.map((m, i) =>
                m ? (
                  <Menu.Item
                    key={i}
                    title={m.title}
                    onPress={() => {
                      setMenuVisible(false);
                      m.onPress();
                    }}
                    icon={m.icon}
                  />
                ) : (
                  <Divider key={i} />
                )
              )}
            </Menu>

            <Button mode="outlined" onPress={onDone} style={styles.button}>
              Back
            </Button>
            <Button
              mode="contained"
              onPress={onNavigateToUnwrap}
              style={styles.button}
            >
              Unwrap
            </Button>
          </Card.Actions>
        </Card>
      </View>
    );
  }
);
