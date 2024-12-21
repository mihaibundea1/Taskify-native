// screens/VerificationScreen.js
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView 
} from 'react-native';
import { Mail, ArrowLeft } from 'lucide-react-native';
import { useSignUp } from '@clerk/clerk-expo';

export default function VerificationScreen({ navigation, route }) {
  const { signUp, setActive } = useSignUp();
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleVerification = async () => {
    if (!signUp) return;

    try {
      setIsLoading(true);
      
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });

      if (completeSignUp.status === 'complete') {
        await setActive({ session: completeSignUp.createdSessionId });
        Alert.alert(
          'Success',
          'Your email has been verified!',
          [
            {
              text: 'OK',
              onPress: () => navigation.replace('Task')
            }
          ]
        );
      } else {
        Alert.alert('Error', 'Verification failed. Please try again.');
      }
    } catch (err) {
      Alert.alert(
        'Error',
        err.message || 'Failed to verify email'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    try {
      setIsLoading(true);
      await signUp?.prepareEmailAddressVerification();
      Alert.alert('Success', 'Verification code has been resent');
    } catch (err) {
      Alert.alert('Error', 'Failed to resend code');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-gray-50"
    >
      <ScrollView 
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="w-[90%] mx-auto h-full py-[5%] justify-center">
          <TouchableOpacity 
            onPress={() => navigation.goBack()}
            className="absolute top-12 left-0"
          >
            <ArrowLeft size={24} color="#4B5563" />
          </TouchableOpacity>

          <View className="items-center mb-8">
            <View className="w-16 h-16 bg-blue-100 rounded-full items-center justify-center mb-4">
              <Mail size={32} color="#3B82F6" />
            </View>
            <Text className="text-2xl font-bold text-center">
              Verify your email
            </Text>
            <Text className="text-gray-500 text-center mt-2">
              We've sent a verification code to your email
            </Text>
          </View>

          <View className="space-y-4">
            <View>
              <Text className="text-sm font-medium text-gray-700 mb-1">
                Verification Code
              </Text>
              <TextInput
                value={code}
                onChangeText={setCode}
                placeholder="Enter verification code"
                placeholderTextColor="#9CA3AF"
                className="w-full h-[48px] px-4 bg-white border border-gray-300 rounded-md text-gray-900"
                keyboardType="number-pad"
                autoCapitalize="none"
                maxLength={6}
                editable={!isLoading}
              />
            </View>

            <TouchableOpacity
              onPress={handleVerification}
              disabled={isLoading || code.length < 6}
              className={`
                h-[48px] rounded-md bg-blue-600
                ${(isLoading || code.length < 6) ? 'opacity-70' : ''}
              `}
            >
              <Text className="text-white text-center font-semibold h-full leading-[48px]">
                {isLoading ? 'Verifying...' : 'Verify Email'}
              </Text>
            </TouchableOpacity>

            <View className="flex-row justify-center items-center space-x-1 mt-4">
              <Text className="text-gray-600">Didn't receive the code?</Text>
              <TouchableOpacity 
                onPress={handleResendCode}
                disabled={isLoading}
              >
                <Text className="text-blue-600 font-medium">
                  Resend
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}