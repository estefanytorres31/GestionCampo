import React, { useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Animated, Dimensions } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

const SubcategoryScreen = ({ route, navigation }) => {
    const { category, subcategories, clase } = route.params;

    const fadeAnim = React.useRef(new Animated.Value(0)).current;
    const translateY = React.useRef(new Animated.Value(50)).current;

    useEffect(() => {
        navigation.setOptions({ title: category });
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 500,
                useNativeDriver: true,
            }),
            Animated.timing(translateY, {
                toValue: 0,
                duration: 500,
                easing: Animated.Easing.out(Animated.Easing.cubic),
                useNativeDriver: true,
            }),
        ]).start();
    }, [category, navigation]);

    return (
        <Animated.View style={[styles.container, { opacity: fadeAnim, transform: [{ translateY }] }]}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Subcategorías de {category}</Text>
            </View>

            <View style={styles.buttonsContainer}>
                {subcategories.map(({ icon, text, color }, index) => (
                    <TouchableOpacity
                        key={index}
                        style={[styles.button, { backgroundColor: color }]}
                        onPress={() => navigation.navigate("SubcategoryScreen", { category, subcategory: text, clase })}
                    >
                        <View style={styles.buttonContent}>
                            <MaterialCommunityIcons name={icon} size={28} color="#fff" />
                            <Text style={styles.buttonText}>{text}</Text>
                        </View>
                    </TouchableOpacity>
                ))}
            </View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "rgba(255, 255, 255, 0.85)",
        paddingHorizontal: 16,
        paddingTop: 40,
    },
    header: {
        alignItems: "center",
        marginBottom: 20,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#1a237e",
    },
    buttonsContainer: {
        flexDirection: "column",
    },
    button: {
        marginVertical: 8,
        padding: 12,
        borderRadius: 8,
        flexDirection: "row",
        alignItems: "center",
    },
    buttonContent: {
        flexDirection: "row",
        alignItems: "center",
    },
    buttonText: {
        marginLeft: 10,
        fontSize: 18,
        fontWeight: "bold",
        color: "#fff",
    },
});

export default SubcategoryScreen;
