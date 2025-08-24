# Alphago - Delivery Management App

A complete cross-platform mobile delivery application built with Expo, React Native, TypeScript, and Firebase. Alphago provides a comprehensive solution for managing delivery orders with separate interfaces for users and administrators.

## 🌟 Features

### User Features
- **Authentication**: Email/password registration and login with password reset
- **Order Creation**: Create delivery orders with customer details, location picker, and pricing
- **Order Management**: View, edit, delete, and track personal orders
- **Real-time Updates**: Live order status updates
- **Multi-language Support**: English and French localization
- **Profile Management**: Update profile information and photos

### Admin Features
- **Dashboard**: Overview of daily orders, revenue, and key metrics
- **Order Management**: View, update, and manage all orders system-wide
- **Analytics**: Detailed reports with charts and insights
- **User Management**: View and manage system users
- **Zone Management**: Configure delivery zones
- **Search & Filters**: Advanced filtering and search capabilities

### Technical Features
- **Cross-platform**: iOS and Android support
- **Offline Support**: Local persistence with sync when online
- **Real-time Data**: Firebase Firestore real-time subscriptions
- **Modern UI**: Clean, accessible design with custom theme
- **Type Safety**: Full TypeScript implementation
- **Security**: Role-based access control with Firestore security rules

## 🛠 Tech Stack

