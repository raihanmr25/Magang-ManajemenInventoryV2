# Quick Start Guide

## 🚀 Get Started in 3 Steps

### Step 1: Configure Your API
Open `config.js` and replace the API_URL with your actual server address:

```javascript
export const API_URL = 'http://192.168.1.XXX:8000/api';
```

**How to find your IP address:**
- Open PowerShell or Command Prompt
- Type: `ipconfig`
- Look for "IPv4 Address" under your active network adapter
- Example: 192.168.1.100

### Step 2: Start the App
```bash
npm start
```

### Step 3: Open in Expo Go
1. Install **Expo Go** from Play Store (Android) or App Store (iOS)
2. Scan the QR code from the terminal
3. Grant camera permission
4. Start scanning barcodes!

## 📱 Testing the App

### Your API Endpoints:
- ✅ `GET /api/inventory/barcode/{barcode}` - Get item by barcode
- ✅ `PUT /api/inventory/barcode/{barcode}` - Update item (not yet implemented in app)
- ✅ `GET /api/inventory` - Get all items (not yet implemented in app)
- ✅ `GET /api/inventory/search` - Search items (not yet implemented in app)

The app currently uses the first endpoint to fetch item data when a barcode is scanned.

## 🔧 Troubleshooting

**Problem: Can't connect to API**
- Make sure your Laravel server is running
- Check that your phone and computer are on the same WiFi
- Use your local IP (not localhost) in config.js
- Check if your API is accessible: open `http://YOUR_IP:8000/api/inventory` in your phone's browser

**Problem: Camera not working**
- Make sure you granted camera permission
- Try closing and reopening the app

**Problem: Barcode not scanning**
- Make sure the barcode is clear and well-lit
- Try moving the camera closer or farther from the barcode

## 📝 What You Get

This simple app includes:
- ✅ Barcode scanner using device camera
- ✅ Displays all item information from your API
- ✅ Clean, modern UI
- ✅ Works with Expo Go (no build required)
- ✅ Error handling

## 🎯 Next Steps (Optional Enhancements)

Want to add more features? Here are some ideas:
- Add ability to update items
- Show list of all inventory items
- Add search functionality
- Add item images
- Implement offline mode
- Add authentication

Enjoy your inventory scanner app! 📦📱
