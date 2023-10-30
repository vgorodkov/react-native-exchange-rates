import {Pressable, StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import {Canvas, RoundedRect} from '@shopify/react-native-skia';
import {handleDate} from '../utils/handleDate';
import {useDerivedValue, withSpring} from 'react-native-reanimated';
import {GraphPeriods} from '../constants/time';

interface SelectionProps {
  setStartDate: (date: string) => void;
}

const BUTTON_WIDTH = 50;

export const Selection = ({setStartDate}: SelectionProps) => {
  const [active, setActive] = useState(0);

  const translateX = useDerivedValue(
    () => withSpring(BUTTON_WIDTH * active),
    [active],
  );
  const graphPeriods = [
    GraphPeriods.oneWeek,
    GraphPeriods.oneMonth,
    GraphPeriods.threeMonth,
    GraphPeriods.sixMonth,
    GraphPeriods.oneYear,
  ];

  return (
    <View style={styles.root}>
      <View style={styles.container}>
        <Canvas style={StyleSheet.absoluteFill}>
          <RoundedRect
            x={translateX}
            y={0}
            height={64}
            width={50}
            r={16}
            color={'#9999C3'}
          />
        </Canvas>
        {graphPeriods.map((item, index) => (
          <Pressable
            key={index}
            onPress={() => {
              setStartDate(handleDate(item));
              setActive(index);
            }}
            style={styles.btn}>
            <Text style={styles.btnText}>{item[0] + item[1]}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
};

export default Selection;

const styles = StyleSheet.create({
  root: {paddingHorizontal: 16},
  container: {
    borderRadius: 16,
    flexDirection: 'row',
    backgroundColor: '#493548',
    alignSelf: 'center',
  },
  btn: {
    height: 64,
    width: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
  },
  btnText: {
    fontSize: 16,
    color: 'white',
    fontWeight: '700',
    textAlign: 'center',
  },
});
