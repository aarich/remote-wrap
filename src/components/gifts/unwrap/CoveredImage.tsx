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
  onSetSquareWidth,
}: Props) => {
  const width = useWindowDimensions().width;
  const clips: [number, number][] | boolean = useMemo(() => {
    if (typeof state === 'boolean') {
      return state;
    }

    const ret = [];
    for (let r = 0; r < state.length; r++) {
      for (let c = 0; c < state[r].length; c++) {
        if (state[r][c]) {
          ret.push([c, r]);
        }
      }
    }
    return ret;
  }, [state]);

  const [squareWidth, setSquareWidth] = useState(width / WRAP_WIDTH);

  useEffect(() => {
    if (
      Platform.OS !== 'web' &&
      typeof belowSource !== 'number' &&
      'uri' in belowSource
    ) {
      RNImage.getSize(belowSource.uri, (width, height) => {
        onSetSquareWidth(Math.min(width, height) / WRAP_WIDTH);
        setSquareWidth(Math.min(width, height) / WRAP_WIDTH);
      });
    } else {
      onSetSquareWidth(width / WRAP_WIDTH);
      setSquareWidth(width / WRAP_WIDTH);
    }
  }, [belowSource, onSetSquareWidth, width]);

  if (!aboveSource || !belowSource) {
    return <LoadingIndicator />;
  }
  console.log({ belowSource, aboveSource, width });

  if (typeof clips === 'boolean') {
    return (
      <Svg width={width} height={width}>
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
    <Svg width={width} height={width}>
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
