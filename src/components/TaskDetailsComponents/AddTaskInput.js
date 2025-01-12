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
import { useTheme } from '../../context/ThemeContext'; // Importă contextul de temă

export function AddTaskInput({ value, onChangeText, onSubmit }) {
  const inputRef = useRef(null);
  const { isDarkMode } = useTheme(); // Accesează tema curentă

  // Focus input when component mounts or value changes
  useEffect(() => {
    if (value) {
      inputRef.current?.focus();
    }
  }, [value]);

  const handleSubmit = () => {
    if (value.trim()) {
      onSubmit();
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
        backgroundColor: isDarkMode ? '#333' : 'white' // Ajustează culoarea în funcție de temă
      }}
    >
      <View 
        className={`px-4 py-3 border-t ${isDarkMode ? 'bg-gray-700' : 'bg-white'}`} // Modifică fundalul în funcție de temă
      >
        <View 
          className={`flex-row items-center ${isDarkMode ? 'bg-gray-600' : 'bg-gray-50'} rounded-xl px-4 py-2`}
        >
          <TextInput
            ref={inputRef}
            className={`flex-1 text-base ${isDarkMode ? 'text-white' : 'text-gray-800'} min-h-[44px]`} // Modifică textul în funcție de temă
            placeholder="Add a new task..."
            placeholderTextColor={isDarkMode ? '#9CA3AF' : '#6B7280'}
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
