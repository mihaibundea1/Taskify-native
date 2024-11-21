// components/Header.js
import React from 'react';
import { View, Text } from 'react-native';
import { Calendar as CalendarIcon } from 'lucide-react-native';

export default function Header() {
  return (
    <View className="px-6 pt-12 pb-6 bg-white border-b border-gray-100">
      <View className="flex-row items-center justify-between">
        <View>
          <Text className="text-3xl font-bold text-gray-900">Calendar</Text>
          <Text className="text-gray-500 mt-1 text-base">Organize your schedule</Text>
        </View>
        <CalendarIcon size={28} color="#6366f1" />
      </View>
    </View>
  );
}