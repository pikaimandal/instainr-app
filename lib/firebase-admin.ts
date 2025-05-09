import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const serviceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
};

// Initialize Firebase Admin
function getFirebaseAdminApp() {
  const apps = getApps();
  if (apps.length > 0) {
    return apps[0];
  }
  
  return initializeApp({
    credential: cert(serviceAccount as any),
  });
}

// Get Firestore instance
export function getAdminFirestore() {
  const app = getFirebaseAdminApp();
  return getFirestore(app);
}

// Helper function to convert timestamps for serialization
export function convertTimestamps(obj: any) {
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