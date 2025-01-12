import React from 'react';
import { View, Text } from 'react-native';
import { Calendar as CalendarIcon } from 'lucide-react-native';
import { useTheme } from '../../context/ThemeContext'; // Importă contextul de temă

export function TaskHeader({ date, totalTasks, completedTasks }) {
  const { isDarkMode } = useTheme(); // Folosește contextul de temă

  return (
    <View className={`px-6 pt-12 pb-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-100'}`}>
      <View className="flex-row items-center justify-between mb-4">
        <CalendarIcon size={24} color="#6366f1" />
        <Text className={`font-medium ${isDarkMode ? 'text-indigo-400' : 'text-indigo-500'}`}>
          {completedTasks}/{totalTasks} Complete
        </Text>
      </View>
      
      <Text className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
        {new Date(date).toLocaleDateString('en-US', { 
          month: 'long', 
          day: 'numeric',
          weekday: 'long'
        })}
      </Text>
    </View>
  );
}
