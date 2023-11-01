import {Dimensions, Pressable, StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import {Canvas, RoundedRect, useFont} from '@shopify/react-native-skia';
import {handleDate} from '../utils/handleDate';
import {useDerivedValue, withTiming} from 'react-native-reanimated';
import {GraphPeriods} from '../constants/time';

interface SelectionItemProps {
  setStartDate: (date: string) => void;
  setActiveItem: (itemIndex: number) => void;
  item: GraphPeriods;
  itemIndex: number;
  isActive: boolean;
}

const SelectionItem = ({
  setStartDate,
  setActiveItem,
  item,
  itemIndex,
  isActive,
}: SelectionItemProps) => {
  const textColor = isActive ? 'white' : 'lightgray';
  return (
    <Pressable
      onPress={() => {
        setStartDate(handleDate(item));
        setActiveItem(itemIndex);
      }}
      style={[styles.btn]}>
      <Text style={[styles.btnText, {color: textColor}]}>
        {item[0] + item[1].toUpperCase()}
      </Text>
    </Pressable>
  );
};

interface SelectionProps {
  setStartDate: (date: string) => void;
}

const {width} = Dimensions.get('window');

const SELECTION_HORIZONTAL_SPACING = 32;
const BUTTON_WIDTH = (width - SELECTION_HORIZONTAL_SPACING * 2) / 5;
const BUTTON_HEIGHT = 48;

export const Selection = ({setStartDate}: SelectionProps) => {
  const [activeItem, setActiveItem] = useState(0);

  const translateX = useDerivedValue(
    () => withTiming(BUTTON_WIDTH * activeItem, {duration: 300}),
    [activeItem],
  );
  const graphPeriods = [
    GraphPeriods.oneWeek,
    GraphPeriods.oneMonth,
    GraphPeriods.threeMonth,
    GraphPeriods.sixMonth,
    GraphPeriods.oneYear,
  ];

  return (
    <View style={styles.container}>
      <Canvas style={StyleSheet.absoluteFill}>
        <RoundedRect
          x={translateX}
          y={0}
          height={BUTTON_HEIGHT}
          width={BUTTON_WIDTH}
          r={32}
          color={'rgba(171,2,154,0.5)'}
        />
      </Canvas>
      {graphPeriods.map((item, index) => (
        <SelectionItem
          key={index}
          item={item}
          itemIndex={index}
          setActiveItem={setActiveItem}
          setStartDate={setStartDate}
          isActive={activeItem === index}
        />
      ))}
    </View>
  );
};

export default Selection;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignSelf: 'center',
  },
  btn: {
    height: BUTTON_HEIGHT,
    width: BUTTON_WIDTH,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnText: {
    fontSize: 20,
    color: 'white',
    fontFamily: 'Lato-Bold',
    textAlign: 'center',
  },
});
