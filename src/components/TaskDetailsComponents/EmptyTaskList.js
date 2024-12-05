import React from 'react';
import { View, Text } from 'react-native';
import { ClipboardList } from 'lucide-react-native';

export function EmptyTaskList() {
  return (
    <View className="items-center justify-center py-16">
      <View className="bg-gray-50 p-4 rounded-full mb-4">
        <ClipboardList size={32} color="#6366f1" />
      </View>
      <Text className="text-gray-600 text-lg font-medium">No tasks yet</Text>
      <Text className="text-gray-400 mt-1 text-base">
        Add your first task using the input below
      </Text>
    </View>
  );
}