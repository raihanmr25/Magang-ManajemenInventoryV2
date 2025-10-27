# 🔧 Troubleshooting: Network Request Failed di Android APK

## 🔴 Masalah: "Network Request Failed"

Setelah install APK di Android, muncul error **"Network Request Failed"** saat mengakses API.

---

## 🎯 Penyebab Utama

### 1. **Cleartext Traffic (HTTP) Blocked** ⚠️
Android 9+ memblokir HTTP traffic secara default karena security policy.

### 2. **IP Address Salah** 📍
IP yang digunakan di Expo Go berbeda dengan IP yang digunakan di APK standalone.

### 3. **Network Berbeda** 📡
HP Android dan Server Laravel tidak di network WiFi yang sama.

### 4. **Firewall Blocking** 🔥
Windows Firewall atau antivirus memblokir koneksi dari IP eksternal.

---

## ✅ Solusi Lengkap

### Solusi 1: Gunakan `expo-build-properties` (RECOMMENDED)

**Sudah diimplementasi di project ini!**

File `app.config.js`:
```javascript
plugins: [
  [
    "expo-build-properties",
    {
      android: {
        usesCleartextTraffic: true,
        networkInspector: true
      }
    }
  ]
]
```

**Cara Apply:**
```bash
# Install plugin
npx expo install expo-build-properties

# Rebuild APK
eas build -p android --profile preview
```

---

### Solusi 2: Setting IP Address dengan Benar

#### A. Jangan Gunakan `localhost` atau `127.0.0.1`
❌ SALAH:
```
http://localhost:8000/api
http://127.0.0.1:8000/api
```

#### B. Gunakan IP Address yang Benar
✅ BENAR - Cari IP dengan cara:

**Windows (PowerShell):**
```powershell
ipconfig
```
Cari **"IPv4 Address"** di adapter WiFi/Ethernet aktif
Contoh: `192.168.1.100` atau `10.200.198.220`

**Mac/Linux:**
```bash
ifconfig
# atau
ip addr show
```

#### C. Format API URL yang Benar
```
http://192.168.1.100:8000/api
http://10.200.198.220:8000/api
```

**Cara Setting di App:**
1. Buka app
2. Tap icon ⚙️ (Settings) di pojok kanan atas
3. Masukkan IP: `http://YOUR_IP:8000/api`
4. Tap **Simpan**

---

### Solusi 3: Laravel Server Configuration

#### A. Jalankan dengan Host 0.0.0.0
❌ SALAH (hanya local):
```bash
php artisan serve
```

✅ BENAR (accessible dari network):
```bash
php artisan serve --host=0.0.0.0 --port=8000
```

#### B. Cek Laravel `.env`
```env
APP_URL=http://192.168.1.100:8000
```

#### C. Enable CORS di Laravel
File: `config/cors.php`
```php
'allowed_origins' => ['*'],
'allowed_methods' => ['*'],
'allowed_headers' => ['*'],
```

File: `app/Http/Kernel.php`
```php
protected $middleware = [
    // ...
    \Fruitcake\Cors\HandleCors::class,
];
```

---

### Solusi 4: Firewall & Network

#### A. Windows Firewall
1. Buka **Windows Defender Firewall**
2. Klik **"Advanced settings"**
3. Klik **"Inbound Rules"** → **"New Rule"**
4. Pilih **"Port"** → Next
5. Pilih **"TCP"** → Port: **8000**
6. Pilih **"Allow the connection"**
7. Apply ke **Domain, Private, Public**
8. Beri nama: **"Laravel Port 8000"**

#### B. Pastikan Same Network
- HP dan Laptop **HARUS** di WiFi yang sama
- Atau gunakan **Hotspot** dari salah satu device

#### C. Test Connection
```bash
# Di HP, buka browser
http://192.168.1.100:8000

# Harus tampil Laravel welcome page
```

---

### Solusi 5: Alternative - Gunakan HTTPS

Jika HTTP tetap tidak work, gunakan tunneling service:

#### A. Ngrok (Free)
```bash
# Install ngrok
ngrok http 8000

# Akan dapat URL seperti:
https://abc123.ngrok.io
```

