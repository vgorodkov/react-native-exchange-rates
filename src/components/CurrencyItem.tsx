import {StyleSheet, Text, Image, Pressable} from 'react-native';
import React, {memo} from 'react';

interface CurrencyItemProps {
  changeCurrency: (id: number) => void;
  name: string;
  id: number;
  img: number;
}

export const CurrencyItem = memo(
  ({changeCurrency, name, id, img}: CurrencyItemProps) => {
    return (
      <Pressable onPress={() => changeCurrency(id)} style={styles.currencyItem}>
        <Image style={styles.currencyImg} source={img} />
        <Text style={styles.currencyItemTxt}>{name}</Text>
      </Pressable>
    );
  },
);

const styles = StyleSheet.create({
  currencyItem: {
    borderWidth: 1,
    borderColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingHorizontal: 24,
    paddingVertical: 12,
    margin: 12,
    borderRadius: 16,
  },
  currencyItemTxt: {
    color: 'white',
    fontSize: 24,
    fontWeight: '600',
  },
  currencyImg: {
    width: 40,
    height: 40,
    borderRadius: 100,
  },
});
