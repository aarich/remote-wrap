import React, { memo, useMemo } from 'react';
import { Dimensions, ImageSourcePropType } from 'react-native';
import Svg, { ClipPath, Defs, Image, Rect } from 'react-native-svg';
import { LoadingIndicator } from '../..';
import { WrapState, WRAP_WIDTH } from '../../../utils';

type Props = {
  belowSource: ImageSourcePropType;
  aboveSource: ImageSourcePropType;
  state: WrapState;
};

const width = Dimensions.get('window').width;
const squarePercent = `${100 / WRAP_WIDTH}%`;
export const squareWidth = width / WRAP_WIDTH;

const CoveredImage = ({ aboveSource, belowSource, state }: Props) => {
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

  if (!aboveSource || !belowSource) {
    return <LoadingIndicator />;
  }

  if (typeof clips === 'boolean') {
    return (
      <Svg width={width} height={width}>
        <Image
          x="0"
          y="0"
          width="100%"
          height="100%"
          preserveAspectRatio="xMidYMid slice"
          href={clips ? aboveSource : belowSource}
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
        href={belowSource}
      />
      <Image
        x="0"
        y="0"
        width="100%"
        height="100%"
        preserveAspectRatio="xMidYMid slice"
        href={aboveSource}
        clipPath="url(#clip)"
      />
    </Svg>
  );
};

export default memo<Props>(CoveredImage);
