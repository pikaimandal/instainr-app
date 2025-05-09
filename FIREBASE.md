# Firebase Setup for InstaINR

This document explains how to set up Firebase for the InstaINR app.

## Setup Process

1. **Create a Firebase Project**
   - Go to the [Firebase Console](https://console.firebase.google.com/)
   - Click "Add project" and follow the setup wizard
   - Enable Google Analytics if desired

2. **Configure Firestore Database**
   - In the Firebase Console, go to the "Firestore Database" section
   - Click "Create database"
   - Choose "Start in production mode" for security rules
   - Select the region closest to your users
   - Click "Enable"

3. **Create Collections and Security Rules**
   - Firebase will automatically create collections when data is first added
   - The app is set up to create these collections:
     - `users`: Stores user information
     - `payments`: Stores payment details
     - `transactions`: Stores transaction history

4. **Security Rules Setup**
   - In the Firebase Console, go to the "Firestore Database" > "Rules" tab
   - Add the following security rules to secure your data:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow users to read their own data
    match /users/{userId} {
      allow read: if request.auth != null && request.auth.uid == userId;
      allow write: if false; // Only allow writes through server
    }
    
    // Payments can only be accessed by the server
    match /payments/{paymentId} {
      allow read, write: if false; // Only allow access through server
    }
    
    // Transactions can be read by authenticated users who own them
    match /transactions/{transactionId} {
      allow read: if request.auth != null && 
                  resource.data.wallet_address == request.auth.uid;
      allow write: if false; // Only allow writes through server
    }
  }
}
```

5. **Create a Web App**
   - In the Firebase Console, click on the gear icon (Project settings)
   - In the "General" tab, scroll to "Your apps" section
   - Click the web icon (</>) to add a web app
   - Register your app with a nickname
   - Copy the provided Firebase configuration

6. **Set Environment Variables**
   - Add the Firebase configuration to your `.env.local` file:
```
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

7. **Set Up Firebase Admin SDK**
   - In the Firebase Console, go to Project settings > Service accounts
   - Click "Generate new private key"
   - Download the JSON file
   - Add these values to your `.env.local` file:
```
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=your_client_email
FIREBASE_PRIVATE_KEY="your_private_key"
```

## Data Structure

### users
- `id`: UUID
- `wallet_address`: Ethereum wallet address
- `created_at`: Timestamp
- `updated_at`: Timestamp or null

### payments
- `id`: Payment ID string
- `amount`: Numeric amount
- `token`: Token type (WLD, USDC.e, ETH)
- `transaction_id`: Blockchain transaction ID (can be null)
- `status`: "pending", "completed", or "failed"
- `created_at`: Timestamp
- `updated_at`: Timestamp or null

### transactions
- `id`: UUID
- `wallet_address`: User's wallet address
- `token`: Token used
- `amount`: Token amount
- `inr_amount`: INR value
- `fee`: Fee amount
- `final_amount`: Final INR amount after fees
- `transaction_reference`: Reference ID
- `transaction_id`: Blockchain transaction ID (can be null)
- `payment_id`: Reference to a payment document
- `withdrawal_method`: Payment method ("upi", "phonepe", "gpay", "paytm", "bank")
- `withdrawal_details`: Object with payment details
- `verification_type`: ID verification type ("aadhaar" or "pan")
- `verification_number`: ID number
- `status`: "pending", "completed", or "failed"
- `created_at`: Timestamp
- `updated_at`: Timestamp or null

## Using Firebase in Components

To use Firebase in your components, import and use the `useFirebase` hook:

```typescript
import { useFirebase } from '@/hooks/use-firebase'

// In your component
const { 
  transactions, 
  isLoading, 
  error, 
  getTransactionHistory, 
  saveWithdrawalDetails 
} = useFirebase(walletAddress)

// Load transactions
useEffect(() => {
  getTransactionHistory()
}, [getTransactionHistory])

// Save withdrawal details
const handleSubmit = async (details) => {
  try {
    await saveWithdrawalDetails(details)
    // Success handling
  } catch (error) {
    // Error handling
  }
}
``` 