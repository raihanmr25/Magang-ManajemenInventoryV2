# 📱 Aplikasi Inventory Scanner - Panduan Lengkap

## 🎯 Fitur Utama

Aplikasi sekarang punya **3 TAB**:

### 1. 📷 TAB SCAN
**Untuk scan barcode barang**

**Cara pakai:**
1. Tap "Mulai Scan"
2. Arahkan kamera ke barcode
3. Data barang muncul otomatis
4. Bisa **EDIT** data langsung!

**Cara edit:**
- Tap tombol "✏️ Edit" (pojok kanan atas)
- Ubah data yang mau diubah
- Tap "💾 Simpan"
- Data terupdate ke database!

---

### 2. 📋 TAB LIST
**Lihat semua barang**

**Cara pakai:**
1. Tap tab "📋 List"
2. Semua barang tampil dalam bentuk card
3. Tap "Lihat Detail" untuk lihat detail & edit
4. Tap "🔄 Refresh" untuk reload data

**Setiap card menampilkan:**
- Nama barang
- Barcode
- Kode barang
- Lokasi
- Pemakai

---

### 3. 🔍 TAB SEARCH
**Cari barang**

**Cara pakai:**
1. Tap tab "🔍 Search"
2. Ketik kata kunci
3. Hasil muncul otomatis (real-time!)
4. Tap "Lihat Detail" untuk lihat & edit

**Bisa cari berdasarkan:**
- Nama barang
- Barcode
- Kode barang
- Lokasi
- Nama pemakai

---

## 🚀 Quick Start

### 1. Setup API
Edit file `config.js`:
```javascript
export const API_URL = 'http://192.168.X.X:8000/api';
```
Ganti dengan IP komputer kamu (cari dengan `ipconfig`)

### 2. Jalankan Laravel
```bash
php artisan serve --host=0.0.0.0 --port=8000
```

### 3. Jalankan App
```bash
npm start
```

### 4. Scan QR Code
- Buka Expo Go di HP
- Scan QR code
- App siap dipakai!

---

## 💡 Tips Penggunaan

### Scan Barang Baru
1. Tab Scan → Mulai Scan
2. Scan barcode
3. Lihat info barang
4. Edit jika perlu

### Update Data Barang
1. Scan barang atau cari via List/Search
2. Tap "✏️ Edit"
3. Ubah data
4. Tap "💾 Simpan"

### Cari Barang Cepat
1. Tab Search
2. Ketik nama/barcode/lokasi
3. Hasil langsung muncul
4. Tap untuk lihat detail

---

## ✅ Semua API Endpoint Terintegrasi

| Endpoint | Fungsi | Status |
|----------|--------|--------|
| `GET /api/inventory/barcode/{barcode}` | Cari by barcode | ✅ |
| `PUT /api/inventory/barcode/{barcode}` | Update barang | ✅ |
| `GET /api/inventory` | List semua barang | ✅ |
| `GET /api/inventory/search?q={query}` | Search barang | ✅ |

---

## 🎨 Screenshot Flow

### Flow 1: Scan & Edit
```
📷 Scan Tab 
   ↓
Tap "Mulai Scan"
   ↓
Scan Barcode
   ↓
Lihat Data Barang
   ↓
Tap "✏️ Edit"
   ↓
Ubah Data
   ↓
Tap "💾 Simpan"
   ↓
✅ Data Tersimpan!
```

### Flow 2: Search & View
```
🔍 Search Tab
   ↓
Ketik Kata Kunci
   ↓
Hasil Muncul
   ↓
Tap "Lihat Detail"
   ↓
Lihat/Edit Data
```

### Flow 3: Browse All
```
📋 List Tab
   ↓
Scroll Lihat Semua
   ↓
Tap "Lihat Detail"
   ↓
Lihat/Edit Data
```

---

## 🔧 Troubleshooting

### Error: JSON Parse
**Masalah:** API return HTML bukan JSON

**Solusi:**
1. Cek Laravel running: `php artisan serve --host=0.0.0.0`
2. Test di browser: `http://IP:8000/api/inventory`
3. Cek routes: `php artisan route:list | grep inventory`

### Error: Network Failed
**Masalah:** Tidak bisa connect ke API

**Solusi:**
1. Cek WiFi - harus sama
2. Cek IP di `config.js`
3. Cek firewall Windows
4. Test di browser HP dulu

### Update Tidak Jalan
**Masalah:** Edit tapi tidak tersimpan

**Solusi:**
1. Cek console log (press `j` di terminal Expo)
2. Cek API di browser dengan Postman
3. Cek Laravel logs: `storage/logs/laravel.log`

---

## 📋 Data yang Bisa Diedit

Semua field ini bisa di-edit via app:
- ✅ NIBAR
- ✅ Kode Barang
- ✅ Nama Barang
- ✅ Spesifikasi
- ✅ Lokasi
- ✅ Pemakai
- ✅ Status
- ✅ Jabatan
- ✅ Identitas
- ✅ Alamat
- ✅ No BAST
- ✅ Tanggal BAST
- ✅ Dokumen
- ✅ No Dokumen
- ✅ Tanggal Dokumen
- ✅ Keterangan
- ✅ No SIMDA
- ✅ No Mesin
- ✅ Tahun

---

## 🎯 Keunggulan App

✅ **Mudah Dipakai** - UI intuitif dengan tab navigation
✅ **Scan Cepat** - Barcode scanner otomatis
✅ **Edit Langsung** - Update data dari app
✅ **Search Real-time** - Hasil langsung muncul
✅ **List Lengkap** - Lihat semua inventaris
✅ **Responsive** - Smooth & fast
✅ **Error Handling** - Pesan error yang jelas
✅ **Mobile Friendly** - Optimized untuk HP

---

## 📱 Requirements

- ✅ Expo Go app (terbaru)
- ✅ Laravel API running
- ✅ WiFi connection (sama network)
- ✅ Camera permission

---

## 🎉 Siap Dipakai!

App sudah lengkap dengan semua fitur:
- ✅ Scan barcode
- ✅ Edit data barang
- ✅ List semua barang
- ✅ Search barang
- ✅ Integrasi penuh dengan API Laravel

**Backup:** File `App.js.backup` berisi versi lama jika perlu rollback.

Happy scanning! 📦📱✨
