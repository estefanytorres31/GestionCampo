    import React, { useState } from 'react';
    import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
    import { ChevronDown, ChevronUp, CheckCircle, Circle } from 'lucide-react-native';

    const MaintenanceChecklist = () => {
    const [expandedSections, setExpandedSections] = useState({});
    const [checkedItems, setCheckedItems] = useState({});

    const checklistData = [
        {
        id: 1,
        title: "GESTION PESCA – CPU",
        items: [
            { id: '1.1', text: 'Revisión de CPU' },
            { id: '1.2', text: 'Revisión de Monitor' },
            { id: '1.3', text: 'Revisión de periféricos' },
            { id: '1.4', text: 'Revisión de PLC' },
            { id: '1.5', text: 'Revisión de módulos' },
            { id: '1.6', text: 'Revisión de cableado: Verificar estado de cables, conectores y terminales' },
            { id: '1.7', text: 'Revisión de aislador galvanico' },
            { id: '1.8', text: 'Verificar operatividad del repetidor' },
            { id: '1.9', text: 'Prueba del sistema, simulación de faena de pesca' },
        ]
        },
        {
        id: 2,
        title: "CONTROL DE COMBUSTIBLE MP",
        items: [
            { id: '2.1', text: 'Verificar kit de flujómetros' },
            { id: '2.2', text: 'Revisión interna de los flujómetros' },
            { id: '2.3', text: 'Revisión de los sensores (Pulsos, Temperatura, RPM y Horómetro)' },
            { id: '2.4', text: 'Verificar estado de los cables' },
            { id: '2.5', text: 'Revisión de PLC' },
            { id: '2.6', text: 'Revisión de módulos' },
            { id: '2.7', text: 'Revisión de HMI' },
            { id: '2.8', text: 'Revisión de aislador galvanico' },
            { id: '2.9', text: 'Revisión de interfaces de RPM y % de Paso' },
            { id: '2.10', text: 'Prueba de funcionamiento con motor puesto en marcha' },
            { id: '2.11', text: 'Verificar envío de datos' },
        ]
        },
        {
        id: 3,
        title: "CONTROL DE COMBUSTIBLE AUXILIARES",
        items: [
            { id: '3.1', text: 'Verificar kit de flujómetros' },
            { id: '3.2', text: 'Revisión interna de los flujómetros' },
            { id: '3.3', text: 'Revisión de los sensores (Pulsos y Temperatura)' },
            { id: '3.4', text: 'Verificar estado de los cables' },
            { id: '3.5', text: 'Revisión de PLC' },
            { id: '3.6', text: 'Revisión de módulos' },
            { id: '3.7', text: 'Revisión de HMI' },
            { id: '3.8', text: 'Revisión de aislador galvanico' },
            { id: '3.9', text: 'Prueba de funcionamiento con motor puesto en marcha' },
            { id: '3.10', text: 'Verificar envío de datos' },
        ]
        },
        {
        id: 4,
        title: "CONTROL DE COMBUSTIBLE MP ELECTRONICO",
        items: [
            { id: '4.1', text: 'Revisión del conexionado ECM - Terminal Satelital' },
            { id: '4.2', text: 'Revisión del cableado: Verificar estado de los cables, conectores y terminales' },
            { id: '4.3', text: 'Prueba de funcionamiento con motor puesto en marcha' },
            { id: '4.4', text: 'Verificar envío de datos' },
        ]
        },
        {
        id: 5,
        title: "CONTROL DE COMBUSTIBLE AUXILIARES ELECTRONICO",
        items: [
            { id: '5.1', text: 'Inspección de PLC – Terminal Satelital / Convertidores' },
            { id: '5.2', text: 'Revisión del cableado: Verificar estado de los cables, conectores y terminales' },
            { id: '5.3', text: 'Prueba de funcionamiento con motor puesto en marcha' },
            { id: '5.4', text: 'Verificar envío de datos' },
        ]
        },
        {
        id: 6,
        title: "BNWAS SATELITAL",
        items: [
            { id: '6.1', text: 'Inspección de los relés de estado solido' },
            { id: '6.2', text: 'Revisión del cableado: Verificar estado de los cables, conectores y terminales' },
            { id: '6.3', text: 'Prueba de encendido/apagado del BNWAS por geocerca' },
            { id: '6.4', text: 'Verificar el envío de alarmas Power, On/Off y Sirena' },
        ]
        },
        {
        id: 7,
        title: "MONITOREO DE TEMPERATURAS RSW",
        items: [
            { id: '7.1', text: 'Revisión de PLC' },
            { id: '7.2', text: 'Revisión de HMI' },
            { id: '7.3', text: 'Revisión de módulos' },
            { id: '7.4', text: 'Revisión de aislador galvanico' },
            { id: '7.5', text: 'Revisión de sensores' },
            { id: '7.6', text: 'Revisión de cableado: Verificar estado de cables, conectores y terminales' },
            { id: '7.7', text: 'Verificar envío de datos' },
        ]
        },
    ];

    const toggleSection = (sectionId) => {
        setExpandedSections(prev => ({
        ...prev,
        [sectionId]: !prev[sectionId]
        }));
    };

    const toggleItem = (itemId) => {
        setCheckedItems(prev => ({
        ...prev,
        [itemId]: !prev[itemId]
        }));
    };

    const getProgress = (items) => {
        const checkedCount = items.filter(item => checkedItems[item.id]).length;
        return `${checkedCount}/${items.length}`;
    };

    return (
        <ScrollView style={styles.container}>
        <Text style={styles.title}>Checklist de Mantenimiento Preventivo</Text>
        {checklistData.map(section => (
            <View key={section.id} style={styles.section}>
            <TouchableOpacity
                style={styles.sectionHeader}
                onPress={() => toggleSection(section.id)}
            >
                <View style={styles.sectionHeaderContent}>
                <Text style={styles.sectionTitle}>{section.title}</Text>
                <View style={styles.sectionHeaderRight}>
                    <Text style={styles.progress}>{getProgress(section.items)}</Text>
                    {expandedSections[section.id] ? (
                    <ChevronUp size={24} color="#007AFF" />
                    ) : (
                    <ChevronDown size={24} color="#007AFF" />
                    )}
                </View>
                </View>
            </TouchableOpacity>
            
            {expandedSections[section.id] && (
                <View style={styles.itemsContainer}>
                {section.items.map(item => (
                    <TouchableOpacity
                    key={item.id}
                    style={styles.item}
                    onPress={() => toggleItem(item.id)}
                    >
                    {checkedItems[item.id] ? (
                        <CheckCircle size={24} color="#4CAF50" />
                    ) : (
                        <Circle size={24} color="#757575" />
                    )}
                    <Text style={[
                        styles.itemText,
                        checkedItems[item.id] && styles.checkedItemText
                    ]}>
                        {item.text}
                    </Text>
                    </TouchableOpacity>
                ))}
                </View>
            )}
            </View>
        ))}
        </ScrollView>
    );
    };

    const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
        padding: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333',
    },
    section: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        marginBottom: 16,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    sectionHeader: {
        padding: 16,
    },
    sectionHeaderContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    sectionHeaderRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        flex: 1,
    },
    progress: {
        fontSize: 14,
        color: '#666',
    },
    itemsContainer: {
        padding: 16,
        paddingTop: 0,
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        gap: 12,
    },
    itemText: {
        fontSize: 16,
        color: '#333',
        flex: 1,
    },
    checkedItemText: {
        color: '#666',
        textDecorationLine: 'line-through',
    },
    });

    export default MaintenanceChecklist;