import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Check, ChevronRight } from 'lucide-react-native';
import { useTheme } from '../../context/ThemeContext'; // Importă contextul de temă

export function TaskItem({ task, onToggle, onPress }) {
  const { isDarkMode } = useTheme(); // Folosește contextul de temă

  return (
    <TouchableOpacity 
      onPress={onPress}
      className={`flex-row items-center my-2 p-4 rounded-xl border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}
      style={{
        shadowColor: isDarkMode ? '#6366f1' : '#000', // Modifică culoarea umbrei în funcție de tema activă
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2
      }}
    >
      <TouchableOpacity 
        onPress={(e) => {
          e.stopPropagation();
          onToggle(task.id);
        }}
        className={`w-6 h-6 rounded-full border-2 mr-4 items-center justify-center
          ${task.completed ? 'bg-indigo-500 border-indigo-500' : 'border-gray-300'}`}
      >
        {task.completed && <Check size={16} color="white" />}
      </TouchableOpacity>
      
      <View className="flex-1">
        <Text className={`text-base font-medium ${task.completed ? 'line-through' : ''} ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>
          {task.title} {/* Afișează titlul task-ului */}
        </Text>
        {task.description && (
          <Text className={`text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} numberOfLines={1}>
            {task.description} {/* Afișează descrierea task-ului */}
          </Text>
        )}
        {task.time && (
          <Text className={`text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            {task.time} {/* Afișează ora task-ului */}
          </Text>
        )}
      </View>
      
      <ChevronRight size={20} color={isDarkMode ? '#9CA3AF' : '#6B7280'} />
    </TouchableOpacity>
  );
}
