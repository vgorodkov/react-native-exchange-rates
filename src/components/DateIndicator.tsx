import {StyleSheet} from 'react-native';
import React from 'react';
import {Rect, Text, useFont} from '@shopify/react-native-skia';
import {SharedValue, useDerivedValue} from 'react-native-reanimated';

interface DateIndicatorProps {
  x: SharedValue<number>;
  height: number;
  width: number;
  dates: string[];
}

const INDICATOR_WIDTH = 16;

export const DateIndicator = ({
  x,
  height,
  dates,
  width,
}: DateIndicatorProps) => {
  const fontSize = 16;
  const font = useFont(require('../assets/fonts/Lato-Bold.ttf'), fontSize);

  const rectX = useDerivedValue(() => {
    return x.value - INDICATOR_WIDTH / 2;
  });

  const selectedDate = useDerivedValue(() => {
    const fraction = x.value / width;
    const timeframes = dates?.length;
    const currentPoint = Math.round(fraction * (timeframes - 1));

    return dates[currentPoint]?.slice(0, 10);
  });

  const dateFontWidth = font?.getTextWidth(selectedDate.value);

  const dateX = useDerivedValue(() => {
    if (x.value - dateFontWidth / 2 < 0) {
      return 0;
    } else if (x.value + dateFontWidth / 2 > width) {
      return width - dateFontWidth;
    }
    return x.value - dateFontWidth / 2;
  });

  return (
    <>
      <Text x={dateX} y={0} text={selectedDate} color={'white'} font={font} />
      {/*  <Rect
        x={rectX}
        y={0}
        width={INDICATOR_WIDTH}
        height={height}
        color={'rgba(179,222,193,0.5)'}
      /> */}
    </>
  );
};

const styles = StyleSheet.create({});
