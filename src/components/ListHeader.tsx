import {StyleSheet, Text, View} from 'react-native';
import React from 'react';

export const ListHeader = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.listItemText}>Change currency</Text>
    </View>
  );
};

export default ListHeader;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
  },
  listItemText: {color: 'white', fontSize: 24, fontFamily: 'Lato-Regular'},
});
