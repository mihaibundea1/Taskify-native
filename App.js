// App.js
import 'react-native-gesture-handler';
import React from 'react';
import { View, Text, Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ClerkProvider, SignedIn, SignedOut } from '@clerk/clerk-expo';
import { ListTodo, User } from 'lucide-react-native';
import * as SecureStore from 'expo-secure-store';
import Task from './src/screens/Task';
import TaskDetails from './src/screens/TaskDetails';
import Login from './src/screens/Login';
import Register from './src/screens/Register';
import Profile from './src/screens/Profile';
import VerificationScreen from './src/screens/VerificationScreen';
import Settings from './src/screens/Settings';
import TaskForm from './src/screens/TaskForm';
import Premium from './src/screens/Premium';  // Importă PremiumBenefits
import { VITE_CLERK_PUBLISHABLE_KEY } from '@env';
import { TaskProvider } from './src/context/TaskContext';
import { ThemeProvider, useTheme } from './src/context/ThemeContext'; // Import ThemeProvider
import { styled } from 'nativewind';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledImage = styled(Image);

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const ProfileStack = createStackNavigator();

import * as WebBrowser from 'expo-web-browser';
WebBrowser.maybeCompleteAuthSession();

const tokenCache = {
  getToken: async (key) => {
    try {
      return await SecureStore.getItemAsync(key);
    } catch (err) {
      console.warn("Error getting token:", err);
      return null;
    }
  },
  saveToken: async (key, value) => {
    try {
      return await SecureStore.setItemAsync(key, value);
    } catch (err) {
      console.warn("Error saving token:", err);
      return null;
    }
  },
};

// Task Stack Navigator
const TaskStack = () => {
  const { isDarkMode } = useTheme();
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: isDarkMode ? '#1f2937' : '#007BFF',
        },
        headerTintColor: isDarkMode ? '#fff' : '#000',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen
        name="TaskList"
        component={Task}
        options={{ title: 'My Tasks' }}
      />
      <Stack.Screen
        name="TaskDetails"
        component={TaskDetails}
        options={{ title: 'Task Details' }}
      />
      <Stack.Screen
        name="TaskForm"
        component={TaskForm}
        options={{
          title: 'New Task',
        }}
      />
    </Stack.Navigator>
  );
};

// Profile Stack Navigator
const ProfileStackNavigator = () => (
  <ProfileStack.Navigator>
    <ProfileStack.Screen
      name="ProfileMain"
      component={Profile}
      options={{ headerShown: false }}
    />
    <ProfileStack.Screen
      name="Settings"
      component={Settings}
      options={{
        headerTitle: 'Settings',
        headerStyle: { backgroundColor: '#fff' },
        headerTintColor: '#007BFF',
        headerShadowVisible: false,
      }}
    />
    <ProfileStack.Screen
      name="Premium"  // Adăugați ecranul PremiumBenefits în stack
      component={Premium}
      options={{
        title: 'Premium Benefits',
        headerStyle: { backgroundColor: '#fff' },
        headerTintColor: '#007BFF',
        headerShadowVisible: false,
      }}
    />
  </ProfileStack.Navigator>
);

// Tab Navigator
const TabNavigator = () => {
  const { isDarkMode } = useTheme();
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          backgroundColor: isDarkMode ? '#1f2937' : '#fff',
        },
        tabBarActiveTintColor: isDarkMode ? '#4F46E5' : '#007BFF',
        tabBarInactiveTintColor: isDarkMode ? '#9CA3AF' : '#6B7280',
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Tasks"
        component={TaskStack}
        options={{
          tabBarLabel: ({ color }) => (
            <StyledText className={`text-xs ${isDarkMode ? 'text-gray-200' : 'text-gray-500'}`}>Tasks</StyledText>
          ),
          tabBarIcon: ({ color, size }) => <ListTodo color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileStackNavigator}
        options={{
          tabBarLabel: ({ color }) => (
            <StyledText className={`text-xs ${isDarkMode ? 'text-gray-200' : 'text-gray-500'}`}>Profile</StyledText>
          ),
          tabBarIcon: ({ color, size }) => <User color={color} size={size} />,
        }}
      />
    </Tab.Navigator>
  );
};

export default function App() {
  return (
    <NavigationContainer>
      <ClerkProvider publishableKey={VITE_CLERK_PUBLISHABLE_KEY} tokenCache={tokenCache}>
        <ThemeProvider>
          <TaskProvider>
            <SignedIn>
              <TabNavigator />
            </SignedIn>
            <SignedOut>
              <Stack.Navigator
                screenOptions={{
                  headerStyle: { backgroundColor: '#4F46E5' },
                  headerTintColor: '#fff',
                  headerTitleStyle: { fontWeight: 'bold' },
                }}
              >
                <Stack.Screen name="Login" component={Login} />
                <Stack.Screen name="Register" component={Register} />
                <Stack.Screen name="VerifyCode" component={VerificationScreen} />
              </Stack.Navigator>
            </SignedOut>
          </TaskProvider>
        </ThemeProvider>
      </ClerkProvider>
    </NavigationContainer>
  );
}