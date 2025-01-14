import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { Crown, Clock, Calendar, Bell, Users, Palette } from 'lucide-react-native';
import { useUser } from '@clerk/clerk-react';
import { userService } from '../services/userService';
import PremiumFeatures from '../components/Premium/PremiumFeatures';
import PricingCard from '../components/Premium/PricingCard';

export default function Premium() {
  const { user } = useUser();
  const [isPremium, setIsPremium] = useState(false);

  useEffect(() => {
    const checkPremiumStatus = async () => {
      if (user?.id) {
        try {
          const status = await userService.getUserPremiumStatus(user.id);
          setIsPremium(status);
        } catch (error) {
          console.error('Eroare la verificarea statusului premium:', error);
        }
      }
    };

    checkPremiumStatus();
  }, [user?.id]);

  const features = [
    {
      icon: Clock,
      title: 'Istoric nelimitat',
      description: 'Accesează întregul istoric al sarcinilor tale oricând dorești'
    },
    {
      icon: Calendar,
      title: 'Calendar avansat',
      description: 'Funcții avansate de calendar și vizualizări multiple'
    },
    {
      icon: Bell,
      title: 'Notificări personalizate',
      description: 'Configurează notificări personalizate pentru evenimentele importante'
    },
    {
      icon: Users,
      title: 'Colaborare în echipă',
      description: 'Împărtășește și colaborează cu membrii echipei tale'
    },
    {
      icon: Palette,
      title: 'Teme personalizate',
      description: 'Accesează teme și customizări exclusive'
    }
  ];

  if (isPremium) {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Crown size={30} color="#f59e0b" />
          </View>
          <Text style={styles.title}>Ești utilizator Premium, iată avantajele pe care le ai:</Text>
        </View>

        <PremiumFeatures features={features} />
      </ScrollView>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Crown size={30} color="#2563eb" />
        </View>
        <Text style={styles.title}>Upgrade la Premium</Text>
        <Text style={styles.description}>
          Deblocați funcționalități avansate și îmbunătățiți-vă productivitatea cu contul Premium
        </Text>
      </View>

      <View style={styles.pricingContainer}>
        <PricingCard
          title="Lunar"
          price="2.99"
          period="lună"
          features={[
            'Toate funcțiile premium',
            'Suport prioritar',
            'Fără reclame',
            'Actualizări în avans'
          ]}
          buttonText="Începe perioada de probă"
          recommended={false}
          type="monthly"
          priceId="price_1QXNj6DyYfQccp15QwZRfmuv"
        />
        <PricingCard
          title="Anual"
          price="26.99"
          period="an"
          features={[
            'Toate funcțiile premium',
            'Suport prioritar',
            'Fără reclame',
            'Actualizări în avans',
            '2 luni gratuite'
          ]}
          buttonText="Economisește 25%"
          recommended={true}
          type="yearly"
          priceId="price_1QXNmGDyYfQccp15DPK8aG8D"
        />
      </View>

      <PremiumFeatures features={features} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f3f4f6',
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  iconContainer: {
    backgroundColor: '#f59e0b',
    padding: 10,
    borderRadius: 30,
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 10,
  },
  description: {
    fontSize: 18,
    color: '#4b5563',
    textAlign: 'center',
    marginBottom: 20,
  },
  pricingContainer: {
    flexDirection: 'column', // Schimbăm la 'column' pentru a fi listă verticală
    marginBottom: 20,
  },
});

