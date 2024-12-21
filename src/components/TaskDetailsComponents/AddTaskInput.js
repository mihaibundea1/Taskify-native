import React, { useRef, useEffect } from 'react';
import { 
  View, 
  TextInput, 
  TouchableOpacity, 
  Keyboard, 
  Platform, 
  KeyboardAvoidingView 
} from 'react-native';
import { Plus } from 'lucide-react-native';

export function AddTaskInput({ value, onChangeText, onSubmit }) {
  const inputRef = useRef(null);

  // Focus input when component mounts or value changes
  useEffect(() => {
    // Optionally focus input, but don't force it if keyboard is hidden
    if (value) {
      inputRef.current?.focus();
    }
  }, [value]);

  const handleSubmit = () => {
    if (value.trim()) {
      onSubmit();
      // Optionally dismiss keyboard after submission
      Keyboard.dismiss();
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      style={{ 
        position: 'absolute', 
        bottom: 0, 
        left: 0, 
        right: 0, 
        backgroundColor: 'white' 
      }}
    >
      <View className="px-4 py-3 bg-white border-t border-gray-100">
        <View className="flex-row items-center bg-gray-50 rounded-xl px-4 py-2">
          <TextInput
            ref={inputRef}
            className="flex-1 text-base text-gray-800 min-h-[44px]"
            placeholder="Add a new task..."
            placeholderTextColor="#9CA3AF"
            value={value}
            onChangeText={onChangeText}
            onSubmitEditing={handleSubmit}
            blurOnSubmit={false}
            returnKeyType="done"
            style={{ 
              paddingHorizontal: 10,
              flex: 1 
            }}
            multiline={true}
            maxHeight={120}
          />
          <TouchableOpacity 
            onPress={handleSubmit}
            className={`p-2 rounded-full ${value.trim() ? 'bg-indigo-500' : 'bg-gray-300'}`}
            disabled={!value.trim()}
          >
            <Plus size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}