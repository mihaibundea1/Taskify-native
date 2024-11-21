// components/TaskItem.js
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Check } from 'lucide-react-native';

export function TaskItem({ task, onToggle, onPress }) {
  return (
    <TouchableOpacity 
      onPress={onPress}
      className="flex-row items-center bg-white mt-3 p-4 rounded-xl shadow-sm"
    >
      <TouchableOpacity 
        onPress={(e) => {
          e.stopPropagation();
          onToggle(task.id);
        }}
        className={`w-6 h-6 rounded-full border-2 mr-3 items-center justify-center
          ${task.completed ? 'bg-blue-500 border-blue-500' : 'border-gray-300'}`}
      >
        {task.completed && <Check size={16} color="white" />}
      </TouchableOpacity>
      
      <View className="flex-1">
        <Text className={`text-base ${
          task.completed ? 'text-gray-400 line-through' : 'text-gray-800'
        }`}>
          {task.text}
        </Text>
        {task.description && (
          <Text className="text-gray-400 text-sm mt-1" numberOfLines={1}>
            {task.description}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
}