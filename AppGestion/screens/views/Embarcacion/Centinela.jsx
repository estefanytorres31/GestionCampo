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

const Austral = ({ route, navigation }) => {
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
        { icon: "anchor", text: "Blandi", color: "#1565C0", hasSubcategories: true },
        { icon: "ship-wheel", text: "Susan VI", color: "#1565C0", hasSubcategories: false },
        { icon: "anchor", text: "Maria I", color: "#1565C0", hasSubcategories: false },
        { icon: "ship-wheel", text: "Corintia", color: "#1565C0", hasSubcategories: false },
        { icon: "anchor", text: "Mary", color: "#1565C0", hasSubcategories: false },
        { icon: "ship-wheel", text: "Santa Adela II", color: "#1565C0", hasSubcategories: false },
        { icon: "anchor", text: "Polar I", color: "#1565C0", hasSubcategories: true },

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

export default Austral;