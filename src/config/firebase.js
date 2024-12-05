import { initializeApp } from '@react-native-firebase/app';
import { getFirestore } from '@react-native-firebase/firestore';

// For React Native, we can either use a .env file with react-native-dotenv
// or directly store the config values here
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY || 'your-api-key',
  authDomain: process.env.FIREBASE_AUTH_DOMAIN || 'your-auth-domain',
  projectId: process.env.FIREBASE_PROJECT_ID || 'your-project-id',
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET || 'your-storage-bucket',
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || 'your-messaging-sender-id',
  appId: process.env.FIREBASE_APP_ID || 'your-app-id'
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

export default app;