Gunakan URL ini di app Settings:
```
https://abc123.ngrok.io/api
```

#### B. LocalTunnel (Free)
```bash
# Install
npm install -g localtunnel

# Run
lt --port 8000

# Dapat URL:
https://random-name.loca.lt
```

#### C. Serveo (Free, No Install)
```bash
ssh -R 80:localhost:8000 serveo.net

# Dapat URL:
https://random.serveo.net
```

---

## 🧪 Testing & Debugging

### 1. Test di Browser HP
```
http://192.168.1.100:8000
```
Jika tidak bisa dibuka → **Network/Firewall issue**

### 2. Check App Logs
Di APK, buka tab **List** atau **Search**
- Jika ada error → check console logs
- Error message akan memberikan hint

### 3. Test dengan Postman/Insomnia
```
GET http://192.168.1.100:8000/api/inventory
```
Harus return JSON response

### 4. Ping Test
```bash
# Di laptop/server
ping 192.168.1.XXX  # IP HP

# Di HP (gunakan Termux atau Ping app)
ping 192.168.1.100  # IP Laptop
```

---

## 📋 Checklist Troubleshooting

Sebelum rebuild APK, pastikan:

- [ ] ✅ Laravel server running: `php artisan serve --host=0.0.0.0 --port=8000`
- [ ] ✅ IP address benar (bukan localhost)
- [ ] ✅ HP dan laptop di WiFi yang sama
- [ ] ✅ Firewall tidak blocking port 8000
- [ ] ✅ CORS enabled di Laravel
- [ ] ✅ Test di browser HP bisa buka `http://IP:8000`
- [ ] ✅ `expo-build-properties` plugin installed
- [ ] ✅ `app.config.js` sudah ada config cleartext
- [ ] ✅ Version code di-increment di app.json
- [ ] ✅ Rebuild APK dengan `eas build`

---

## 🔧 Rebuild APK dengan Fix

```bash
# 1. Clean install
cd "g:\Mobile App\Magang ManajemenInventoryV2"
npm install

# 2. Ensure expo-build-properties installed
npx expo install expo-build-properties

# 3. Build APK baru
eas build -p android --profile preview

# 4. Download & install APK baru di HP
```

---

## 💡 Tips Production

### Untuk Deployment Production:

1. **Gunakan HTTPS** (wajib!)
   - Deploy Laravel ke server (VPS/Hosting)
   - Gunakan domain dengan SSL certificate
   - Example: `https://api.yourcompany.com/api`

2. **Hardcode API URL**
   Edit `config.js`:
   ```javascript
   export const API_URL = 'https://api.yourcompany.com/api';
   ```

3. **Remove Settings Option**
   Untuk production, user tidak perlu ganti IP

4. **Build Production APK**
   ```bash
   eas build -p android --profile production
   ```

---

## 📱 Error Messages & Solutions

| Error | Penyebab | Solusi |
|-------|----------|--------|
| Network request failed | Cleartext blocked / Wrong IP | Enable cleartext + fix IP |
| Connection timeout | Server tidak running | Start Laravel server |
| Connection refused | Firewall blocking | Open port 8000 |
| DNS lookup failed | Invalid hostname | Use IP address |
| JSON Parse error | HTML response | Check Laravel endpoint |
| CORS error | CORS not configured | Enable CORS di Laravel |

---

## 🎯 Quick Fix Summary

**Untuk fix "Network Request Failed":**

1. ✅ Install: `npx expo install expo-build-properties`
2. ✅ File sudah ada: `app.config.js` dengan plugin
3. ✅ Rebuild: `eas build -p android --profile preview`
4. ✅ Laravel: `php artisan serve --host=0.0.0.0 --port=8000`
5. ✅ Di app Settings: masukkan `http://YOUR_IP:8000/api`
6. ✅ Test di browser HP dulu: `http://YOUR_IP:8000`

---

## 📞 Still Having Issues?

Jika masih error, cek:
1. Versi Android (minimum Android 5.0)
2. Permissions granted (INTERNET, NETWORK_STATE)
3. Network proxy/VPN tidak aktif
4. Laravel `.env` APP_URL correct
5. Database connection working

---

**After following all steps above, rebuild APK and it should work!** 🎉
