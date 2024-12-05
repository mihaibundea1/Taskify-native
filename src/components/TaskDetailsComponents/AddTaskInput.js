import React from 'react';
import { View, TextInput, TouchableOpacity, Platform } from 'react-native';
import { Plus } from 'lucide-react-native';

export function AddTaskInput({ value, onChangeText, onSubmit }) {
  return (
    <View className="px-4 py-3 bg-white border-t border-gray-100">
      <View className="flex-row items-center bg-gray-50 rounded-xl px-4 py-2">
        <TextInput
          className="flex-1 text-base text-gray-800 min-h-[44px]"
          placeholder="Add a new task..."
          placeholderTextColor="#9CA3AF"
          value={value}
          onChangeText={onChangeText}
          onSubmitEditing={onSubmit}
          blurOnSubmit={false}
        />
        <TouchableOpacity 
          onPress={onSubmit}
          className={`p-2 rounded-full ${value.trim() ? 'bg-indigo-500' : 'bg-gray-300'}`}
          disabled={!value.trim()}
        >
          <Plus size={24} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
}