import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const Button = ({ icon, size = 28, color = '#f1f1f1', style, onPress, text }) => {
    return (
        <TouchableOpacity 
            style={[styles.button, style]}
            onPress={onPress}
        >
            <View style={styles.iconContainer}>
                <MaterialIcons 
                    name={icon}
                    size={size ? size : 28}
                    color={color ? color : '#f1f1f1'}
                />
                {text && <Text style={styles.buttonText}>{text}</Text>}
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    iconContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 8,
    }
});

export default Button;