import {StyleSheet, View} from 'react-native';
import React from 'react';

export const LineSeparator = () => {
  return <View style={styles.separator} />;
};

const styles = StyleSheet.create({
  separator: {
    height: 1,
    width: '100%',
    backgroundColor: '#606060',
  },
});
