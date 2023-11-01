import {useWindowDimensions} from 'react-native';
import React from 'react';
import {Text, matchFont, useFont, useFonts} from '@shopify/react-native-skia';
import {
  SharedValue,
  interpolate,
  useDerivedValue,
} from 'react-native-reanimated';
import {LAYOUT} from '../constants/layout';

interface LabelProps {
  max: number;
  min: number;
  y: SharedValue<number>;
  todaysRate: number;
}
const format = (value: number) => {
  'worklet';
  return value.toFixed(3).toString();
};

const formatDiffPrice = (value: number) => {
  'worklet';
  if (value > 0) {
    return `+${value.toFixed(3)}`;
  } else {
    return value.toFixed(3).toString();
  }
};

const TOP_PADDING = 24;
const HORIZONTAL_PADDING = 32;

export const Label = ({y, max, min, todaysRate}: LabelProps) => {
  const {width, height} = useWindowDimensions();

  const fontMgr = useFonts({
    Lato: [
      require('../assets/fonts/Lato-Regular.ttf'),
      require('../assets/fonts/Lato-Bold.ttf'),
      require('../assets/fonts/Lato-Black.ttf'),
    ],
  });

  const currentPrice = useDerivedValue(() => {
    return format(
      interpolate(
        y.value,
        [
          LAYOUT.spacing.GRAPH_VERTICAL,
          height / 2 - LAYOUT.spacing.GRAPH_VERTICAL,
        ],
        [max, min],
      ),
    );
  }, [y, max, min]);

  const priceDiff = useDerivedValue(() => {
    return formatDiffPrice(+currentPrice.value - todaysRate);
  });

  const priceDiffColor = useDerivedValue(() => {
    if (priceDiff.value[0] === '+') {
      return '#42E2B8';
    } else if (priceDiff.value.length === 5) {
      return 'yellow';
    } else {
      return 'red';
    }
  });

  if (!fontMgr) {
    return null;
  }

  const priceLabelFontStyle = {
    fontFamily: 'Lato',
    fontWeight: 'bold',
    fontSize: 18,
  } as const;

  const priceFontStyle = {
    fontFamily: 'Lato',
    fontWeight: '900',
    fontSize: 32,
  } as const;

  const priceDiffFontStyle = {
    fontFamily: 'Lato',
    fonWeight: '900',
    fontSize: 16,
  } as const;

  const priceLabelFont = matchFont(priceLabelFontStyle, fontMgr);

  const priceFont = matchFont(priceFontStyle, fontMgr);

  const priceDiffFont = matchFont(priceDiffFontStyle, fontMgr);

  return (
    <>
      <Text
        style={'fill'}
        text={'CURRENT RATE'}
        color={'white'}
        font={priceLabelFont}
        x={HORIZONTAL_PADDING}
        y={TOP_PADDING}
      />
      <Text
        style={'fill'}
        text={currentPrice}
        color={'white'}
        x={HORIZONTAL_PADDING}
        y={TOP_PADDING + 32 + 8} //fontSize + gap
        font={priceFont}
      />
      <Text
        style={'fill'}
        text={priceDiff}
        color={priceDiffColor} //#42E2B8
        x={HORIZONTAL_PADDING}
        y={TOP_PADDING + 14 + 32 + 8 * 2} //fontSize+prevFontSize + gap + gap
        font={priceDiffFont}
      />
    </>
  );
};
