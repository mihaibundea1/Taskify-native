import React from 'react';
import { View, Text } from 'react-native';
import { ClipboardList } from 'lucide-react-native';
import { useTheme } from '../../context/ThemeContext'; // Importă contextul de temă

export function EmptyTaskList() {
  const { isDarkMode } = useTheme(); // Accesează tema curentă

  return (
    <View 
      className={`items-center justify-center py-16 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`} // Fundalul în funcție de temă
    >
      <View 
        className={`p-4 rounded-full mb-4 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`} // Fundal pentru iconiță în funcție de temă
      >
        <ClipboardList size={32} color={isDarkMode ? '#6366f1' : '#6366f1'} /> {/* Iconița rămâne constantă */}
      </View>
      <Text className={`text-lg font-medium ${isDarkMode ? 'text-white' : 'text-gray-600'}`}>No tasks yet</Text> {/* Textul principal */}
      <Text className={`mt-1 text-base ${isDarkMode ? 'text-gray-400' : 'text-gray-400'}`}>Add your first task using the input below</Text> {/* Textul secundar */}
    </View>
  );
}
