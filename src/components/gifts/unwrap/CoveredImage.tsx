import React, { memo, useEffect, useMemo, useState } from 'react';
import {
  Image as RNImage,
  ImageSourcePropType,
  Platform,
  useWindowDimensions,
} from 'react-native';
import Svg, { ClipPath, Defs, Image, Rect } from 'react-native-svg';
import { LoadingIndicator } from '../..';
import { WrapState, WRAP_WIDTH } from '../../../utils';

type Props = {
  belowSource: ImageSourcePropType;
  aboveSource: ImageSourcePropType;
  state: WrapState;
  squareWidth: number;
  onSetSquareWidth: (width: number) => void;
};

const squarePercent = `${100 / WRAP_WIDTH}%`;

const getSource = (original: ImageSourcePropType) => {
  if (Platform.OS === 'web') {
    if (typeof original === 'object' && 'uri' in original) {
      return original.uri;
    }
  }

  return original;
};

const CoveredImage = ({
  aboveSource,
  belowSource,
  state,
  squareWidth,
  onSetSquareWidth,
}: Props) => {
  const width = useWindowDimensions().width;
  const [imageWidth, setImageWidth] = useState(width);
  const clips: [number, number][] | boolean = useMemo(() => {
    if (typeof state === 'boolean') {
      return state;
    }

    const ret: [number, number][] = [];
    for (let r = 0; r < state.length; r++) {
      for (let c = 0; c < state[r].length; c++) {
        if (state[r][c]) {
          ret.push([c, r]);
        }
      }
    }
    return ret;
  }, [state]);

  useEffect(() => {
    onSetSquareWidth(imageWidth / WRAP_WIDTH);
  }, [imageWidth, onSetSquareWidth]);

  useEffect(() => {
    if (Platform.OS === 'web' && belowSource && aboveSource) {
      RNImage.getSize(getSource(belowSource) as string, (w, h) => {
        setImageWidth((old) => Math.min(w, h, old));
      });
      RNImage.getSize(getSource(aboveSource) as string, (w, h) => {
        setImageWidth((old) => Math.min(w, h, old));
      });
    }
  }, [aboveSource, belowSource]);

  if (!aboveSource || !belowSource) {
    return <LoadingIndicator />;
  }

  if (typeof clips === 'boolean') {
    return (
      <Svg width={imageWidth} height={imageWidth}>
        <Image
          x="0"
          y="0"
          width="100%"
          height="100%"
          preserveAspectRatio="xMidYMid slice"
          // @ts-ignore Web requires href to be just a string
          href={getSource(clips ? aboveSource : belowSource)}
        />
      </Svg>
    );
  }

  return (
    <Svg width={imageWidth} height={imageWidth}>
      <Defs>
        <ClipPath id="clip">
          {clips.map(([x, y]) => (
            <Rect
              key={`${x}-${y}`}
              width={squarePercent}
              height={squarePercent}
              x={x * squareWidth}
              y={y * squareWidth}
            />
          ))}
        </ClipPath>
      </Defs>
      <Image
        x="0"
        y="0"
        width="100%"
        height="100%"
        preserveAspectRatio="xMidYMid slice"
        // @ts-ignore Web requires href to be just a string
        href={getSource(belowSource)}
      />
      <Image
        x="0"
        y="0"
        width="100%"
        height="100%"
        preserveAspectRatio="xMidYMid slice"
        // @ts-ignore Web requires href to be just a string
        href={getSource(aboveSource)}
        clipPath="url(#clip)"
      />
    </Svg>
  );
};

export default memo<Props>(CoveredImage);
