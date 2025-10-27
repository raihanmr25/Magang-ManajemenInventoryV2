# 🔍 Debugging JSON Parse Error: Unexpected character: <

## What This Error Means

The error `JSON Parse error: Unexpected character: <` means your API is returning **HTML** instead of **JSON**.

This usually happens when:
1. ❌ Laravel is showing an error page (HTML)
2. ❌ The API endpoint doesn't exist (404 HTML page)
3. ❌ Laravel is not running
4. ❌ Wrong URL

## 🚨 Quick Fix Steps

### Step 1: Check What the API Actually Returns

Open your **phone's browser** (or computer browser) and visit:
```
http://YOUR_IP:8000/api/inventory/barcode/123456
```

**What do you see?**

#### Scenario A: You see JSON ✅
```json
{
  "success": true,
  "data": { ... }
}
```
**Action:** Great! Go to Step 2.

#### Scenario B: You see HTML error page ❌
Something like:
- "404 Not Found"
- "500 Internal Server Error"  
- Laravel error page with stack trace

**Action:** Fix the Laravel error first (see solutions below)

#### Scenario C: Connection timeout/refused ❌
**Action:** Laravel is not running or firewall is blocking

### Step 2: Common Issues & Solutions

## Issue 1: Routes Not Working

**Check if routes exist:**
```bash
php artisan route:list | grep inventory
```

**You should see:**
```
GET|HEAD  api/inventory/barcode/{barcode}
PUT       api/inventory/barcode/{barcode}
GET|HEAD  api/inventory
GET|HEAD  api/inventory/search
```

**If routes are missing:**

1. Check `routes/api.php` has:
```php
Route::middleware('api')->group(function () {
    Route::get('/inventory/barcode/{barcode}', [InventoryApiController::class, 'getByBarcode']);
    Route::put('/inventory/barcode/{barcode}', [InventoryApiController::class, 'updateByBarcode']);
    Route::get('/inventory', [InventoryApiController::class, 'index']);
    Route::get('/inventory/search', [InventoryApiController::class, 'search']);
});
```

2. Make sure the controller is imported:
```php
use App\Http\Controllers\InventoryApiController;
```

3. Clear route cache:
```bash
php artisan route:clear
php artisan route:cache
```

## Issue 2: Database Table Not Found

**Error in browser:** "Table 'database.barang_pemakaians' doesn't exist"

**Solution:**

1. Check your table name in the database
2. Update the model if needed

In `InventoryApiController.php`, change:
```php
$barang = BarangPemakaian::where('barcode', $barcode)->first();
```

Make sure the model `BarangPemakaian` exists and has the correct table name.

## Issue 3: Wrong URL in App

**Check your `config.js`:**

```javascript
// ❌ WRONG - These won't work on phone
export const API_URL = 'http://localhost:8000/api';
export const API_URL = 'http://127.0.0.1:8000/api';

// ✅ CORRECT - Use your actual IP
export const API_URL = 'http://192.168.43.157:8000/api';
```

**Find your IP:**
```powershell
ipconfig
```

## Issue 4: Laravel Not Running Properly

**Stop and restart Laravel:**
```bash
# Stop (Ctrl+C)
# Then restart with network access:
php artisan serve --host=0.0.0.0 --port=8000
```

**Make sure you see:**
```
Server running on [http://0.0.0.0:8000]
```

## Issue 5: CORS Issues

If browser works but app doesn't, add CORS middleware.

