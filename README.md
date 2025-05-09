# InstaINR - Worldcoin Mini App

InstaINR is a Worldcoin mini-app that enables Indian users to convert their tokens (WLD, USDC.e) to INR and withdraw to their preferred payment method.

## Features

- **World Wallet Authentication**: Secure login using Worldcoin's wallet authentication
- **Token Conversion**: Convert WLD and USDC.e tokens to INR with real-time pricing
- **Multiple Withdrawal Methods**: Support for UPI, PhonePe, Google Pay, Paytm, and Bank Transfer
- **Transaction History**: Track all your conversion and withdrawal transactions
- **KYC Verification**: Built-in verification using Aadhaar or PAN for regulatory compliance

## Prerequisites

- [Node.js](https://nodejs.org/) 18.0.0 or later
- [pnpm](https://pnpm.io/) package manager
- [World App](https://world.org/download) installed on a mobile device

## Production Deployment

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/instainr-app.git
   cd instainr-app
   ```

2. Install dependencies
   ```bash
   pnpm install
   ```

3. Set up your environment variables
   ```
   # Create a .env.local file with the following variables
   NEXT_PUBLIC_APP_ID=your_worldcoin_app_id
   DEV_PORTAL_API_KEY=your_developer_portal_api_key
   RECIPIENT_WALLET_ADDRESS=your_whitelisted_wallet_address
   ```

4. Build the application
   ```bash
   pnpm build
   ```

5. Start the production server
   ```bash
   pnpm start
   ```

6. Register your mini-app in the [Worldcoin Developer Portal](https://developer.worldcoin.org/)
   - Add your production URL
   - Configure your app settings
   - Whitelist your backend wallet address for payments

## Integration Details

### Worldcoin MiniKit

InstaINR uses the Worldcoin MiniKit SDK for:

- Wallet authentication via Sign-In with Ethereum (SIWE)
- Processing token payment transactions
- Detecting if the app is running inside World App

### API Endpoints

- `/api/nonce` - Generate nonce for SIWE authentication
- `/api/complete-siwe` - Verify SIWE signatures
- `/api/token-prices` - Fetch real-time token prices in INR
- `/api/initiate-pay` - Initiate token payment transactions
- `/api/verify-payment` - Verify payment transaction status
- `/api/withdrawals` - Process withdrawal requests
- `/api/transactions` - Retrieve transaction history

## Technology Stack

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **UI Components**: Shadcn UI
- **Authentication**: Worldcoin Wallet Auth
- **Payments**: Worldcoin MiniKit payments

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

For questions or support, please contact [your-email@example.com](mailto:your-email@example.com)

## Firebase Integration

This project now uses Firebase for data storage, replacing the previous Supabase implementation. 

Key Firebase components:
- Firestore Database: Stores users, payments, and transactions
- Firebase Admin SDK: Secure server-side operations

For detailed Firebase setup instructions, see [FIREBASE.md](./FIREBASE.md).