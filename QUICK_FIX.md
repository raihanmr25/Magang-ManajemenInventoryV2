# ✅ Quick Fix Checklist for JSON Parse Error

## The Issue
`[SyntaxError: JSON Parse error: Unexpected character: <]`

This means the API is returning **HTML** (starts with `<`) instead of **JSON**.

## 🔥 Quick Fix (Do This First!)

### Test 1: Check Laravel is Running
```bash
php artisan serve --host=0.0.0.0 --port=8000
```

You should see:
```
Server running on [http://0.0.0.0:8000]
```

### Test 2: Check URL in Phone Browser

Open your **phone's browser** and go to:
```
http://YOUR_IP:8000/api/inventory
```

Replace `YOUR_IP` with your computer's IP from `ipconfig`.

**What do you see?**

#### ✅ If you see JSON:
```json
{
  "success": true,
  "data": [...]
}
```
Good! Go to Step 3.

#### ❌ If you see HTML error page:
This is your problem! Fix the Laravel error first.

**Common fixes:**
- Run migrations: `php artisan migrate`
- Check routes: `php artisan route:list | grep inventory`
- Check model exists: `app/Models/BarangPemakaian.php`
- Check database connection in `.env`

### Test 3: Update config.js

Open `config.js` and update:
```javascript
export const API_URL = 'http://YOUR_IP:8000/api';
```

Use the EXACT same IP that worked in your browser test!

### Test 4: Restart the App

```bash
# In terminal, stop Expo (Ctrl+C)
# Then restart with cleared cache:
npm run reset
```

## 🎯 Most Common Issues

| Issue | Solution |
|-------|----------|
| Laravel not running | `php artisan serve --host=0.0.0.0` |
| Wrong IP in config.js | Use IP from `ipconfig`, not localhost |
| Routes not registered | Check `routes/api.php` |
| Table doesn't exist | Run `php artisan migrate` |
| Different WiFi networks | Connect both to same WiFi |
| Firewall blocking | Allow PHP in Windows Firewall |

## 🔍 Debug Mode Enabled

The app now shows:
- 📡 URL being called
- 📥 Raw response from server
- ✅ Parsed JSON (if successful)
- ❌ Detailed error messages

**To see logs:**
1. In Expo terminal, press `j` to open debugger
2. Or shake your phone → "Debug"
3. Look for console.log messages

## 📝 What to Check in Order

1. [ ] Laravel running with `--host=0.0.0.0`
2. [ ] Get your IP: `ipconfig` → IPv4 Address
3. [ ] Test in browser: `http://YOUR_IP:8000/api/inventory`
4. [ ] Update `config.js` with your IP
5. [ ] Restart app: `npm run reset`
6. [ ] Check logs in Expo debugger

## 🚨 Emergency Test

If nothing works, try this simple test:

**Add to `routes/api.php`:**
```php
Route::get('/ping', function() {
    return ['message' => 'pong'];
});
```

**Test in phone browser:**
```
http://YOUR_IP:8000/api/ping
```

Should show:
```json
{"message":"pong"}
```

If this works, your Laravel API is fine. The issue is with the specific endpoint.

## 💡 Quick Wins

**1. Make sure routes exist:**
```bash
php artisan route:list | grep inventory
```

**2. Check Laravel logs:**
```bash
tail -f storage/logs/laravel.log
```

**3. Test a barcode that exists:**
```sql
SELECT barcode FROM barang_pemakaians LIMIT 1;
```

Use that barcode for testing!

## ✅ Success Looks Like This

**In browser you'll see:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "barcode": "123456",
    "nama": "Laptop",
    ...
  }
}
```

**In app you'll see:**
- Loading indicator
- Then item information displayed
- Success message

## 🆘 Still Stuck?

The app now gives you detailed error messages! When you scan:

1. Check the Alert message - it tells you what went wrong
2. Check console logs - shows the actual response
3. Test the exact URL in your phone's browser

The error message will tell you exactly what to fix! 🎯
