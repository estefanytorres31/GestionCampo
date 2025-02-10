import React from 'react';
import { Picker } from '@react-native-picker/picker';
import { StyleSheet, View } from 'react-native';

const Select = ({ placeholder, items, value, onValueChange }) => {
  return (
    <View style={styles.selectContainer}>
      <Picker
        selectedValue={value}
        onValueChange={onValueChange}
        style={styles.picker}
      >
        <Picker.Item label={placeholder} value={null} color="#999" />
        {items.map((item, index) => (
          <Picker.Item key={index} label={item.label} value={item.value} />
        ))}
      </Picker>
    </View>
  );
};

const styles = StyleSheet.create({
  selectContainer: {
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginVertical: 8,
    height: 40,
    justifyContent: 'center',
  },
  picker: {
    fontSize: 16,
    color: '#000',
  },
});

export default Select;
