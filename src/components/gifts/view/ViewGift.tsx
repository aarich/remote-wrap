import React, { memo } from 'react';
import { ImageSourcePropType, View } from 'react-native';
import { Card } from 'react-native-paper';
import { Button } from '../..';
import { Gift, WrapState } from '../../../utils';
import { giftCardStyles as styles } from '../styles';
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
  }: Props) => {
    return (
      <View>
        <Card>
          <Card.Title title={gift.title} subtitle={gift.message} />
          <Card.Content style={styles.zeroPadding}>
            <CoveredImage
              aboveSource={wrapSource}
              belowSource={giftSource}
              state={wrapState}
              onSetSquareWidth={() => null}
            />
          </Card.Content>
          <Card.Actions style={styles.flexEnd}>
            {onEdit ? (
              <Button onPress={onEdit} style={styles.button}>
                Edit
              </Button>
            ) : null}
            {onDelete ? (
              <Button onPress={onDelete} style={styles.button}>
                Delete
              </Button>
            ) : null}
            <Button onPress={onShare} style={styles.button}>
              Share
            </Button>
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
