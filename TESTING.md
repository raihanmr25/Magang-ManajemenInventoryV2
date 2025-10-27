# Testing Your App

## Before You Start

Make sure you have:
1. ✅ Expo Go installed on your phone
2. ✅ Your Laravel API server running
3. ✅ Updated the API_URL in `config.js`
4. ✅ Your phone and computer on the same WiFi network

## Step-by-Step Testing

### 1. Find Your Computer's IP Address

**Windows (PowerShell):**
```powershell
ipconfig
```
Look for "IPv4 Address" (e.g., 192.168.1.100)

### 2. Update config.js

```javascript
export const API_URL = 'http://192.168.1.100:8000/api';
```
Replace `192.168.1.100` with YOUR actual IP address.

### 3. Test Your API First

Before running the app, test your API is accessible from your phone:

1. Open your phone's browser
2. Go to: `http://YOUR_IP:8000/api/inventory`
3. You should see your inventory data

If this doesn't work, check:
- Is your Laravel server running? (`php artisan serve --host=0.0.0.0 --port=8000`)
- Is your firewall blocking the connection?
- Are both devices on the same network?

### 4. Start the Expo App

```bash
npm start
```

or

```bash
npx expo start
```

### 5. Open in Expo Go

1. Open Expo Go app on your phone
2. Scan the QR code from the terminal
3. Wait for the app to load
4. Grant camera permission when asked

### 6. Test Barcode Scanning

1. Tap "Start Scanning"
2. Point camera at a barcode
3. The app should:
   - Scan the barcode automatically
   - Show loading indicator
   - Display item information from your API

## Sample Test Data

If you want to test with sample barcodes, you can use:
- Standard product barcodes (EAN-13, UPC-A)
- QR codes with barcode numbers
- Generate test barcodes online at: https://barcode.tec-it.com/

Make sure the barcode exists in your inventory database!

## Common Issues

### "No access to camera"
- Go to phone Settings → Apps → Expo Go → Permissions → Enable Camera

### "Failed to fetch item data"
- Check API_URL in config.js
- Make sure the barcode exists in your database
- Check Laravel logs for errors

### "Network request failed"
- Verify your IP address is correct
- Make sure Laravel is running with `--host=0.0.0.0`
- Check firewall settings
- Try accessing the API from your phone's browser first

### Barcode not scanning
- Ensure good lighting
- Keep the barcode steady
- Try different distances from the camera
- Make sure the barcode is clear and not damaged

## API Response Format

Your API should return JSON data. The app will display all fields returned. Example:

```json
{
  "id": 1,
  "barcode": "1234567890",
  "name": "Product Name",
  "quantity": 100,
  "price": 25000,
  "category": "Electronics"
}
```

All fields will be displayed in the app automatically!

## Success!

If everything works, you should be able to:
- ✅ Open the app
- ✅ Scan a barcode
- ✅ See the item information from your database

Happy scanning! 📦✨
