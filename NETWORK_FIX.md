# 🔧 Network Request Failed - Troubleshooting Guide

## ❌ Masalah: Network Request Failed di APK Android

Setelah install APK di Android, muncul error "Network request failed" saat mencoba koneksi ke Laravel API.

---

## 🔍 Penyebab Utama

### 1. **Android Cleartext Traffic Policy** ⚠️
**Masalah Utama:** Android 9+ (API level 28+) memblokir HTTP (non-HTTPS) traffic secara default untuk keamanan.

**Kenapa?**
- Laravel local menggunakan `http://` bukan `https://`
- Android hanya mengizinkan HTTPS kecuali dikonfigurasi khusus
- APK production mode lebih strict dari development

### 2. **Network Security Configuration**
- APK memerlukan permission eksplisit untuk cleartext traffic
- Development mode (Expo Go) lebih permisif
- Production APK enforce security policy

---

## ✅ Solusi yang Sudah Diterapkan

### 1. **Update app.json**
```json
{
  "android": {
    "usesCleartextTraffic": true,
    "networkSecurityConfig": {
      "cleartextTrafficPermitted": true
    },
    "permissions": [
      "CAMERA",
      "INTERNET",
      "ACCESS_NETWORK_STATE"
    ]
  }
}
```

**Penjelasan:**
- `usesCleartextTraffic: true` - Izinkan HTTP traffic
- `cleartextTrafficPermitted: true` - Permit non-HTTPS connections
- `INTERNET` permission - Akses internet
- `ACCESS_NETWORK_STATE` - Check network status

### 2. **Enhanced Error Handling**
Tambah error handling yang lebih informatif:

```javascript
catch (error) {
  if (error.message === 'Network request failed') {
    Alert.alert(
      'Koneksi Gagal',
      'Pastikan:\n\n1. IP address benar\n2. HP dan server di network sama\n3. Firewall tidak blokir\n4. Laravel server running',
      [
        { text: 'Buka Settings', onPress: () => setShowSettings(true) },
        { text: 'OK' }
      ]
    );
  }
}
```

---

## 🔧 Cara Menggunakan Setelah Install APK

### Step 1: Install APK
```bash
# Download APK dari EAS build
# Install di Android device
```

### Step 2: Pertama Kali Buka App
1. **Buka Settings** (tap icon ⚙️ di pojok kanan atas)
2. **Masukkan IP Laravel Server**
   ```
   http://192.168.1.100:8000/api
   ```
3. **Simpan**

### Step 3: Pastikan Laravel Running
Di komputer/laptop:
```bash
# Jalankan Laravel dengan host 0.0.0.0
php artisan serve --host=0.0.0.0 --port=8000

# Output:
# Laravel development server started: http://0.0.0.0:8000
```

### Step 4: Check IP Address

**Windows:**
```powershell
ipconfig
```
Cari **IPv4 Address**, contoh: `192.168.1.100`

**Mac/Linux:**
```bash
ifconfig
# atau
ip addr show
```

### Step 5: Test Koneksi
1. Buka browser di HP
2. Akses: `http://192.168.1.100:8000`
3. Jika bisa akses → IP benar
4. Jika tidak bisa → check network/firewall

---

## 🚨 Checklist Troubleshooting

### ✅ Sebelum Build APK
- [ ] `app.json` sudah ada `usesCleartextTraffic: true`
- [ ] `app.json` sudah ada `INTERNET` permission
- [ ] Error handling sudah ditambahkan
- [ ] Version code naik (jika rebuild)

### ✅ Setelah Install APK
- [ ] Laravel server running
- [ ] Laravel menggunakan `--host=0.0.0.0`
- [ ] IP address sudah benar
- [ ] HP dan komputer di WiFi yang sama
- [ ] Firewall Windows tidak blokir port 8000
- [ ] Settings di app sudah diisi IP yang benar

---

## 🔥 Common Issues & Solutions

### Issue 1: "Network Request Failed"
**Penyebab:**
- IP address salah
- Laravel tidak running
- Firewall memblokir

**Solusi:**
```bash
# 1. Check Laravel running
php artisan serve --host=0.0.0.0 --port=8000

# 2. Check IP di komputer
ipconfig

# 3. Test dari browser HP
http://192.168.1.100:8000

# 4. Disable Windows Firewall sementara
# Control Panel → Windows Defender Firewall → Turn off (testing only)
```

### Issue 2: "Connection Timeout"
**Penyebab:**
- Network berbeda
- Firewall strict

**Solusi:**
```bash
# Allow port 8000 di Windows Firewall
netsh advfirewall firewall add rule name="Laravel Dev" dir=in action=allow protocol=TCP localport=8000

# Atau gunakan Laragon/XAMPP yang auto-configure firewall
```

### Issue 3: "Cannot connect to server"
**Penyebab:**
- HP menggunakan mobile data
- Komputer menggunakan Ethernet, HP WiFi

**Solusi:**
```
✅ Pastikan keduanya di WiFi yang SAMA
✅ Atau gunakan hotspot dari salah satu device
```

