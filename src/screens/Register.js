import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView, Alert } from 'react-native';
import { Mail, Lock, Eye, EyeOff, User, Phone } from 'lucide-react-native';
import { useSignUp, useOAuth } from '@clerk/clerk-expo';
import * as WebBrowser from 'expo-web-browser';

WebBrowser.maybeCompleteAuthSession();

export default function Register({ navigation }) {
  const { signUp, setActive, isLoaded } = useSignUp();
  const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });
  
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: ''
  });

  const handleSignUp = async () => {
    if (!isLoaded) return;

    try {
      setIsLoading(true);

      const signUpAttempt = await signUp.create({
        emailAddress: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phoneNumber: formData.phone
      });

      await signUpAttempt.prepareEmailAddressVerification();

      Alert.alert(
        'Verify your email',
        'Please check your email to verify your account.',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('VerifyEmail', { email: formData.email })
          }
        ]
      );
    } catch (err) {
      Alert.alert('Error', err.message || 'Failed to sign up');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      setIsLoading(true);
      const { createdSessionId, signIn, signUp, setActive } = await startOAuthFlow();
      
      if (createdSessionId) {
        await setActive({ session: createdSessionId });
        Alert.alert('Success', 'Signed up with Google successfully!');
      }
    } catch (err) {
      Alert.alert('Error', err.message || 'Failed to sign up with Google');
    } finally {
      setIsLoading(false);
    }
  };

  const InputField = ({ icon, placeholder, value, onChange, secureTextEntry, keyboardType = 'default' }) => (
    <View className="relative w-full h-12">
      <View className="absolute left-3 top-[25%] z-10">
        {icon}
      </View>
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        className="w-full h-full pl-10 pr-3 bg-white border border-gray-300 rounded-md"
        autoCapitalize="none"
        editable={!isLoading}
      />
    </View>
  );

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="min-h-screen w-[90%] mx-auto py-[10%]">
        <View className="w-full">
          <Text className="text-3xl font-bold text-center mb-[8%]">Create Account</Text>
          
          <View className="space-y-4 mb-[5%]">
            <View className="flex-row space-x-3">
              <View className="flex-1">
                <Text className="text-sm font-medium text-gray-700 mb-1">First Name</Text>
                <InputField
                  icon={<User size={20} color="#9CA3AF" />}
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={(text) => setFormData({...formData, firstName: text})}
                />
              </View>
              <View className="flex-1">
                <Text className="text-sm font-medium text-gray-700 mb-1">Last Name</Text>
                <InputField
                  icon={<User size={20} color="#9CA3AF" />}
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={(text) => setFormData({...formData, lastName: text})}
                />
              </View>
            </View>

            <View>
              <Text className="text-sm font-medium text-gray-700 mb-1">Email</Text>
              <InputField
                icon={<Mail size={20} color="#9CA3AF" />}
                placeholder="Email"
                value={formData.email}
                onChange={(text) => setFormData({...formData, email: text})}
                keyboardType="email-address"
              />
            </View>

            <View>
              <Text className="text-sm font-medium text-gray-700 mb-1">Phone</Text>
              <InputField
                icon={<Phone size={20} color="#9CA3AF" />}
                placeholder="Phone number"
                value={formData.phone}
                onChange={(text) => setFormData({...formData, phone: text})}
                keyboardType="phone-pad"
              />
            </View>

            <View>
              <Text className="text-sm font-medium text-gray-700 mb-1">Password</Text>
              <View className="relative">
                <InputField
                  icon={<Lock size={20} color="#9CA3AF" />}
                  placeholder="Password"
                  value={formData.password}
                  onChange={(text) => setFormData({...formData, password: text})}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity 
                  onPress={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-[25%] z-10"
                  disabled={isLoading}
                >
                  {showPassword ? 
                    <EyeOff size={20} color="#9CA3AF" /> : 
                    <Eye size={20} color="#9CA3AF" />
                  }
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <TouchableOpacity 
            className={`w-full bg-blue-600 py-3 rounded-md mb-[5%] ${isLoading ? 'opacity-70' : ''}`}
            onPress={handleSignUp}
            disabled={isLoading}
          >
            <Text className="text-white text-center font-semibold text-lg">
              {isLoading ? 'Creating Account...' : 'Sign Up'}
            </Text>
          </TouchableOpacity>

          <View className="flex-row items-center mb-[5%]">
            <View className="flex-1 h-px bg-gray-300" />
            <Text className="mx-4 text-gray-500">Or continue with</Text>
            <View className="flex-1 h-px bg-gray-300" />
          </View>

          <TouchableOpacity 
            className={`w-full flex-row items-center justify-center py-3 bg-white border border-gray-300 rounded-md mb-[5%] ${isLoading ? 'opacity-70' : ''}`}
            onPress={handleGoogleSignUp}
            disabled={isLoading}
          >
            <Image 
              source={{ uri: 'https://www.google.com/favicon.ico' }}
              className="w-6 h-6 mr-2"
            />
            <Text className="text-gray-700 font-medium">
              {isLoading ? 'Loading...' : 'Sign up with Google'}
            </Text>
          </TouchableOpacity>

          <View className="flex-row justify-center">
            <Text className="text-gray-600">Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')} disabled={isLoading}>
              <Text className="text-blue-600">Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}