import { TEST_MODE } from './config';

// Only import Firebase Admin if we're in a Node.js environment
let firebaseAdmin: any;
let adminFirestore: any;

try {
  if (typeof window === 'undefined') {
    // Server-side only imports
    firebaseAdmin = require('firebase-admin/app');
    adminFirestore = require('firebase-admin/firestore');
  }
} catch (error) {
  console.warn('Could not import Firebase Admin SDK, falling back to mock implementation');
}

const serviceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID || (TEST_MODE ? 'test-project' : undefined),
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL || (TEST_MODE ? 'firebase-adminsdk@test-project.iam.gserviceaccount.com' : undefined),
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n') || (TEST_MODE ? 'test-private-key' : undefined),
};

// Initialize Firebase Admin
function getFirebaseAdminApp() {
  if (!firebaseAdmin) {
    return mockAdminApp();
  }

  try {
    const apps = firebaseAdmin.getApps();
    if (apps.length > 0) {
      return apps[0];
    }
    
    // Only initialize if we have valid credentials or in test mode
    if (TEST_MODE || (serviceAccount.projectId && serviceAccount.clientEmail && serviceAccount.privateKey)) {
      return firebaseAdmin.initializeApp({
        credential: firebaseAdmin.cert(serviceAccount as any),
      });
    } else {
      console.warn('Firebase Admin SDK credentials are incomplete, using mock implementation');
      return mockAdminApp();
    }
  } catch (error) {
    console.error('Error initializing Firebase Admin:', error);
    if (TEST_MODE) {
      console.log('Using mock Firebase Admin implementation for test mode');
      return mockAdminApp();
    }
    throw error;
  }
}

// Mock implementation for tests and when Firebase Admin cannot be initialized
function mockAdminApp() {
  return {
    firestore: () => ({
      collection: (collectionName: string) => ({
        doc: (docId: string) => ({
          set: async () => ({}),
          update: async () => ({}),
          get: async () => ({ exists: true, data: () => ({ id: docId }) })
        }),
        where: () => ({
          limit: () => ({
            get: async () => ({ 
              empty: false, 
              docs: [{ 
                id: 'mock-doc-id', 
                data: () => ({ status: 'completed' }) 
              }] 
            })
          })
        })
      })
    })
  };
}

// Get Firestore instance
export function getAdminFirestore() {
  try {
    if (!adminFirestore) {
      return mockAdminApp().firestore();
    }
    
    const app = getFirebaseAdminApp();
    return adminFirestore.getFirestore(app);
  } catch (error) {
    console.error('Error getting admin Firestore:', error);
    return mockAdminApp().firestore();
  }
}

// Helper function to convert timestamps for serialization
export function convertTimestamps(obj: any): any {
  if (obj === null || obj === undefined || typeof obj !== 'object') {
    return obj;
  }

  // Handle arrays
  if (Array.isArray(obj)) {
    return obj.map(convertTimestamps);
  }

  // New object to keep original immutable
  const converted: any = {};

  Object.keys(obj).forEach((key) => {
    if (obj[key] && typeof obj[key].toMillis === 'function') {
      // Convert Firestore Timestamp to ISO string for better serialization
      converted[key] = new Date(obj[key].toMillis()).toISOString();
    } else if (typeof obj[key] === 'object') {
      // Recursively convert nested objects
      converted[key] = convertTimestamps(obj[key]);
    } else {
      converted[key] = obj[key];
    }
  });

  return converted;
} 