# 🔧 API Connection Troubleshooting Guide

## ✅ Issue Fixed: JSON Parse Error

The app has been updated to properly handle your Laravel API response format:

```json
{
  "success": true,
  "data": {
    // Your item data here
  }
}
```

## 🚀 How to Set Up API Connection

### Step 1: Start Laravel Server

**IMPORTANT:** Use `--host=0.0.0.0` to allow external connections:

```bash
php artisan serve --host=0.0.0.0 --port=8000
```

❌ **DON'T USE:** `php artisan serve` (only works on localhost)
✅ **USE:** `php artisan serve --host=0.0.0.0`

### Step 2: Find Your Computer's IP Address

**On Windows (PowerShell):**
```powershell
ipconfig
```

Look for **"IPv4 Address"** under your active network adapter (usually WiFi or Ethernet).

Example output:
```
Wireless LAN adapter Wi-Fi:
   IPv4 Address. . . . . . . . . . . : 192.168.43.157
```

### Step 3: Update config.js

Open `config.js` and update the API_URL:

```javascript
export const API_URL = 'http://192.168.43.157:8000/api';
```

Replace `192.168.43.157` with YOUR actual IP address from Step 2.

### Step 4: Test API in Browser First

Before using the app, test the API from your phone's browser:

1. Open your phone's browser (Chrome, Safari, etc.)
2. Go to: `http://YOUR_IP:8000/api/inventory`
3. You should see JSON data

If this doesn't work, the app won't work either. Fix the API connection first!

## 🐛 Common Issues & Solutions

### Issue 1: JSON Parse Error / Syntax Error

**Symptoms:**
- "JSON Parse error: Unexpected character"
- "SyntaxError: JSON Parse error"

**Causes:**
1. Laravel returning HTML instead of JSON (usually an error page)
2. Server not running
3. Wrong URL/endpoint
4. CORS issues

**Solutions:**

**A. Check if Laravel is running:**
```bash
php artisan serve --host=0.0.0.0 --port=8000
```

**B. Test the endpoint directly:**
Open in your phone's browser:
```
http://YOUR_IP:8000/api/inventory/barcode/YOUR_BARCODE
```

You should see:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "barcode": "123456",
    "nama": "Item Name",
    ...
  }
}
```

**C. Check Laravel routes:**
```bash
php artisan route:list | grep inventory
```

Make sure these routes exist:
```
GET|HEAD  api/inventory/barcode/{barcode}
PUT       api/inventory/barcode/{barcode}
GET|HEAD  api/inventory
GET|HEAD  api/inventory/search
```

**D. Add CORS headers (if needed):**

In `app/Http/Kernel.php`, add to `$middleware`:
```php
\App\Http\Middleware\Cors::class,
```

Create `app/Http/Middleware/Cors.php`:
```php
<?php

namespace App\Http\Middleware;

use Closure;

class Cors
{
    public function handle($request, Closure $next)
    {
        return $next($request)
            ->header('Access-Control-Allow-Origin', '*')
            ->header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
            ->header('Access-Control-Allow-Headers', 'Content-Type, Accept, Authorization');
    }
}
```

### Issue 2: Network Request Failed

**Symptoms:**
- "Network request failed"
- "Failed to fetch"

**Solutions:**

**A. Check same WiFi network:**
- Your phone and computer MUST be on the same WiFi network
- Check phone WiFi settings
- Check computer WiFi settings

**B. Check firewall:**
Windows Firewall might be blocking the connection.

1. Open "Windows Defender Firewall"
2. Click "Allow an app or feature through Windows Defender Firewall"
3. Make sure PHP is allowed for "Private" networks

**C. Try tunnel mode:**
```bash
npx expo start --tunnel
```

### Issue 3: Connection Timeout

**Solutions:**

**A. Use correct IP format:**
```javascript
// ✅ Correct
export const API_URL = 'http://192.168.43.157:8000/api';

// ❌ Wrong
export const API_URL = 'http://localhost:8000/api';  // Won't work on phone
export const API_URL = 'http://127.0.0.1:8000/api';  // Won't work on phone
```

**B. Check port 8000 is open:**
```bash
netstat -an | findstr :8000
```

Should show:
```
TCP    0.0.0.0:8000    0.0.0.0:0    LISTENING
```

### Issue 4: Item Not Found (404)

**Solutions:**

**A. Check if barcode exists in database:**
```sql
SELECT * FROM barang_pemakaians WHERE barcode = 'YOUR_BARCODE';
```

**B. Make sure the barcode field is filled:**
- Open your Laravel app
- Check the database table
- Ensure items have barcodes

**C. Test with a known barcode:**
Find a barcode from your database and test with that.

## 📱 Testing Checklist

Before scanning with the app, verify:

- [ ] Laravel server is running with `--host=0.0.0.0`
- [ ] You know your computer's IP address
- [ ] `config.js` has the correct IP address
- [ ] Both devices are on the same WiFi
- [ ] You can access the API from your phone's browser
- [ ] You have a barcode in the database to test

## 🔍 Debugging the App

The app now includes better error messages and console logging. If you have issues:

1. **Open Expo DevTools**
   - Press `j` in the terminal running Expo
   - Or shake your phone and select "Debug"

2. **Check the console logs**
   - Look for "Fetch error:" messages
   - This will show the exact error

3. **Test with a simple GET request first**
   - Try accessing `/api/inventory` endpoint
   - This should return all items

## 💡 Quick Test

**Test in your phone's browser first:**

1. **Test 1 - Get all items:**
   ```
   http://YOUR_IP:8000/api/inventory
   ```
   Should return JSON with all items

2. **Test 2 - Get item by barcode:**
   ```
   http://YOUR_IP:8000/api/inventory/barcode/KNOWN_BARCODE
   ```
   Should return JSON with one item

3. **Test 3 - Search items:**
   ```
   http://YOUR_IP:8000/api/inventory/search?q=test
   ```
   Should return JSON with matching items

If all tests pass in the browser, the app will work!

## ✅ Expected API Response Format

Your Laravel API correctly returns:

```json
{
  "success": true,
  "data": {
    "id": 1,
    "nibar": "001",
    "kode_barang": "KB001",
    "nama": "Laptop HP",
    "barcode": "123456789",
    "spesifikasi": "Intel i5, 8GB RAM",
    "lokasi": "Kantor Pusat",
    "pemakai": "John Doe",
    "status": "Baik",
    "jabatan": "Manager",
    "identitas": "ID001",
    "alamat": "Jakarta",
    "no_bast": "BAST001",
    "tgl_bast": "2024-01-01",
    "dokumen": "DOK001",
    "no_dok": "001",
    "tgl_dok": "2024-01-01",
    "keterangan": "Normal",
    "no_simda": "SIM001",
    "no_mesin": "HP001",
    "tahun": "2023",
    "created_at": "2024-01-01T00:00:00.000000Z",
    "updated_at": "2024-01-01T00:00:00.000000Z"
  }
}
```

The app is now configured to extract the `data` field automatically! ✅

## 🎉 Success!

Once you see JSON in your phone's browser, the app will work perfectly!

Happy scanning! 📦📱
