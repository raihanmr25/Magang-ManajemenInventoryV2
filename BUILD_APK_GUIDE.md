# 📦 Panduan Build APK - Inventory Manager

## ✨ Fitur Baru yang Ditambahkan

### 1. **Settings untuk Ganti IP Address**
- Tekan icon ⚙️ di header untuk membuka pengaturan
- Masukkan IP address server Laravel Anda
- Contoh: `http://192.168.1.100:8000/api`
- IP akan tersimpan secara permanen menggunakan AsyncStorage

### 2. **UI Profesional Inventory Management**
- Design modern dengan color scheme profesional
- Header dengan gradient dan subtitle
- Card dengan border kiri berwarna
- Tabs yang lebih jelas dan elegant
- Empty states dengan icon dan pesan yang informatif

### 3. **Barcode Scanner UI yang Ditingkatkan**
- Frame scanner dengan corner markers
- **Horizontal scanning line** (garis hijau horizontal seperti barcode scanner sungguhan)
- Dark overlay untuk fokus lebih baik
- Instruksi yang lebih jelas

---

## 🚀 Cara Build APK

### Opsi 1: Build dengan EAS (Expo Application Services) - **DIREKOMENDASIKAN**

#### Langkah 1: Install EAS CLI
```powershell
npm install -g eas-cli
```

#### Langkah 2: Install Dependencies
```powershell
npm install
```

#### Langkah 3: Login ke Expo
```powershell
eas login
```
*Jika belum punya akun, buat di https://expo.dev*

#### Langkah 4: Configure Project
```powershell
eas build:configure
```

#### Langkah 5: Build APK
```powershell
npm run build:apk
```
atau
```powershell
eas build -p android --profile preview
```

#### Langkah 6: Download APK
- Setelah build selesai, akan muncul link download
- Download APK dan install di device Android Anda
- Atau scan QR code yang muncul untuk download langsung

---

### Opsi 2: Build dengan Expo Go (Testing Only)

**Catatan:** Ini hanya untuk testing, bukan APK standalone!

```powershell
npm install
npx expo start
```

Scan QR code dengan Expo Go app di HP Android Anda.

---

### Opsi 3: Build Local APK (Tanpa EAS)

**Memerlukan Android Studio dan setup yang lebih kompleks**

#### 1. Prebuild
```powershell
npx expo prebuild
```

#### 2. Build dengan Gradle
```powershell
cd android
.\gradlew assembleRelease
```

APK akan ada di: `android/app/build/outputs/apk/release/app-release.apk`

---

## 🔧 Konfigurasi Penting Sebelum Build

### 1. Update app.json
Buka `app.json` dan pastikan:
- `name`: Nama aplikasi Anda
- `version`: Versi aplikasi
- `android.package`: Package name unik (contoh: `com.yourcompany.inventory`)

### 2. Buat Icon dan Splash Screen (Opsional)
Letakkan file berikut di folder `assets/`:
- `icon.png` (1024x1024 px)
- `adaptive-icon.png` (1024x1024 px)
- `splash.png` (1284x2778 px)
- `favicon.png` (48x48 px)

Atau gunakan generator:
```powershell
npx expo install expo-splash-screen
```

### 3. Set Default API URL
Edit `config.js` untuk set default API URL:
```javascript
export const API_URL = 'http://192.168.1.100:8000/api';
```

---

## 📱 Cara Menggunakan Aplikasi

### 1. **Pertama Kali Buka**
- Buka aplikasi
- Tekan icon ⚙️ di pojok kanan atas
- Masukkan IP address server Laravel Anda
- Contoh: `http://192.168.1.100:8000/api`
- Tekan **Simpan**

### 2. **Cara Mendapatkan IP Address**
Di komputer/laptop yang menjalankan Laravel:

**Windows:**
```powershell
ipconfig
```
Cari **IPv4 Address** di adapter yang aktif (WiFi/Ethernet)

**Mac/Linux:**
```bash
ifconfig
```

Contoh IP: `192.168.1.100`
Format API URL: `http://192.168.1.100:8000/api`

### 3. **Pastikan Laravel Server Berjalan**
```bash
php artisan serve --host=0.0.0.0 --port=8000
```

### 4. **Pastikan HP dan Komputer di Network yang Sama**
- HP dan komputer harus terhubung ke WiFi yang sama
- Atau gunakan hotspot dari salah satu device

---

## 🎯 Fitur Aplikasi

### Tab Scan 📷
- Scan barcode untuk mencari barang
- Edit data barang langsung dari hasil scan
- Scanner dengan horizontal line (seperti barcode scanner sungguhan)

### Tab List 📋
- Lihat semua barang di inventory
- Refresh data dengan tombol 🔄
- Klik "Lihat Detail" untuk melihat detail barang

### Tab Search 🔍
- Cari barang berdasarkan nama, barcode, lokasi, atau pemakai
- Real-time search

### Settings ⚙️
- Ganti IP address server
- Reset ke default
- Lihat URL yang sedang aktif

---

## 🐛 Troubleshooting

### APK tidak bisa connect ke server
1. Pastikan HP dan komputer di network yang sama
2. Periksa IP address sudah benar
3. Pastikan Laravel server running
4. Periksa firewall tidak memblokir port 8000
5. Coba ping IP dari HP

### Build gagal
1. Pastikan semua dependencies terinstall: `npm install`
2. Clear cache: `npm run reset`
3. Update expo: `npx expo-cli upgrade`
4. Periksa error message dan Google solusinya

### Barcode tidak terdeteksi
1. Pastikan camera permission granted
2. Coba barcode dengan kontras yang jelas
3. Pastikan pencahayaan cukup
4. Posisikan barcode di dalam frame hijau

---

## 📝 Catatan

- **Network Local Only**: Aplikasi ini hanya untuk testing di network local
- **IP Dinamis**: Jika IP berubah, tinggal update di Settings
- **Production**: Untuk production, gunakan domain/IP static dan HTTPS
- **Database**: Pastikan database Laravel sudah ada data inventory

---

## 🎨 Customization

### Ganti Warna Tema
Edit `App.js`, cari bagian `styles`:
- Primary color: `#3498DB` (biru)
- Success color: `#27AE60` (hijau)
- Danger color: `#E74C3C` (merah)
- Dark color: `#2C3E50` (navy)

### Ganti Nama Aplikasi
Edit `app.json`:
```json
{
  "expo": {
    "name": "Nama Aplikasi Anda",
    "slug": "nama-aplikasi-anda"
  }
}
```

---

## 🚀 Build untuk Production

Untuk production build (upload ke Play Store):

```powershell
eas build -p android --profile production
```

Ini akan membuat AAB (Android App Bundle) yang siap diupload ke Google Play Store.

---

## 📞 Support

Jika ada masalah, pastikan:
1. ✅ Node.js versi terbaru
2. ✅ npm/yarn updated
3. ✅ Expo CLI terbaru
4. ✅ Laravel server running
5. ✅ Network connection OK

Happy Building! 🎉
