import React, { memo } from 'react';
import { View, TextInput, TouchableOpacity, Keyboard } from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native';

const InputField = memo(({
  icon,
  placeholder,
  value,
  onChangeText,
  secureTextEntry,
  isPassword = false,
  showPassword,
  setShowPassword,
  isLoading = false,
  autoCapitalize = "none",
  autoCorrect = false,
  keyboardType = "default",
  maxLength
}) => {
  const handleChangeText = React.useCallback((text) => {
    if (!isLoading) {
      onChangeText(text);
    }
  }, [isLoading, onChangeText]);

  return (
    <View className="relative w-full h-12">
      <View className="absolute left-3 top-[25%] z-10">
        {icon}
      </View>
      <TextInput
        value={value}
        onChangeText={handleChangeText}
        placeholder={placeholder}
        placeholderTextColor="#9CA3AF"
        secureTextEntry={secureTextEntry}
        className={`w-full h-full pl-10 ${isPassword ? 'pr-12' : 'pr-3'} bg-gray-50 rounded-lg text-gray-900`}
        autoCapitalize={autoCapitalize}
        autoCorrect={autoCorrect}
        keyboardType={keyboardType}
        editable={!isLoading}
        maxLength={maxLength}
        returnKeyType="done"
        enablesReturnKeyAutomatically
        onSubmitEditing={Keyboard.dismiss}
      />
      {isPassword && setShowPassword && (
        <TouchableOpacity
          onPress={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-[25%] z-10"
        >
          {showPassword ?
            <EyeOff size={20} color="#9CA3AF" /> :
            <Eye size={20} color="#9CA3AF" />
          }
        </TouchableOpacity>
      )}
    </View>
  );
});

InputField.displayName = 'InputField';

// Change to default export
export default InputField;