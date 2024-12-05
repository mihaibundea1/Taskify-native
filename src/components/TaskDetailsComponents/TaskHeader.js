import React from 'react';
import { View, Text } from 'react-native';
import { Calendar as CalendarIcon } from 'lucide-react-native';

export function TaskHeader({ date, totalTasks, completedTasks }) {
  return (
    <View className="bg-white border-b border-gray-100 px-6 pt-12 pb-6">
      <View className="flex-row items-center justify-between mb-4">
        <CalendarIcon size={24} color="#6366f1" />
        <Text className="text-indigo-500 font-medium">
          {completedTasks}/{totalTasks} Complete
        </Text>
      </View>
      
      <Text className="text-2xl font-bold text-gray-900">
        {new Date(date).toLocaleDateString('en-US', { 
          month: 'long', 
          day: 'numeric',
          weekday: 'long'
        })}
      </Text>
    </View>
  );
}