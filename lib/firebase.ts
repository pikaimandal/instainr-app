// Firebase configuration
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { TEST_MODE } from './config';

// Your web app's Firebase configuration
// In test mode, use mock values if environment variables are not available
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || (TEST_MODE ? 'test-api-key' : undefined),
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || (TEST_MODE ? 'test-project.firebaseapp.com' : undefined),
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || (TEST_MODE ? 'test-project' : undefined),
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || (TEST_MODE ? 'test-project.appspot.com' : undefined),
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || (TEST_MODE ? '123456789' : undefined),
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || (TEST_MODE ? '1:123456789:web:abcdef' : undefined)
};

// Initialize Firebase (only if not in test mode without credentials)
let app, db, auth;

// Only initialize Firebase if we have all the required config values or in test mode
if (TEST_MODE || (firebaseConfig.apiKey && firebaseConfig.projectId)) {
  try {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    auth = getAuth(app);
    console.log('Firebase initialized successfully');
  } catch (error) {
    console.error('Error initializing Firebase:', error);
    // Create mock objects for test mode
    if (TEST_MODE) {
      console.log('Using mock Firebase implementation for test mode');
      db = {
        collection: () => ({
          doc: () => ({
            set: async () => ({}),
            update: async () => ({}),
            get: async () => ({ exists: () => true, data: () => ({}) })
          }),
          where: () => ({
            orderBy: () => ({
              get: async () => ({ docs: [] })
            })
          })
        })
      } as any;
      
      auth = {
        onAuthStateChanged: () => () => {},
        signInWithCustomToken: async () => ({})
      } as any;
    }
  }
} else {
  console.warn('Firebase configuration is incomplete. Firebase features will not be available.');
  // Create mock objects for missing configuration
  db = {
    collection: () => ({
      doc: () => ({
        set: async () => ({}),
        update: async () => ({}),
        get: async () => ({ exists: () => true, data: () => ({}) })
      }),
      where: () => ({
        orderBy: () => ({
          get: async () => ({ docs: [] })
        })
      })
    })
  } as any;
  
  auth = {
    onAuthStateChanged: () => () => {},
    signInWithCustomToken: async () => ({})
  } as any;
}

export { app, db, auth }; 