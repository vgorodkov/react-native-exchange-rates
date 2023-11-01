import {StyleSheet, Text, Image, Pressable, View} from 'react-native';
import React, {memo} from 'react';

interface CurrencyItemProps {
  changeCurrency: (id: number) => void;
  name: string;
  id: number;
  img: number;
  isActive: boolean;
}

export const CurrencyItem = memo(
  ({changeCurrency, name, id, img, isActive}: CurrencyItemProps) => {
    return (
      <Pressable
        onPress={() => changeCurrency(id)}
        style={() => [styles.currencyItem]}>
        <View style={{flexDirection: 'row', gap: 16}}>
          <Image style={styles.currencyImg} source={img} />
          <Text style={styles.currencyItemTxt}>{name}</Text>
        </View>
        {isActive && <View style={styles.activityIndicator} />}
      </Pressable>
    );
  },
);

const styles = StyleSheet.create({
  currencyItem: {
    borderColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,

    paddingVertical: 12,
  },
  currencyItemTxt: {
    color: 'white',
    fontSize: 24,
    fontWeight: '600',
  },
  currencyImg: {
    width: 32,
    height: 32,
    borderRadius: 100,
  },
  activityIndicator: {
    width: 32,
    height: 32,
    backgroundColor: 'rgba(171, 2, 154, 1)',
    borderRadius: 100,
  },
});
