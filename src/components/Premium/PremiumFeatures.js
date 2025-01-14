import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'; // Importă iconițele din FontAwesome sau alta librărie

const PremiumFeatures = ({ features }) => {
    return (
        <View style={styles.featuresContainer}>
            {features.map((feature, index) => {
                return (
                    <View key={index} style={styles.feature}>
                        <Icon name="star" size={30} color="#FFD700" />
                        <Text style={styles.featureTitle}>{feature.title}</Text>
                        <Text style={styles.featureDescription}>{feature.description}</Text>
                    </View>
                );
            })}
        </View>
    );
};

const styles = StyleSheet.create({
    featuresContainer: {
        marginTop: 20,
    },
    feature: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    featureTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 10,
        color: '#333',
    },
    featureDescription: {
        fontSize: 14,
        marginLeft: 10,
        color: '#555',
    },
});

export default PremiumFeatures;
