import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Alert } from 'react-native';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react-native';
import { useSignIn, useOAuth } from '@clerk/clerk-expo';
import * as WebBrowser from 'expo-web-browser';

WebBrowser.maybeCompleteAuthSession();

export default function Login({ navigation }) {
  const { signIn, setActive, isLoaded } = useSignIn();
  const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });
  
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async () => {
    if (!isLoaded) return;

    try {
      setIsLoading(true);
      
      const completeSignIn = await signIn.create({
        identifier: email,
        password,
      });

      await setActive({ session: completeSignIn.createdSessionId });
      Alert.alert('Success', 'Logged in successfully!');
    } catch (err) {
      Alert.alert('Error', err.message || 'Failed to sign in');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      const { createdSessionId, signIn, signUp, setActive } = await startOAuthFlow();
      
      if (createdSessionId) {
        await setActive({ session: createdSessionId });
        Alert.alert('Success', 'Logged in with Google successfully!');
      }
    } catch (err) {
      Alert.alert('Error', err.message || 'Failed to sign in with Google');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-gray-50">
      <View className="w-[90%] mx-auto h-full py-[10%] justify-center">
        <Text className="text-2xl font-bold text-center mb-[8%]">Welcome Back</Text>
        
        <View className="space-y-[4%]">
          <View>
            <Text className="text-sm font-medium text-gray-700 mb-[2%]">Email</Text>
            <View className="relative h-12">
              <View className="absolute left-3 top-[25%] z-10">
                <Mail size={20} color="#9CA3AF" />
              </View>
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="Enter your email"
                className="w-full h-full pl-10 pr-3 bg-white border border-gray-300 rounded-md"
                keyboardType="email-address"
                autoCapitalize="none"
                editable={!isLoading}
              />
            </View>
          </View>

          <View>
            <Text className="text-sm font-medium text-gray-700 mb-[2%]">Password</Text>
            <View className="relative h-12">
              <View className="absolute left-3 top-[25%] z-10">
                <Lock size={20} color="#9CA3AF" />
              </View>
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="Enter your password"
                secureTextEntry={!showPassword}
                className="w-full h-full pl-10 pr-10 bg-white border border-gray-300 rounded-md"
                editable={!isLoading}
              />
              <TouchableOpacity 
                onPress={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-[25%] z-10"
              >
                {showPassword ? 
                  <EyeOff size={20} color="#9CA3AF" /> : 
                  <Eye size={20} color="#9CA3AF" />
                }
              </TouchableOpacity>
            </View>
          </View>

          <View className="flex-row justify-between items-center">
            <TouchableOpacity 
              className="flex-row items-center" 
              onPress={() => setRememberMe(!rememberMe)}
              disabled={isLoading}
            >
              <View className={`w-4 h-4 border rounded mr-2 ${rememberMe ? 'bg-blue-600 border-blue-600' : 'border-gray-300'}`} />
              <Text className="text-sm text-gray-600">Remember me</Text>
            </TouchableOpacity>
            <TouchableOpacity disabled={isLoading}>
              <Text className="text-sm text-blue-600">Forgot password?</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity 
            className={`bg-blue-600 h-12 rounded-md mt-[5%] ${isLoading ? 'opacity-70' : ''}`}
            onPress={handleSignIn}
            disabled={isLoading}
          >
            <Text className="text-white text-center font-semibold leading-[48px]">
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Text>
          </TouchableOpacity>

          <View className="flex-row items-center my-[5%]">
            <View className="flex-1 h-px bg-gray-300" />
            <Text className="mx-4 text-gray-500 text-sm">Or continue with</Text>
            <View className="flex-1 h-px bg-gray-300" />
          </View>

          <TouchableOpacity 
            className={`flex-row items-center justify-center h-12 bg-white border border-gray-300 rounded-md ${isLoading ? 'opacity-70' : ''}`}
            onPress={handleGoogleSignIn}
            disabled={isLoading}
          >
            <Image 
              source={{ uri: 'https://www.google.com/favicon.ico' }}
              className="w-6 h-6 mr-2"
            />
            <Text className="text-gray-700">
              {isLoading ? 'Loading...' : 'Sign in with Google'}
            </Text>
          </TouchableOpacity>

          <View className="flex-row justify-center mt-[5%]">
            <Text className="text-gray-600 text-sm">Don't have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')} disabled={isLoading}>
              <Text className="text-blue-600 text-sm">Sign up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}