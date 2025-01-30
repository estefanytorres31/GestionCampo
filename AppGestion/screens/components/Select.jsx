import React from 'react';
import RNPickerSelect from 'react-native-picker-select';
import { StyleSheet, View } from 'react-native';

const Select = ({ placeholder, items, value, onValueChange }) => {
  return (
    <View style={styles.selectContainer}>
      <RNPickerSelect
        onValueChange={onValueChange}
        items={items}
        value={value}
        placeholder={{
          label: placeholder,
          value: null,
          color: '#999',
        }}
        style={pickerSelectStyles}
        useNativeAndroidPickerStyle={false}
      />
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
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    color: '#000',
    paddingVertical: 8,
  },
  inputAndroid: {
    fontSize: 16,
    color: '#000',
  },
});

export default Select;
