// src/screens/Profile.js
import React, { useState, useLayoutEffect } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, ScrollView, Alert, Platform, StatusBar, SafeAreaView } from 'react-native';
import { styled } from 'nativewind';
import { useUser } from '@clerk/clerk-expo';
import { Pencil, Phone, Mail, User as UserIcon, Save, X, Camera, Settings } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { useTheme } from '../context/ThemeContext'; // Import the theme context

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledImage = styled(Image);
const StyledInput = styled(TextInput);
const StyledTouchable = styled(TouchableOpacity);
const StyledSafeAreaView = styled(SafeAreaView);

const ProfileField = ({ label, value, icon, onEdit, isEditing, onChangeText, editable = true, isDarkMode }) => (
  <StyledView className={`w-full rounded-xl p-4 mb-3 shadow-sm ${isDarkMode ? 'bg-gray-700' : 'bg-white'}`}>
    <StyledView className="flex-row justify-between items-center">
      <StyledView className="flex-row items-center">
        {icon}
        <StyledText className={`text-${isDarkMode ? 'white' : 'gray-600'} ml-2 font-medium`}>{label}</StyledText>
      </StyledView>
      {editable && (
        <TouchableOpacity onPress={onEdit}>
          <Pencil size={16} color={isEditing ? "#007BFF" : "#9CA3AF"} />
        </TouchableOpacity>
      )}
    </StyledView>
    {isEditing ? (
      <StyledInput
        className="mt-2 p-2 border border-gray-200 rounded-lg text-gray-800 bg-gray-50"
        value={value}
        onChangeText={onChangeText}
        autoFocus
      />
    ) : (
      <StyledText className={`mt-2 ${isDarkMode ? 'text-white' : 'text-gray-800'} text-base`}>
        {value || 'Not set'}
      </StyledText>
    )}
  </StyledView>
);

const Profile = () => {
  const { user } = useUser();
  const navigation = useNavigation();
  const { isDarkMode } = useTheme(); // Use theme context
  const [isEditing, setIsEditing] = useState({
    firstName: false,
    lastName: false,
    phone: false
  });
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    phone: user?.phoneNumbers?.[0]?.phoneNumber || ''
  });

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <StyledTouchable 
          onPress={() => navigation.navigate('Settings')}
          className="mr-4"
        >
          <Settings size={24} color={isDarkMode ? 'white' : '#000000'} />
        </StyledTouchable>
      ),
      headerShown: true,
      headerTransparent: true,
      headerTintColor: isDarkMode ? '#fff' : '#000',
      headerTitle: '',
    });
  }, [navigation, isDarkMode]);

  const handlePickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Please grant permission to access your photos');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled) {
        try {
          await user.setProfileImage({
            file: result.assets[0]
          });
          Alert.alert('Success', 'Profile picture updated successfully!');
        } catch (error) {
          Alert.alert('Error', 'Failed to update profile picture');
        }
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred while picking the image');
    }
  };

  const handleUpdate = async () => {
    try {
      await user.update({
        firstName: formData.firstName,
        lastName: formData.lastName,
        phoneNumber: formData.phone,
      });
      
      Alert.alert('Success', 'Profile updated successfully!');
      setIsEditing({
        firstName: false,
        lastName: false,
        phone: false
      });
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const toggleEdit = (field) => {
    setIsEditing(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  return (
    <StyledSafeAreaView className={`flex-1 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={isDarkMode ? '#1F2937' : '#ffffff'}
        translucent={Platform.OS === 'android'}
      />
      <ScrollView className="flex-1">
        <StyledView className={`items-center pb-6 ${isDarkMode ? 'bg-blue-600' : 'bg-blue-600'} shadow-lg`} 
          style={{ 
            paddingTop: Platform.OS === 'ios' ? 20 : StatusBar.currentHeight + 20 
          }}>
          <StyledView className="relative mt-4">
            <StyledImage 
              source={{ uri: user?.imageUrl }} 
              className="w-24 h-24 rounded-full border-4 border-white shadow-xl"
            />
            <StyledTouchable 
              className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-lg"
              onPress={handlePickImage}
            >
              <Camera size={16} color="#3b82f6" />
            </StyledTouchable>
          </StyledView>
          <StyledText className={`text-xl font-bold mt-4 ${isDarkMode ? 'text-white' : 'text-white'}`}>
            {user?.fullName}
          </StyledText>
          <StyledText className={`${isDarkMode ? 'text-blue-100' : 'text-dark-500'} mt-1`}>
            {user?.primaryEmailAddress?.emailAddress}
          </StyledText>
        </StyledView>

        <StyledView className="px-4 pt-6">
          <StyledText className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-800'} px-1`}>
            Personal Information
          </StyledText>

          <ProfileField
            label="First Name"
            value={formData.firstName}
            icon={<UserIcon size={20} color="#3b82f6" />}
            isEditing={isEditing.firstName}
            onEdit={() => toggleEdit('firstName')}
            onChangeText={(text) => setFormData(prev => ({ ...prev, firstName: text }))} 
            isDarkMode={isDarkMode}
          />

          <ProfileField
            label="Last Name"
            value={formData.lastName}
            icon={<UserIcon size={20} color="#3b82f6" />}
            isEditing={isEditing.lastName}
            onEdit={() => toggleEdit('lastName')}
            onChangeText={(text) => setFormData(prev => ({ ...prev, lastName: text }))} 
            isDarkMode={isDarkMode}
          />

          <ProfileField
            label="Email"
            value={user?.primaryEmailAddress?.emailAddress}
            icon={<Mail size={20} color="#3b82f6" />}
            editable={false}
            isDarkMode={isDarkMode}
          />

          <ProfileField
            label="Phone"
            value={formData.phone}
            icon={<Phone size={20} color="#3b82f6" />}
            isEditing={isEditing.phone}
            onEdit={() => toggleEdit('phone')}
            onChangeText={(text) => setFormData(prev => ({ ...prev, phone: text }))} 
            isDarkMode={isDarkMode}
          />

          {Object.values(isEditing).some(Boolean) && (
            <StyledView className="flex-row justify-end mt-4 space-x-3 mb-8">
              <StyledTouchable 
                className="bg-gray-100 px-5 py-3 rounded-xl flex-row items-center"
                onPress={() => setIsEditing({
                  firstName: false,
                  lastName: false,
                  phone: false
                })}
              >
                <X size={16} color="#4B5563" />
                <StyledText className="ml-2 text-gray-700 font-medium">Cancel</StyledText>
              </StyledTouchable>
              
              <StyledTouchable 
                className={`bg-${isDarkMode ? 'blue-600' : 'blue-500'} px-5 py-3 rounded-xl flex-row items-center`}
                onPress={handleUpdate}
              >
                <Save size={16} color="white" />
                <StyledText className="ml-2 text-white font-medium">Save Changes</StyledText>
              </StyledTouchable>
            </StyledView>
          )}
        </StyledView>
      </ScrollView>
    </StyledSafeAreaView>
  );
};

export default Profile;