### Issue 4: IP Address berubah
**Penyebab:**
- DHCP assign IP dinamis
- Restart router/komputer

**Solusi:**
```bash
# Opsi 1: Set Static IP di komputer
# Control Panel → Network → Change Adapter Settings → 
# IPv4 Properties → Use following IP: 192.168.1.100

# Opsi 2: Update IP di app settings setiap kali berubah
```

---

## 📱 Testing Network Connection

### Test 1: Browser Test
```
Buka browser di HP Android
Akses: http://[IP_KOMPUTER]:8000
Harus muncul Laravel welcome page
```

### Test 2: API Endpoint Test
```
http://[IP_KOMPUTER]:8000/api/inventory
Harus return JSON data
```

### Test 3: Ping Test
```bash
# Di HP, install "Network Utilities" app
# Ping ke IP komputer
# Harus reply (<100ms)
```

---

## 🔄 Rebuild APK dengan Fix

Setelah update `app.json`, rebuild:

```bash
# Build new APK
eas build -p android --profile preview

# Atau untuk production
eas build -p android --profile production
```

**Penting:**
- Version code akan auto-increment
- Download APK baru
- Uninstall APK lama
- Install APK baru
- Setup IP di Settings lagi

---

## 🌐 Alternative: Menggunakan ngrok (untuk testing)

Jika mau test tanpa network yang sama:

```bash
# 1. Install ngrok
# Download dari https://ngrok.com

# 2. Run Laravel
php artisan serve

# 3. Run ngrok
ngrok http 8000

# 4. Ngrok akan berikan URL
# https://abc123.ngrok.io

# 5. Gunakan URL ini di app settings
# https://abc123.ngrok.io/api
```

**Keuntungan:**
- ✅ Bisa akses dari mana saja
- ✅ HTTPS otomatis
- ✅ Tidak perlu network yang sama

**Kekurangan:**
- ❌ Free tier limited
- ❌ URL berubah setiap restart
- ❌ Butuh internet

---

## 📋 Production Deployment Recommendations

Untuk production (bukan local testing):

### Option 1: Deploy Laravel ke Server
```bash
# Deploy ke:
- Digital Ocean
- AWS
- Heroku
- Laravel Vapor

# Dapatkan domain/IP static
# Gunakan HTTPS (Let's Encrypt gratis)
```

### Option 2: Gunakan Local Server Permanent
```bash
# Setup:
1. Static IP di komputer
2. Port forwarding di router (port 8000)
3. Dynamic DNS (no-ip.com gratis)
4. SSL dengan self-signed cert
```

### Option 3: Internal Network Only
```bash
# Untuk inventory internal kantor:
1. Server dedicated di kantor
2. Static IP local (192.168.1.100)
3. Semua device connect ke WiFi kantor
4. Simple dan aman
```

---

## 🎯 Best Practices

### Development
- ✅ Gunakan `http://` untuk local testing
- ✅ Enable cleartext traffic di app.json
- ✅ Test di real device, bukan emulator
- ✅ Gunakan WiFi yang sama

### Production
- ✅ Deploy Laravel ke server dengan HTTPS
- ✅ Gunakan domain proper (api.inventory.com)
- ✅ Remove cleartext traffic permission
- ✅ Implement proper auth (JWT/OAuth)

---

## 📞 Quick Troubleshooting Flowchart

```
Network Request Failed?
    ↓
[1] Laravel running?
    NO → php artisan serve --host=0.0.0.0
    YES → ↓
    
[2] IP address benar di Settings?
    NO → Check ipconfig, update di app
    YES → ↓
    
[3] HP dan komputer di WiFi sama?
    NO → Connect ke WiFi yang sama
    YES → ↓
    
[4] Test browser http://IP:8000
    FAIL → Check firewall
    SUCCESS → ↓
    
[5] Test API http://IP:8000/api/inventory
    FAIL → Check Laravel routes
    SUCCESS → ↓
    
[6] Rebuild APK dengan usesCleartextTraffic
    → eas build -p android --profile preview
```

---

## ✅ Verification Checklist

Setelah fix, pastikan:

- [ ] APK baru dengan cleartext traffic config
- [ ] Laravel running dengan `--host=0.0.0.0`
- [ ] IP di Settings app sudah benar
- [ ] Browser HP bisa akses Laravel
- [ ] API endpoint return JSON
- [ ] Scan barcode berhasil fetch data
- [ ] List tab bisa load semua items
- [ ] Search berfungsi normal

---

## 🎉 Summary

**Masalah:** Network request failed karena Android blokir HTTP traffic

**Solusi:**
1. ✅ Tambah `usesCleartextTraffic: true` di app.json
2. ✅ Enhanced error handling dengan instruksi jelas
3. ✅ Rebuild APK
4. ✅ Setup IP di Settings setelah install

**Next Steps:**
1. Rebuild APK dengan config baru
2. Install di Android
3. Buka Settings, masukkan IP
4. Test koneksi

**App sudah siap untuk rebuild dan deploy!** 🚀