- **Framework**: Expo 49.x with React Native 0.72
- **Language**: TypeScript
- **Backend**: Firebase (Auth, Firestore, Storage)
- **Navigation**: React Navigation v6
- **State Management**: Zustand with persistence
- **Maps**: React Native Maps with Google Maps
- **Localization**: react-i18next
- **UI Components**: Custom component library
- **Testing**: Jest with React Native Testing Library

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v16 or higher)
- [npm](https://www.npmjs.com/) or [Yarn](https://yarnpkg.com/)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- [Firebase CLI](https://firebase.google.com/docs/cli) (optional, for deployment)
- [Android Studio](https://developer.android.com/studio) (for Android development)
- [Xcode](https://developer.apple.com/xcode/) (for iOS development, macOS only)

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/alphago-delivery.git
cd alphago-delivery
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Firebase Setup

#### Create a Firebase Project
1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Create a new project named "Alphago"
3. Enable the following services:
   - Authentication (Email/Password provider)
   - Firestore Database
   - Storage
   - Cloud Messaging (optional, for push notifications)

#### Configure Authentication
1. In Firebase Console, go to Authentication > Sign-in method
2. Enable "Email/Password" provider
3. Add your domain to authorized domains if deploying to web

#### Setup Firestore Database
1. Create a Firestore database in production mode
2. Deploy the security rules:
   ```bash
   firebase deploy --only firestore:rules
   ```

#### Get Firebase Configuration
1. Go to Project settings > General
2. Add an app for each platform (iOS/Android/Web)
3. Copy the configuration object

### 4. Environment Configuration

Create a `.env` file in the root directory based on `.env.example`:

```bash
cp .env.example .env
```

Update the `.env` file with your Firebase configuration:

```env
EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key_here
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id
EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
EXPO_PUBLIC_NODE_ENV=development
```

### 5. Google Maps Setup

#### Get Google Maps API Key
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable the following APIs:
   - Maps SDK for Android
   - Maps SDK for iOS
   - Places API (optional)
4. Create credentials (API Key)
5. Restrict the API key to your app's bundle identifiers

#### Configure Maps in app.json
Update `app.json` with your Google Maps API key:

```json
{
  "expo": {
    "ios": {
      "config": {
        "googleMapsApiKey": "YOUR_GOOGLE_MAPS_API_KEY"
      }
    },
    "android": {
      "config": {
        "googleMaps": {
          "apiKey": "YOUR_GOOGLE_MAPS_API_KEY"
        }
      }
    }
  }
}
```

### 6. Initialize Default Data

Run the app once to initialize default zones in Firestore, or manually add zones:

```javascript
// Example zones for Tunisia
const zones = [
  {
    code: 'TUNIS_CENTRE',
    name: 'Tunis Centre',
    center: { lat: 36.8065, lng: 10.1815 }
  },
  {
    code: 'ARIANA',
    name: 'Ariana',
    center: { lat: 36.8625, lng: 10.1957 }
  }
  // Add more zones as needed
];
```

### 7. Create Admin Users

Admin users must be created manually in Firebase Authentication and Firestore:

1. **Firebase Authentication**:
   - Email format: `admin_username@alphago.internal`
   - Example: `admin_manager@alphago.internal`

2. **Firestore users collection**:
   ```javascript
   {
     uid: "firebase_auth_uid",
     displayName: "Admin Manager",
     email: "admin_manager@alphago.internal",
     role: "admin",
     createdAt: new Date()
   }
   ```

## 🏃‍♂️ Running the App

### Development Mode

```bash
# Start the development server
npm start
# or
yarn start

# Run on specific platform
npm run android  # Android
npm run ios      # iOS
npm run web      # Web browser
```

### Using Expo Go
1. Install Expo Go on your mobile device
2. Scan the QR code from the terminal
3. The app will load on your device

## 🧪 Testing

Run the test suite:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm test -- --coverage
```

## 📱 Building for Production

### Using EAS Build (Recommended)

1. **Install EAS CLI**:
   ```bash
   npm install -g @expo/eas-cli
   ```

2. **Login to Expo**:
   ```bash
   eas login
   ```

3. **Configure EAS**:
   ```bash
   eas build:configure
   ```

4. **Build for Android**:
   ```bash
   eas build --platform android
   ```

5. **Build for iOS**:
   ```bash
   eas build --platform ios
   ```

### Building APK/IPA Locally

#### Android APK
```bash
# Build Android APK
eas build --platform android --local
```

#### iOS IPA (macOS only)
```bash
# Build iOS IPA
eas build --platform ios --local
```

### Alternative: Expo Build (Deprecated)
```bash
# Build for Android
expo build:android

# Build for iOS
expo build:ios
```

## 🔧 Configuration

### App Configuration
Key configuration files:
- `app.json` - Expo configuration
- `babel.config.js` - Babel configuration
- `tsconfig.json` - TypeScript configuration
- `firestore.rules` - Firestore security rules

### Environment Variables
All environment variables should be prefixed with `EXPO_PUBLIC_` to be accessible in the app.

### Customization
- **Theme**: Modify `src/constants/theme.ts`
- **Localization**: Update `src/locales/en.json` and `src/locales/fr.json`
- **Firebase Rules**: Update `firestore.rules`

## 📊 Data Schema

### Firestore Collections

#### users/{userId}
```javascript
{
  uid: string,
  displayName: string,
  email: string,
  phoneNumber?: string,
  photoURL?: string,
  role: 'user' | 'admin',
  zoneCode?: string,
  createdAt: Timestamp
}
```

#### orders/{orderId}
```javascript
{
  customerName: string,
  customerPhone: string,
  zoneCode: string,
  zoneName: string,
  coords: { lat: number, lng: number },
  priceTND: number,
  items?: string[],
  note?: string,
  status: 'pending' | 'in_progress' | 'done' | 'cancelled',
  createdBy: string,
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

#### zones/{zoneCode}
```javascript
{
  name: string,
  center: { lat: number, lng: number },
  polygon?: GeoJSON
}
```

## 🛡️ Security

The app implements comprehensive security measures:

- **Authentication**: Firebase Authentication with email/password
- **Authorization**: Role-based access control (user/admin)
- **Data Security**: Firestore security rules enforce access permissions
- **Input Validation**: Client and server-side validation
- **Secure Storage**: Sensitive data stored securely

### Security Rules Summary
- Users can only access their own orders
- Admins can access all orders and user data
- Public read access to zones
- Authenticated write access with role validation

## 🌍 Localization

The app supports multiple languages:
- English (default)
- French

To add a new language:
1. Create a new JSON file in `src/locales/`
2. Add translations for all keys
3. Update the language selector
4. Add the language to the type definitions

## 🚀 Deployment

### Firebase Hosting (Web)
```bash
# Build for web
npm run web

# Deploy to Firebase Hosting
firebase deploy --only hosting
```

### App Stores

#### Google Play Store
1. Build signed APK/AAB using EAS Build
2. Create Play Console account
3. Upload and configure app listing
4. Submit for review

#### Apple App Store
1. Build signed IPA using EAS Build
2. Create App Store Connect account
3. Upload and configure app listing
4. Submit for review

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Troubleshooting

### Common Issues

#### Firebase Configuration
- Ensure all environment variables are correctly set
- Verify Firebase project configuration
- Check Firestore security rules

#### Maps Integration
- Verify Google Maps API key is valid
- Enable required APIs in Google Cloud Console
- Check platform-specific configuration

#### Build Issues
- Clear Expo cache: `expo r -c`
- Delete node_modules and reinstall
- Update Expo CLI to latest version

#### Android Builds
- Ensure Android SDK is installed
- Check Gradle version compatibility
- Verify signing configuration

#### iOS Builds
- Ensure Xcode is installed (macOS only)
- Check iOS simulator configuration
- Verify provisioning profiles

### Getting Help

- Check the [Expo Documentation](https://docs.expo.dev/)
- Visit [Firebase Documentation](https://firebase.google.com/docs)
- Create an issue in this repository
- Join the [Expo Discord](https://discord.gg/4gtbPAdpaE)

## 📞 Support

For support and questions:
- Email: support@alphago.app
- Issues: GitHub Issues
- Documentation: This README

---

Built with ❤️ using Expo and React Native
#   a p p - a l p h a g o  
 