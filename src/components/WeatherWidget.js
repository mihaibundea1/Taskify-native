// components/WeatherWidget.js
import React from 'react';
import { View, Text, Image, ActivityIndicator } from 'react-native';
import { useWeather } from '../hooks/useWeather';

export function WeatherWidget({ date }) {
  const { weather, loading, error } = useWeather(date);

  if (loading) {
    return (
      <View className="p-4 bg-gray-100 rounded-lg">
        <ActivityIndicator size="small" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View className="p-4 bg-gray-100 rounded-lg">
        <Text className="text-red-500">Nu s-au putut încărca datele meteo</Text>
      </View>
    );
  }

  if (!weather) {
    return null;
  }

  return (
    <View className="p-4 bg-gray-100 rounded-lg flex-row items-center">
      <Image
        source={{
          uri: `http://openweathermap.org/img/w/${weather.icon}.png`
        }}
        className="w-10 h-10"
      />
      <View className="ml-3">
        <Text className="text-lg font-medium">{weather.temperature}°C</Text>
        <Text className="text-gray-600 capitalize">{weather.description}</Text>
        <Text className="text-sm text-gray-500">{weather.city}</Text>
      </View>
    </View>
  );
}