import React from 'react';
import { View, Text, TouchableOpacity, Animated } from 'react-native';
import { Check, ChevronRight } from 'lucide-react-native';

export function TaskItem({ task, onToggle, onPress }) {
  return (
    <TouchableOpacity 
      onPress={onPress}
      className="flex-row items-center bg-white my-2 p-4 rounded-xl border border-gray-100"
      style={{
        shadowColor: '#6366f1',
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
        <Text className={`text-base font-medium ${
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
      
      <ChevronRight size={20} color="#9ca3af" />
    </TouchableOpacity>
  );
}