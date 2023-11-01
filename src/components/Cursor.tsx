import {StyleSheet, View} from 'react-native';
import React from 'react';
import {Circle, Group, Paint, Text} from '@shopify/react-native-skia';
import {SharedValue, useDerivedValue} from 'react-native-reanimated';

export const Cursor = ({
  x,
  y,
}: {
  x: SharedValue<number>;
  y: SharedValue<number>;
}) => {
  const transform = useDerivedValue(() => [
    {translateX: x.value},
    {translateY: y.value},
  ]);

  return (
    <Group transform={transform}>
      <Circle cx={0} cy={0} r={27} color={'#F9C784'} opacity={0.15} />
      <Circle cx={0} cy={0} r={18} color={'#F9C784'} opacity={0.15} />
      <Circle cx={0} cy={0} r={9} color={'#F9C784'}>
        <Paint style="stroke" strokeWidth={2} color="white" />
      </Circle>
    </Group>
  );
};

export default Cursor;
