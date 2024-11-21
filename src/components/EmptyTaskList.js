// components/EmptyTaskList.js
import React from 'react';
import { View, Text } from 'react-native';

export function EmptyTaskList() {
  return (
    <View className="items-center justify-center py-12">
      <Text className="text-gray-400 text-base">No tasks yet</Text>
      <Text className="text-gray-400 mt-1">Add your first task below</Text>
    </View>
  );
}