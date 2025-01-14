import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import PremiumFeatures from './PremiumFeatures';
import Icon from 'react-native-vector-icons/FontAwesome';  // Folosim FontAwesome pentru iconițe

const features = [
  {
    icon: 'crown', // Icona pentru Premium
    title: 'Istoric nelimitat',
    description: 'Accesează întregul istoric al sarcinilor tale oricând dorești',
  },
  {
    icon: 'calendar', // Icona pentru calendar
    title: 'Calendar avansat',
    description: 'Funcții avansate de calendar și vizualizări multiple',
  },
  {
    icon: 'bell', // Icona pentru notificări
    title: 'Notificări personalizate',
    description: 'Configurează notificări personalizate pentru evenimentele importante',
  },
  {
    icon: 'users', // Icona pentru colaborare
    title: 'Colaborare în echipă',
    description: 'Împărtășește și colaborează cu membrii echipei tale',
  },
  {
    icon: 'paint-brush', // Icona pentru teme
    title: 'Teme personalizate',
    description: 'Accesează teme și customizări exclusive',
  },
];

const PremiumBenefits = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          Ești utilizator Premium, iată avantajele pe care le ai:
        </Text>
      </View>
      <PremiumFeatures features={features} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#F7F7F7',
    padding: 20,
  },
  header: {
    marginBottom: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default PremiumBenefits;
