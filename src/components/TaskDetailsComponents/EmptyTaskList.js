import React from 'react';
import { View, Text } from 'react-native';
import { ClipboardList } from 'lucide-react-native';
import { useTheme } from '../../context/ThemeContext'; // Importă contextul de temă

export function EmptyTaskList() {
  const { isDarkMode } = useTheme(); // Accesează tema curentă

  return (
    <View 
      style={{
        alignItems: 'center', 
        justifyContent: 'center', 
        paddingVertical: 16, 
        backgroundColor: isDarkMode ? '#2d2d2d' : '#fafafa' // background color depending on theme
      }}
    >
      <View 
        style={{
          padding: 16,
          borderRadius: 50,
          marginBottom: 16,
          backgroundColor: isDarkMode ? '#3a3a3a' : '#f0f0f0' // background for icon
        }}
      >
        <ClipboardList size={32} color={isDarkMode ? '#007BFF' : '#007BFF'} /> Icon remains constant
      </View>
      <Text style={{ fontSize: 18, fontWeight: '500', color: isDarkMode ? '#ffffff' : '#4b4b4b' }}>
        No tasks yet
      </Text>
      <Text style={{ marginTop: 4, fontSize: 14, color: '#a0a0a0' }}>
        Add your first task using the input below
      </Text>
    </View>
  );
}
