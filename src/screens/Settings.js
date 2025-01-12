import React from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { styled } from 'nativewind';
import { useAuth } from '@clerk/clerk-expo';
import { LogOut, Moon, Sun, ChevronRight } from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext'; // Importă contextul de temă

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchable = styled(TouchableOpacity);

const SettingsOption = ({ icon, title, onPress, value, isDarkMode }) => (
  <StyledTouchable
    className={`flex-row items-center justify-between p-4 mb-2 rounded-xl 
      ${isDarkMode ? 'bg-gray-700' : 'bg-white'} `}
    onPress={onPress}
  >
    <StyledView className="flex-row items-center">
      {icon}
      <StyledText className={`ml-3 ${isDarkMode ? 'text-white' : 'text-gray-800'} font-medium`}>{title}</StyledText>
    </StyledView>
    <StyledView className="flex-row items-center">
      {value && (
        <StyledText className={`mr-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{value}</StyledText>
      )}
      <ChevronRight size={20} color={isDarkMode ? '#9CA3AF' : '#6B7280'} />
    </StyledView>
  </StyledTouchable>
);

const Settings = ({ navigation }) => {
  const { signOut } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme(); // Folosește contextul de temă

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      Alert.alert('Error', 'Failed to sign out');
    }
  };

  return (
    <StyledView className={`flex-1 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'} p-4`}>
      <StyledText className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
        Preferences
      </StyledText>

      <SettingsOption
        icon={isDarkMode ? <Moon size={24} color="#3b82f6" /> : <Sun size={24} color="#3b82f6" />}
        title="Theme"
        value={isDarkMode ? "Dark" : "Light"}
        onPress={toggleTheme}
        isDarkMode={isDarkMode}
      />

      <StyledText className={`text-lg font-semibold mb-4 mt-6 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
        Account
      </StyledText>

      <SettingsOption
        icon={<LogOut size={24} color="#ef4444" />}
        title="Sign Out"
        onPress={handleLogout}
        isDarkMode={isDarkMode}
      />
    </StyledView>
  );
};

export default Settings;