**Create `app/Http/Middleware/Cors.php`:**
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
            ->header('Access-Control-Allow-Headers', 'Content-Type, Accept, Authorization, X-Requested-With');
    }
}
```

**Register in `app/Http/Kernel.php`:**
```php
protected $middleware = [
    // ... other middleware
    \App\Http\Middleware\Cors::class,
];
```

## Issue 6: Model or Controller Error

**Check if BarangPemakaian model exists:**

`app/Models/BarangPemakaian.php`:
```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BarangPemakaian extends Model
{
    use HasFactory;

    protected $table = 'barang_pemakaians'; // Your actual table name
    
    protected $fillable = [
        'nibar',
        'kode_barang',
        'nama',
        'barcode',
        'spesifikasi',
        'lokasi',
        'pemakai',
        'status',
        'jabatan',
        'identitas',
        'alamat',
        'no_bast',
        'tgl_bast',
        'dokumen',
        'no_dok',
        'tgl_dok',
        'keterangan',
        'no_simda',
        'no_mesin',
        'tahun',
    ];
}
```

## 🔧 Step-by-Step Debug Process

### 1. Test Laravel Directly (Without App)

Open browser on your **computer** and test:

```
http://localhost:8000/api/inventory/barcode/123456
```

**If this returns HTML error:**
- Fix the Laravel error
- Check Laravel logs: `storage/logs/laravel.log`

**If this returns JSON:**
- Good! Laravel works locally.

### 2. Test from Network (Your Phone's Browser)

Open browser on your **phone** and test:

```
http://YOUR_IP:8000/api/inventory/barcode/123456
```

**If this returns HTML error:**
- Check firewall
- Make sure you used `--host=0.0.0.0`
- Check you're on same WiFi

**If this returns JSON:**
- Perfect! Network works.

### 3. Test the App

Only now test the app. If browser works but app doesn't:
- Check `config.js` has the correct IP
- Restart the Expo app
- Clear cache: `npm run reset`

## 🎯 Temporary Debug Mode

Let's add better error reporting to see what's being returned. 

I'll update the app to show you the actual response:

**Update `App.js` to log the response:**

```javascript
const fetchItemByBarcode = async (barcode) => {
  setLoading(true);
  try {
    console.log('Fetching:', `${API_URL}/inventory/barcode/${barcode}`);
    
    const response = await fetch(`${API_URL}/inventory/barcode/${barcode}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });
    
    // Get the raw text first to see what we're receiving
    const textResponse = await response.text();
    console.log('Raw response:', textResponse);
    
    // Try to parse as JSON
    const jsonData = JSON.parse(textResponse);
    console.log('Parsed JSON:', jsonData);
    
    if (!response.ok) {
      throw new Error(jsonData.message || 'Item not found');
    }
    
    if (jsonData.success && jsonData.data) {
      setItemData(jsonData.data);
    } else {
      throw new Error('Invalid response format from server');
    }
  } catch (error) {
    Alert.alert('Error', error.message || 'Failed to fetch item data');
    setItemData(null);
    console.error('Fetch error:', error);
  } finally {
    setLoading(false);
  }
};
```

This will show you exactly what the API returns!

## 📋 Checklist Before Testing

- [ ] Laravel server running with `php artisan serve --host=0.0.0.0`
- [ ] Routes exist: `php artisan route:list | grep inventory`
- [ ] Model `BarangPemakaian` exists
- [ ] Table `barang_pemakaians` exists in database
- [ ] At least one item has a barcode in database
- [ ] Can access API in computer browser: `http://localhost:8000/api/inventory`
- [ ] Can access API in phone browser: `http://YOUR_IP:8000/api/inventory`
- [ ] `config.js` has correct IP address
- [ ] Both devices on same WiFi

## 🚀 Quick Test Command

**In Laravel project, create a test route:**

Add to `routes/api.php`:
```php
Route::get('/test', function() {
    return response()->json([
        'success' => true,
        'message' => 'API is working!',
        'timestamp' => now()
    ]);
});
```

Test in browser:
```
http://YOUR_IP:8000/api/test
```

Should return:
```json
{
  "success": true,
  "message": "API is working!",
  "timestamp": "2025-10-10 12:34:56"
}
```

If this works, your API connection is fine. The issue is with the specific endpoint.

## ❓ Still Not Working?

Share the following info:

1. What do you see in browser when visiting:
   ```
   http://YOUR_IP:8000/api/inventory/barcode/123456
   ```

2. Laravel logs:
   ```bash
   tail -n 50 storage/logs/laravel.log
   ```

3. Your IP address from `ipconfig`

4. The value in `config.js`

This will help identify the exact issue! 🔍
