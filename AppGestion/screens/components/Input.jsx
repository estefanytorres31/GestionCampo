import React from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

const Input = ({ placeholder, value, onChangeText }) => {
  return (
    <View style={styles.inputContainer}>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        placeholderTextColor="#999"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 40,
    justifyContent: 'center',
    marginVertical: 8,
  },
  input: {
    fontSize: 16,
    color: '#000',
  },
});

export default Input;
