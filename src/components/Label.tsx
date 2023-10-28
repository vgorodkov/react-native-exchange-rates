import {useWindowDimensions} from 'react-native';
import React from 'react';
import {Text, matchFont, useFont} from '@shopify/react-native-skia';
import {
  SharedValue,
  interpolate,
  useDerivedValue,
} from 'react-native-reanimated';
import {LAYOUT} from '../constants/Layout';

interface LabelProps {
  max: number;
  min: number;
  y: SharedValue<number>;
  x: SharedValue<number>;
  dates: string[];
}
const format = (value: number) => {
  'worklet';
  return value
    .toFixed(3)
    .toString()
    .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
};

export const Label = ({y, max, min, x, dates}: LabelProps) => {
  const {width, height} = useWindowDimensions();
  const priceFontSize = 32;
  const dateFontSize = 20;
  const priceFont = useFont(
    require('../assets/fonts/Roboto-Bold.ttf'),
    priceFontSize,
  );
  const dateFont = useFont(
    require('../assets/fonts/Roboto-Bold.ttf'),
    dateFontSize,
  );
  const currentPrice = useDerivedValue(() => {
    return format(
      interpolate(
        y.value,
        [LAYOUT.spacing.GRAPH_TOP, height / 2 - LAYOUT.spacing.GRAPH_TOP],
        [max, min],
      ),
    );
  }, [y, max, min]);

  const priceWidth = priceFont?.getTextWidth(currentPrice.value) ?? 0;

  const selectedDate = useDerivedValue(() => {
    const fraction = x.value / width;
    const timeframes = dates.length;
    const currentPoint = Math.round(fraction * (timeframes - 1));

    return dates[currentPoint].slice(0, 10);
  });

  const dateWidth = dateFont?.getTextWidth(selectedDate.value) ?? 0;

  return (
    <>
      <Text
        style={'fill'}
        text={currentPrice}
        color={'white'}
        x={width / 2 - priceWidth / 2}
        y={priceFontSize}
        font={priceFont}
      />
      <Text
        style={'fill'}
        text={selectedDate}
        color={'white'}
        x={width / 2 - dateWidth / 2}
        y={priceFontSize * 2}
        font={dateFont}
      />
    </>
  );
};
