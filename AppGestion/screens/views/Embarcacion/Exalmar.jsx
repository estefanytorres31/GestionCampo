import React, { useEffect } from "react";
import { 
    View, 
    Text, 
    TouchableOpacity, 
    StyleSheet, 
    Animated 
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const Exalmar = ({ route, navigation }) => {
    const { clase } = route.params || {};
    const fadeAnim = React.useRef(new Animated.Value(0)).current;
    const scaleAnim = React.useRef(new Animated.Value(0.9)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 600,
                useNativeDriver: true,
            }),
            Animated.spring(scaleAnim, {
                toValue: 1,
                friction: 8,
                tension: 40,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    const categories = [
        { icon: "boat", text: "Don Alfredo", color: "#00897B", hasSubcategories: true },
        { icon: "boat", text: "Caribe", color: "#00897B", hasSubcategories: false },
        { icon: "boat", text: "Ancash 2", color: "#00897B", hasSubcategories: false },
        { icon: "boat", text: "Carmencita", color: "#00897B", hasSubcategories: false },
        { icon: "boat", text: "Creta", color: "#00897B", hasSubcategories: false },
    ];

    const handleCategoryPress = (text, hasSubcategories) => {
        if (hasSubcategories) {
            navigation.navigate("SubcategoryScreen", { category: text, subcategories: categories, clase });
        } else {
            navigation.navigate("SubcategoryScreen", { category: text, clase });
        }
    };

    return (
        <Animated.View style={[styles.container, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Selecciona una Embarcación</Text>
                <Text style={styles.headerSubtitle}>Seleccione para ver más detalles</Text>
            </View>

            <View style={styles.buttonsContainer}>
                {categories.map(({ icon, text, color, hasSubcategories }, index) => (
                    <TouchableOpacity
                        key={index}
                        style={[styles.button, { backgroundColor: color }]}
                        onPress={() => handleCategoryPress(text, hasSubcategories)}
                        activeOpacity={0.8}
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
    },
    header: {
        alignItems: "center",
        marginVertical: 20,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#1a237e",
    },
    headerSubtitle: {
        fontSize: 16,
        color: "#5c6bc0",
    },
    buttonsContainer: {
        paddingHorizontal: 16,
    },
    button: {
        marginVertical: 8,
        borderRadius: 12,
        padding: 12,
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

export default Exalmar;
