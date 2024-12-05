import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { ClerkProvider, SignedIn, SignedOut } from '@clerk/clerk-expo';
import * as SecureStore from 'expo-secure-store';
import Task from './src/Task';
import TaskDetails from './src/screens/TaskDetails';
import Login from './src/screens/Login';
import Register from './src/screens/Register';
import { VITE_CLERK_PUBLISHABLE_KEY } from '@env';

const Stack = createStackNavigator();

import * as WebBrowser from 'expo-web-browser';

WebBrowser.maybeCompleteAuthSession();

const tokenCache = {
  getToken: (key) => SecureStore.getItemAsync(key),
  saveToken: (key, value) => SecureStore.setItemAsync(key, value),
};

export default function App() {
  return (
    <ClerkProvider 
      publishableKey={VITE_CLERK_PUBLISHABLE_KEY}
      tokenCache={tokenCache}
    >
      <NavigationContainer>
        <SignedIn>
          <Stack.Navigator>
            <Stack.Screen name="Task" component={Task} />
            <Stack.Screen name="TaskDetails" component={TaskDetails} />
          </Stack.Navigator>
        </SignedIn>
        <SignedOut>
          <Stack.Navigator>
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Register" component={Register} />
          </Stack.Navigator>
        </SignedOut>
      </NavigationContainer>
    </ClerkProvider>
  );
}
