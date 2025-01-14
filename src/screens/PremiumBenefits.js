import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { styled } from 'nativewind';
import { Crown } from 'lucide-react-native';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchable = styled(TouchableOpacity);

const PremiumFeature = ({ title, description }) => (
  <StyledView className="p-4 mb-4 rounded-xl bg-white shadow-md">
    <StyledText className="text-xl font-semibold">{title}</StyledText>
    <StyledText className="text-gray-500">{description}</StyledText>
  </StyledView>
);

const PremiumBenefits = () => {
  const features = [
    {
      icon: <Crown size={24} color="#f59e0b" />,
      title: 'Istoric nelimitat',
      description: 'Accesează întregul istoric al sarcinilor tale oricând dorești',
    },
    {
      icon: <Crown size={24} color="#f59e0b" />,
      title: 'Calendar avansat',
      description: 'Funcții avansate de calendar și vizualizări multiple',
    },
    {
      icon: <Crown size={24} color="#f59e0b" />,
      title: 'Notificări personalizate',
      description: 'Configurează notificări personalizate pentru evenimentele importante',
    },
    {
      icon: <Crown size={24} color="#f59e0b" />,
      title: 'Colaborare în echipă',
      description: 'Împărtășește și colaborează cu membrii echipei tale',
    },
    {
      icon: <Crown size={24} color="#f59e0b" />,
      title: 'Teme personalizate',
      description: 'Accesează teme și customizări exclusive',
    },
  ];

  return (
    <StyledView className="flex-1 p-4 bg-gray-50">
      <StyledText className="text-2xl font-bold mb-4">Beneficiile Planului Premium</StyledText>
      <ScrollView>
        {features.map((feature, index) => (
          <PremiumFeature
            key={index}
            title={feature.title}
            description={feature.description}
          />
        ))}
      </ScrollView>
    </StyledView>
  );
};

export default PremiumBenefits;
