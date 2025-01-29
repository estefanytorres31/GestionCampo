import React, { useEffect } from "react";
import { 
    View, 
    Text, 
    TouchableOpacity, 
    StyleSheet, 
    Animated,
    Dimensions,
    ScrollView
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const { width } = Dimensions.get('window');

const tasa = ({ route, navigation }) => {
    const { clase } = route.params || {};
    const fadeAnim = React.useRef(new Animated.Value(0)).current;
    const scaleAnim = React.useRef(new Animated.Value(0.9)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
            }),
            Animated.spring(scaleAnim, {
                toValue: 1,
                friction: 6,
                tension: 40,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    const categories = [
        { icon: "anchor", text: "Tasa 17", color: "#7fa23d", hasSubcategories: true },
        { icon: "ship-wheel", text: "Tasa 21", color: "#7fa23d", hasSubcategories: true },
        { icon: "anchor", text: "Tasa 22", color: "#7fa23d", hasSubcategories: true },
        { icon: "ship-wheel", text: "Tasa 23", color: "#7fa23d", hasSubcategories: true },
        { icon: "anchor", text: "Tasa 31", color: "#7fa23d", hasSubcategories: true },
        { icon: "ship-wheel", text: "Tasa 32", color: "#7fa23d", hasSubcategories: true },
        { icon: "anchor", text: "Tasa 34", color: "#7fa23d", hasSubcategories: true },
        { icon: "ship-wheel", text: "Tasa 36", color: "#7fa23d", hasSubcategories: true },
        { icon: "anchor", text: "Tasa 37", color: "#7fa23d", hasSubcategories: true },
        { icon: "ship-wheel", text: "Tasa 38", color: "#7fa23d", hasSubcategories: true },
        { icon: "anchor", text: "Tasa 41", color: "#7fa23d", hasSubcategories: true },
        { icon: "ship-wheel", text: "Tasa 42", color: "#7fa23d", hasSubcategories: true },
        { icon: "anchor", text: "Tasa 43", color: "#7fa23d", hasSubcategories: true },
        { icon: "ship-wheel", text: "Tasa 44", color: "#7fa23d", hasSubcategories: true },
        { icon: "anchor", text: "Tasa 51", color: "#7fa23d", hasSubcategories: true },
        { icon: "ship-wheel", text: "Tasa 52", color: "#7fa23d", hasSubcategories: true },
        { icon: "anchor", text: "Tasa 53", color: "#7fa23d", hasSubcategories: true },
        { icon: "ship-wheel", text: "Tasa 54", color: "#7fa23d", hasSubcategories: true },
        { icon: "anchor", text: "Tasa 55", color: "#7fa23d", hasSubcategories: true },
        { icon: "ship-wheel", text: "Tasa 56", color: "#7fa23d", hasSubcategories: true },
        { icon: "anchor", text: "Tasa 57", color: "#7fa23d", hasSubcategories: true },
        { icon: "ship-wheel", text: "Tasa 58", color: "#7fa23d", hasSubcategories: true },
        { icon: "anchor", text: "Tasa 59", color: "#7fa23d", hasSubcategories: true },
        { icon: "ship-wheel", text: "Tasa 61", color: "#7fa23d", hasSubcategories: true },
        { icon: "anchor", text: "Tasa 71", color: "#7fa23d", hasSubcategories: true },
        { icon: "ship-wheel", text: "Tasa 111", color: "#7fa23d", hasSubcategories: true },
        { icon: "anchor", text: "Tasa 210", color: "#7fa23d", hasSubcategories: true },
        { icon: "ship-wheel", text: "Tasa 218", color: "#7fa23d", hasSubcategories: true },
        { icon: "anchor", text: "Tasa 310", color: "#7fa23d", hasSubcategories: true },
        { icon: "ship-wheel", text: "Tasa 314", color: "#7fa23d", hasSubcategories: true },
        { icon: "anchor", text: "Tasa 315", color: "#7fa23d", hasSubcategories: true },
        { icon: "ship-wheel", text: "Tasa 411", color: "#7fa23d", hasSubcategories: true },
        { icon: "anchor", text: "Tasa 412", color: "#7fa23d", hasSubcategories: true },
        { icon: "ship-wheel", text: "Tasa 413", color: "#7fa23d", hasSubcategories: true },
        { icon: "anchor", text: "Tasa 414", color: "#7fa23d", hasSubcategories: true },
        { icon: "ship-wheel", text: "Tasa 416", color: "#7fa23d", hasSubcategories: true },
        { icon: "anchor", text: "Tasa 417", color: "#7fa23d", hasSubcategories: true },
        { icon: "ship-wheel", text: "Tasa 418", color: "#7fa23d", hasSubcategories: true },
        { icon: "anchor", text: "Tasa 419", color: "#7fa23d", hasSubcategories: true },
        { icon: "ship-wheel", text: "Tasa 420", color: "#7fa23d", hasSubcategories: true },
        { icon: "anchor", text: "Tasa 424", color: "#7fa23d", hasSubcategories: true },
        { icon: "ship-wheel", text: "Tasa 425", color: "#7fa23d", hasSubcategories: true },
        { icon: "anchor", text: "Tasa 426", color: "#7fa23d", hasSubcategories: true },
        { icon: "ship-wheel", text: "Tasa 427", color: "#7fa23d", hasSubcategories: true },
    ];

    const handleCategoryPress = (text, hasSubcategories) => {
        Animated.sequence([
            Animated.spring(scaleAnim, {
                toValue: 0.95,
                friction: 3,
                tension: 40,
                useNativeDriver: true,
            }),
            Animated.spring(scaleAnim, {
                toValue: 1,
                friction: 3,
                tension: 40,
                useNativeDriver: true,
            }),
        ]).start();

        if (hasSubcategories) {
            navigation.navigate("SubcategoryScreen", { category: text, subcategories: categories, clase });
        } else {
            navigation.navigate("SubcategoryScreen", { category: text, clase });
        }
    };

    return (
        <Animated.View 
            style={[styles.container, { 
                opacity: fadeAnim, 
                transform: [{ scale: scaleAnim }] 
            }]}
        >
            <View style={styles.header}>
                <MaterialCommunityIcons name="anchor" size={40} color="#1a237e" style={styles.headerIcon} />
                <Text style={styles.headerTitle}>Embarcaciones</Text>
                <Text style={styles.headerSubtitle}>Seleccione para más detalles</Text>
            </View>

            <ScrollView 
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                <View style={styles.buttonsContainer}>
                    {categories.map(({ icon, text, color, hasSubcategories }, index) => (
                        <TouchableOpacity
                            key={index}
                            style={[styles.button, { backgroundColor: color }]}
                            onPress={() => handleCategoryPress(text, hasSubcategories)}
                            activeOpacity={0.7}
                        >
                            <View style={styles.buttonContent}>
                                <View style={styles.iconContainer}>
                                    <MaterialCommunityIcons name={icon} size={32} color="#fff" />
                                </View>
                                <View style={styles.textContainer}>
                                    <Text style={styles.buttonText}>{text}</Text>
                                    {hasSubcategories && (
                                        <MaterialCommunityIcons 
                                            name="chevron-right" 
                                            size={24} 
                                            color="#ffffff80" 
                                        />
                                    )}
                                </View>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F5F6F8",
    },
    header: {
        alignItems: "center",
        marginVertical: 20,
        paddingHorizontal: 20,
    },
    headerIcon: {
        marginBottom: 10,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: "800",
        color: "#1a237e",
        letterSpacing: 0.5,
    },
    headerSubtitle: {
        fontSize: 16,
        color: "#5c6bc0",
        marginTop: 5,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 20,
    },
    buttonsContainer: {
        paddingHorizontal: 16,
    },
    button: {
        marginVertical: 8,
        borderRadius: 16,
        elevation: 4,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    buttonContent: {
        flexDirection: "row",
        alignItems: "center",
        padding: 16,
    },
    iconContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: "rgba(255, 255, 255, 0.2)",
        justifyContent: "center",
        alignItems: "center",
    },
    textContainer: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginLeft: 15,
    },
    buttonText: {
        fontSize: 18,
        fontWeight: "700",
        color: "#fff",
        letterSpacing: 0.5,
    },
});

export default tasa;