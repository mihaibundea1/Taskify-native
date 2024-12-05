// src/screens/Settings.js
import React from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { styled } from 'nativewind';
import { useUser, useAuth } from '@clerk/clerk-expo';
import { LogOut, Moon, Sun, ChevronRight } from 'lucide-react-native';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchable = styled(TouchableOpacity);

const SettingsOption = ({ icon, title, onPress, value }) => (
  <StyledTouchable 
    className="flex-row items-center justify-between p-4 bg-white mb-2 rounded-xl"
    onPress={onPress}
  >
    <StyledView className="flex-row items-center">
      {icon}
      <StyledText className="ml-3 text-gray-800 font-medium">{title}</StyledText>
    </StyledView>
    <StyledView className="flex-row items-center">
      {value && (
        <StyledText className="mr-2 text-gray-500">{value}</StyledText>
      )}
      <ChevronRight size={20} color="#9CA3AF" />
    </StyledView>
  </StyledTouchable>
);

const Settings = ({ navigation }) => {
  const { signOut } = useAuth();
  const [isDarkMode, setIsDarkMode] = React.useState(false);

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      Alert.alert('Error', 'Failed to sign out');
    }
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    // Here you would implement your theme switching logic
  };

  return (
    <StyledView className="flex-1 bg-gray-50 p-4">
      <StyledText className="text-lg font-semibold mb-4 text-gray-800">
        Preferences
      </StyledText>

      <SettingsOption
        icon={isDarkMode ? <Moon size={24} color="#3b82f6" /> : <Sun size={24} color="#3b82f6" />}
        title="Theme"
        value={isDarkMode ? "Dark" : "Light"}
        onPress={toggleTheme}
      />

      <StyledText className="text-lg font-semibold mb-4 mt-6 text-gray-800">
        Account
      </StyledText>

      <SettingsOption
        icon={<LogOut size={24} color="#ef4444" />}
        title="Sign Out"
        onPress={handleLogout}
      />
    </StyledView>
  );
};

export default Settings;