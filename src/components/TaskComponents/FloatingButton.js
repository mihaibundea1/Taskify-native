// components/FloatingButton.js
import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { Plus } from 'lucide-react-native';

export default function FloatingButton({ onPress }) {
  return (
    <View className="absolute bottom-6 right-6">
      <TouchableOpacity
        onPress={onPress}
        className="bg-indigo-500 w-16 h-16 rounded-full items-center justify-center shadow-lg"
        style={{
          shadowColor: '#6366f1',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 5,
        }}
      >
        <Plus color="white" size={28} />
      </TouchableOpacity>
    </View>
  );
}