# Inventory Scanner App

A simple React Native mobile app built with Expo for scanning barcodes and viewing inventory item information.

## Features

- 📷 Barcode scanning using device camera
- 📦 View item details from your inventory API
- 🎨 Clean and simple UI
- 📱 Works with Expo Go

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure API URL

Open `App.js` and update the `API_URL` constant with your actual API endpoint:

```javascript
const API_URL = 'http://your-actual-api-url.com/api';
```

**Important:** If you're testing on a physical device, use your computer's local IP address instead of `localhost`. For example:
```javascript
const API_URL = 'http://192.168.1.100:8000/api';
```

### 3. Start the Development Server

```bash
npm start
```

or

```bash
npx expo start
```

### 4. Run on Your Device

1. Install **Expo Go** app on your Android or iOS device
2. Scan the QR code shown in the terminal or Metro bundler
3. The app will open in Expo Go
4. Grant camera permissions when prompted

## API Endpoints Used

The app connects to these endpoints:

- `GET /api/inventory/barcode/{barcode}` - Get item by barcode

## How to Use

1. Open the app
2. Tap "Start Scanning" button
3. Point your camera at a barcode
4. The app will automatically scan and display the item information
5. Tap "Scan Another Item" to scan more items

## Troubleshooting

### Camera Permission Issues
- Make sure you grant camera permission when the app asks
- On Android, check app settings if permission was denied

### API Connection Issues
- Ensure your API server is running
- Check that the API_URL is correct
- If testing on a physical device, make sure your phone and computer are on the same network
- Use your computer's local IP address (not localhost)

### Can't Connect to Development Server
- Make sure your phone and computer are on the same WiFi network
- Try restarting the Expo development server

## Project Structure

```
.
├── App.js              # Main app component with scanner logic
├── package.json        # Dependencies and scripts
├── app.json           # Expo configuration
├── babel.config.js    # Babel configuration
└── assets/            # App icons and images
```

## Technologies Used

- React Native
- Expo
- expo-barcode-scanner
- Expo Go (for testing)
