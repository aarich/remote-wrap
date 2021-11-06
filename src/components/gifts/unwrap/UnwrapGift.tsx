import React, { useCallback, useState } from 'react';
import {
  Animated,
  ImageSourcePropType,
  LayoutChangeEvent,
  View,
} from 'react-native';
import { PanGestureHandler } from 'react-native-gesture-handler';
import { Card, Paragraph } from 'react-native-paper';
import { Button } from '../..';
import {
  FULLY_UNWRAPPED_STATE,
  FULLY_WRAPPED_STATE,
  Gift,
  WrapState,
} from '../../../utils';
import { giftCardStyles } from '../styles';
import CoveredImage from '../unwrap/CoveredImage';

type Props = {
  gift: Gift;
  giftSource: ImageSourcePropType;
  wrapSource: ImageSourcePropType;
  wrapState: WrapState;
  onResetWrap: VoidFunction;
  onRemoveWrap: VoidFunction;
  onUncoverWrap: (x: number, y: number) => void;
  onDone?: VoidFunction;
  isDemo?: boolean;
};

export const UnwrapGift = ({
  gift,
  giftSource,
  wrapSource,
  wrapState,
  onResetWrap,
  onRemoveWrap,
  onUncoverWrap,
  onDone,
  isDemo,
}: Props) => {
  const [squareWidth, setSquareWidth] = useState(100000);
  const [minHeight, setMinTextHeight] = useState<number>();

  const handleTouch = useCallback(
    (x, y) => {
      // map x,y coordinates to spaces
      onUncoverWrap(Math.round(x / squareWidth), Math.round(y / squareWidth));
    },
    [onUncoverWrap, squareWidth]
  );

  const handleTextViewLayout = useCallback(
    (e: LayoutChangeEvent) => setMinTextHeight(e.nativeEvent.layout.height),
    []
  );

  return (
    <Card style={giftCardStyles.card}>
      <Card.Title
        title={gift.title}
        subtitle={gift.message}
        subtitleNumberOfLines={100}
      />
      <Card.Content style={giftCardStyles.zeroPadding}>
        <View
          onTouchStart={({ nativeEvent: { locationX: x, locationY: y } }) => {
            handleTouch(x, y);
          }}
        >
          <PanGestureHandler
            minDist={0}
            activeOffsetX={[-1, 1]}
            activeOffsetY={[-1, 1]}
            onGestureEvent={({ nativeEvent: { x, y } }) => handleTouch(x, y)}
          >
            <Animated.View>
              <CoveredImage
                aboveSource={wrapSource}
                belowSource={giftSource}
                state={wrapState}
                squareWidth={squareWidth}
                onSetSquareWidth={(w) => setSquareWidth(w)}
              />
            </Animated.View>
          </PanGestureHandler>
        </View>
        {isDemo ? null : (
          <View
            style={[giftCardStyles.text, { minHeight }]}
            onLayout={handleTextViewLayout}
          >
            {wrapState === FULLY_UNWRAPPED_STATE ? (
              <Paragraph>You&apos;ve revealed the image!</Paragraph>
            ) : (
              <>
                <Paragraph>
                  Scratch the picture above to remove the wrapping paper and
                  reveal the hidden image!
                </Paragraph>
                <Paragraph>
                  Other people who are viewing this gift can see it happen as
                  you go!
                </Paragraph>
              </>
            )}
          </View>
        )}
      </Card.Content>
      <Card.Actions style={giftCardStyles.flexEnd}>
        <Button
          style={giftCardStyles.button}
          onPress={onResetWrap}
          disabled={wrapState === FULLY_WRAPPED_STATE}
        >
          Re-wrap
        </Button>
        <Button
          style={giftCardStyles.button}
          onPress={onRemoveWrap}
          disabled={wrapState === FULLY_UNWRAPPED_STATE}
        >
          Reveal
        </Button>
        {onDone ? (
          <Button
            style={giftCardStyles.button}
            onPress={onDone}
            mode="outlined"
          >
            Done
          </Button>
        ) : null}
      </Card.Actions>
    </Card>
  );
};
