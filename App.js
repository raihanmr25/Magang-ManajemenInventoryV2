// App.js
import React, { useState, useEffect } from 'react';
import { 
  Text, 
  View, 
  StyleSheet, 
  ActivityIndicator, 
  ScrollView,
  Alert,
  TouchableOpacity,
  TextInput,
  Modal,
  FlatList,
  Dimensions,
  Image
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons, MaterialIcons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { API_URL as DEFAULT_API_URL } from './config';

// Import AuthScreen
import AuthScreen from './AuthScreen';

const { width } = Dimensions.get('window');

export default function App() {
  // State Autentikasi
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null); 
  const [showProfile, setShowProfile] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  
  // State Aplikasi
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [loading, setLoading] = useState(false);
  const [itemData, setItemData] = useState(null);
  const [activeTab, setActiveTab] = useState('scan');
  const [allItems, setAllItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({});
  const [showSettings, setShowSettings] = useState(false);
  const [apiUrl, setApiUrl] = useState(DEFAULT_API_URL);
  const [tempApiUrl, setTempApiUrl] = useState(DEFAULT_API_URL);

  useEffect(() => {
    loadApiUrl();
  }, []);

  const loadApiUrl = async () => {
    try {
      const savedUrl = await AsyncStorage.getItem('API_URL');
      if (savedUrl) {
        setApiUrl(savedUrl);
        setTempApiUrl(savedUrl);
      }
    } catch (error) {
      console.error('Error loading API URL:', error);
    }
  };

  const saveApiUrl = async () => {
    try {
      await AsyncStorage.setItem('API_URL', tempApiUrl);
      setApiUrl(tempApiUrl);
      setShowSettings(false);
      Alert.alert('Sukses', 'API URL berhasil disimpan!');
    } catch (error) {
      Alert.alert('Error', 'Gagal menyimpan API URL');
      console.error('Error saving API URL:', error);
    }
  };

  const resetApiUrl = () => {
    setTempApiUrl(DEFAULT_API_URL);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    setItemData(null);
    setAllItems([]);
    setSearchResults([]);
    setActiveTab('scan');
    setShowProfile(false);
    setShowLogoutConfirm(false);
  };

  // --- Fungsi API (Fetch, Update, Search) ---
  const fetchItemByBarcode = async (barcode) => {
    setLoading(true);
    try {
      const url = `${apiUrl}/inventory/barcode/${barcode}`;
      console.log('🔍 Fetching from:', url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        timeout: 10000,
      });
      
      const textResponse = await response.text();
      console.log('📄 Raw response:', textResponse.substring(0, 200));
      
      if (textResponse.trim().startsWith('<')) {
        Alert.alert(
          'API Error',
          'Server returned HTML instead of JSON. Pastikan:\n\n1. Laravel server berjalan\n2. IP address benar\n3. Endpoint API tersedia'
        );
        setItemData(null);
        return;
      }
      
      const jsonData = JSON.parse(textResponse);
      console.log('✅ Parsed JSON:', jsonData);
      
      if (!response.ok) {
        throw new Error(jsonData.message || 'Item not found');
      }
      
      if (jsonData.success && jsonData.data) {
        setItemData(jsonData.data);
        setEditData(jsonData.data);
        Alert.alert('Sukses', 'Barang ditemukan!');
      } else {
        throw new Error('Invalid response format from server');
      }
    } catch (error) {
      const errorMessage = error.message || 'Gagal mengambil data barang';
      
      if (error.message === 'Network request failed' || error.message === 'Failed to fetch') {
        Alert.alert(
          'Koneksi Gagal',
          'Tidak dapat terhubung ke server.\n\nPastikan:\n\n1. ⚙️ IP address di Settings sudah benar\n2. 📡 HP dan server di network yang sama\n3. 🔥 Firewall tidak memblokir koneksi\n4. ✅ Laravel server berjalan (php artisan serve --host=0.0.0.0)',
          [
            { text: 'Buka Settings', onPress: () => setShowSettings(true) },
            { text: 'OK', style: 'cancel' }
          ]
        );
      } else {
        Alert.alert('Error', errorMessage);
      }
      
      setItemData(null);
      console.error('❌ Fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateItemByBarcode = async () => {
    if (!itemData) return;
    
    setLoading(true);
    try {
      const url = `${apiUrl}/inventory/barcode/${itemData.barcode}`;
      console.log('📝 Updating:', url);
      
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editData),
      });
      
      const jsonData = await response.json();
      
      if (!response.ok) {
        throw new Error(jsonData.message || 'Gagal update barang');
      }
      
      if (jsonData.success && jsonData.data) {
        setItemData(jsonData.data);
        setEditData(jsonData.data);
        setEditMode(false);
        Alert.alert('Sukses', 'Barang berhasil diupdate!');
      }
    } catch (error) {
      Alert.alert('Error', error.message || 'Gagal update barang');
      console.error('❌ Update error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllItems = async () => {
    setLoading(true);
    try {
      const url = `${apiUrl}/inventory`;
      console.log('📋 Fetching all items from:', url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });
      
      const jsonData = await response.json();
      
      if (!response.ok) {
        throw new Error(jsonData.message || 'Gagal mengambil data');
      }
      
      if (jsonData.success && jsonData.data) {
        const items = jsonData.data.data || jsonData.data;
        setAllItems(items);
      }
    } catch (error) {
      Alert.alert('Error', error.message || 'Gagal mengambil semua data');
      console.error('❌ Fetch all error:', error);
    } finally {
      setLoading(false);
    }
  };

  const searchItems = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setLoading(true);
    try {
      const url = `${apiUrl}/inventory/search?q=${encodeURIComponent(query)}`;
      console.log('🔍 Searching:', url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });
      
      const jsonData = await response.json();
      
      if (!response.ok) {
        throw new Error(jsonData.message || 'Gagal search');
      }
      
      if (jsonData.success && jsonData.data) {
        setSearchResults(jsonData.data);
      }
    } catch (error) {
      Alert.alert('Error', error.message || 'Gagal mencari data');
      console.error('❌ Search error:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // --- Fungsi Scan ---
  const handleBarCodeScanned = ({ data }) => {
    setScanned(true);
    setScanning(false);
    fetchItemByBarcode(data);
  };

  const startScanning = () => {
    setScanned(false);
    setScanning(true);
    setItemData(null);
    setEditMode(false);
  };

  const cancelScanning = () => {
    setScanning(false);
    setScanned(false);
  };

  const selectItemFromList = (item) => {
    setItemData(item);
    setEditData(item);
    setActiveTab('scan');
  };

  const isPermissionGranted = permission?.granted;

  // --- Render Item Card ---
  const renderItemCard = (item, showSelectButton = false) => (
    <View key={item.id} style={styles.itemCard}>
      <View style={styles.itemHeader}>
        <Text style={styles.itemName}>{item.nama || 'N/A'}</Text>
        <View style={styles.barcodeRow}>
          <MaterialCommunityIcons name="barcode" size={16} color="#7F8C8D" />
          <Text style={styles.itemBarcode}> {item.barcode || 'N/A'}</Text>
        </View>
      </View>
      
      <View style={styles.itemDetails}>
        <View style={styles.detailRow}>
          <MaterialIcons name="inventory-2" size={14} color="#7F8C8D" />
          <Text style={styles.itemDetailText}> {item.kode_barang || 'N/A'}</Text>
        </View>
        <View style={styles.detailRow}>
          <Ionicons name="location" size={14} color="#7F8C8D" />
          <Text style={styles.itemDetailText}> {item.lokasi || 'N/A'}</Text>
        </View>
        <View style={styles.detailRow}>
          <FontAwesome5 name="user" size={12} color="#7F8C8D" />
          <Text style={styles.itemDetailText}>  {item.pemakai || 'N/A'}</Text>
        </View>
      </View>

      {showSelectButton && (
        <TouchableOpacity 
          style={styles.selectButton}
          onPress={() => selectItemFromList(item)}
        >
          <MaterialIcons name="visibility" size={16} color="white" />
          <Text style={styles.selectButtonText}> Lihat Detail</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  // --- KONDISI RENDER UTAMA ---

  // 1. Tampilkan AuthScreen jika belum login
  if (!isLoggedIn) {
    return (
      <AuthScreen 
        onLoginSuccess={(user) => {
          Alert.alert('Login Berhasil', `Selamat datang, ${user.name}!`);
          setIsLoggedIn(true);
          setCurrentUser(user);
        }} 
      />
    );
  }

  // 2. Jika sudah login, cek izin kamera
  if (!permission) {
    return (
      <View style={styles.container}>
        <Text>Meminta izin kamera...</Text>
      </View>
    );
  }

  if (!isPermissionGranted) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Inventory Scanner</Text>
        </View>
        <View style={styles.content}>
          <Text style={styles.errorText}>Tidak ada akses kamera</Text>
          <Text style={styles.helpText}>Izinkan akses kamera untuk scan barcode</Text>
          <TouchableOpacity style={styles.scanButton} onPress={requestPermission}>
            <Text style={styles.scanButtonText}>Berikan Izin</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // 3. Jika sudah login dan izin ada, tampilkan aplikasi utama
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.headerTitleRow}>
            <MaterialCommunityIcons name="package-variant" size={28} color="white" style={styles.headerIcon} />
            <View>
              {/* --- PERUBAHAN FONT DI SINI --- */}
              <Text style={styles.title}>Manajemen Inventori</Text>
              <Text style={styles.subtitle}>Sistem Manajemen Inventaris</Text>
              {/* --- AKHIR PERUBAHAN --- */}
            </View>
          </View>
          
          <View style={styles.headerIconsGroup}>
            <TouchableOpacity 
              style={styles.settingsButton}
              onPress={() => setShowSettings(true)}
            >
              <Ionicons name="settings" size={26} color="white" />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.profileButton}
              onPress={() => setShowProfile(true)}
            >
              <Image source={require('./assets/avatar.png')} style={styles.profileImage} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Settings Modal */}
      <Modal
        visible={showSettings}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowSettings(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View style={styles.modalTitleRow}>
                <Ionicons name="settings" size={24} color="#2C3E50" />
                <Text style={styles.modalTitle}> Pengaturan</Text>
              </View>
              <TouchableOpacity onPress={() => setShowSettings(false)}>
                <Ionicons name="close" size={28} color="#7F8C8D" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.settingSection}>
              <Text style={styles.settingLabel}>API URL</Text>
              <Text style={styles.settingHint}>
                Masukkan IP address server Laravel Anda
              </Text>
              <TextInput
                style={styles.settingInput}
                value={tempApiUrl}
                onChangeText={setTempApiUrl}
                placeholder="http://192.168.1.100:8000/api"
                autoCapitalize="none"
                autoCorrect={false}
              />
              
              <View style={styles.ipExamples}>
                <Text style={styles.exampleTitle}>Contoh:</Text>
                <TouchableOpacity onPress={() => setTempApiUrl('http://192.168.1.100:8000/api')}>
                  <Text style={styles.exampleText}>• http://192.168.1.100:8000/api</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setTempApiUrl('http://10.0.2.2:8000/api')}>
                  <Text style={styles.exampleText}>• http://10.0.2.2:8000/api (Android Emulator)</Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.currentUrl}>
                URL Aktif: {apiUrl}
              </Text>
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={styles.resetButton}
                onPress={resetApiUrl}
              >
                <Text style={styles.resetButtonText}>Reset Default</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.modalSaveButton}
                onPress={saveApiUrl}
              >
                <Ionicons name="save" size={18} color="white" />
                <Text style={styles.modalSaveButtonText}> Simpan</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal Profil */}
      <Modal
        visible={showProfile}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setShowProfile(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.profileModalContent}>
            <TouchableOpacity 
              style={styles.profileCloseButton}
              onPress={() => setShowProfile(false)}
            >
              <Ionicons name="close" size={28} color="#7F8C8D" />
            </TouchableOpacity>
            
            <Image 
              source={require('./assets/avatar.png')} 
              style={styles.profileModalAvatar}
            />
            <Text style={styles.profileModalName}>
              {currentUser?.name}
            </Text>
            <Text style={styles.profileModalEmail}>
              {currentUser?.email}
            </Text>

            <TouchableOpacity 
              style={styles.profileModalLogoutButton}
              onPress={() => {
                setShowProfile(false);
                setShowLogoutConfirm(true);
              }}
            >
              <Ionicons name="log-out-outline" size={22} color="#E74C3C" />
              <Text style={styles.profileModalLogoutButtonText}> Log Out</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal Konfirmasi Logout */}
      <Modal
        visible={showLogoutConfirm}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setShowLogoutConfirm(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.confirmModalContent}>
            <Text style={styles.confirmModalText}>Yakin mau Keluar?</Text>
            <View style={styles.confirmModalButtons}>
              <TouchableOpacity 
                style={styles.cancelConfirmButton}
                onPress={() => setShowLogoutConfirm(false)}
              >
                <Text style={styles.cancelConfirmButtonText}>Tidak</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.confirmButton}
                onPress={handleLogout}
              >
                <Text style={styles.confirmButtonText}>Iya</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>


      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'scan' && styles.activeTab]}
          onPress={() => setActiveTab('scan')}
        >
          <Ionicons 
            name="scan" 
            size={20} 
            color={activeTab === 'scan' ? '#3498DB' : '#7F8C8D'} 
          />
          <Text style={[styles.tabText, activeTab === 'scan' && styles.activeTabText]}>
            Scan
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'list' && styles.activeTab]}
          onPress={() => {
            setActiveTab('list');
            fetchAllItems();
          }}
        >
          <MaterialIcons 
            name="list-alt" 
            size={22} 
            color={activeTab === 'list' ? '#3498DB' : '#7F8C8D'} 
          />
          <Text style={[styles.tabText, activeTab === 'list' && styles.activeTabText]}>
            List
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'search' && styles.activeTab]}
          onPress={() => setActiveTab('search')}
        >
          <Ionicons 
            name="search" 
            size={20} 
            color={activeTab === 'search' ? '#3498DB' : '#7F8C8D'} 
          />
          <Text style={[styles.tabText, activeTab === 'search' && styles.activeTabText]}>
            Search
          </Text>
        </TouchableOpacity>
      </View>

      {/* --- KONTEN TAB (Scan, List, Search) --- */}
      {activeTab === 'scan' && (
        <>
          {scanning ? (
            <View style={styles.scannerContainer}>
              <CameraView
                style={StyleSheet.absoluteFillObject}
                facing="back"
                onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
                barcodeScannerSettings={{
                  barcodeTypes: [
                    "qr", "ean13", "ean8", "upc_a", "upc_e",
                    "code39", "code93", "code128", "pdf417", "aztec"
                  ],
                }}
              />
              <View style={styles.scanOverlay}>
                <View style={styles.overlayTop} />
                <View style={styles.scannerMiddle}>
                  <View style={styles.overlayLeft} />
                  <View style={styles.scanFrame}>
                    <View style={[styles.corner, styles.topLeft]} />
                    <View style={[styles.corner, styles.topRight]} />
                    <View style={[styles.corner, styles.bottomLeft]} />
                    <View style={[styles.corner, styles.bottomRight]} />
                    <View style={styles.scanLineContainer}>
                      <View style={styles.scanLine} />
                    </View>
                  </View>
                  <View style={styles.overlayRight} />
                </View>
                <View style={styles.overlayBottom}>
                  <Text style={styles.scanText}>Posisikan barcode di dalam frame</Text>
                  <Text style={styles.scanSubtext}>Scan akan otomatis terdeteksi</Text>
                </View>
              </View>
              
              <View style={styles.cancelButtonContainer}>
                <TouchableOpacity style={styles.cancelButton} onPress={cancelScanning}>
                  <Ionicons name="close-circle" size={20} color="white" />
                  <Text style={styles.cancelButtonText}> Batal</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style={styles.content}>
              {loading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color="#007AFF" />
                  <Text style={styles.loadingText}>Memuat data...</Text>
                </View>
              ) : itemData ? (
                <ScrollView style={styles.dataContainer}>
                  <View style={styles.card}>
                    <View style={styles.cardHeader}>
                      <Text style={styles.cardTitle}>Informasi Barang</Text>
                      {!editMode ? (
                        <TouchableOpacity onPress={() => setEditMode(true)} style={styles.editButtonContainer}>
                          <MaterialIcons name="edit" size={18} color="#3498DB" />
                          <Text style={styles.editButton}> Edit</Text>
                        </TouchableOpacity>
                      ) : (
                        <View style={styles.editButtons}>
                          <TouchableOpacity onPress={updateItemByBarcode} style={styles.saveButtonContainer}>
                            <Ionicons name="checkmark-circle" size={18} color="#27AE60" />
                            <Text style={styles.saveButton}> Simpan</Text>
                          </TouchableOpacity>
                          <TouchableOpacity onPress={() => {
                            setEditMode(false);
                            setEditData(itemData);
                          }}>
                            <Ionicons name="close-circle" size={18} color="#E74C3C" />
                          </TouchableOpacity>
                        </View>
                      )}
                    </View>
                    
                    {editMode ? (
                      <View>
                        {Object.keys(editData).map((key) => {
                          if (key === 'id' || key === 'created_at' || key === 'updated_at') return null;
                          return (
                            <View key={key} style={styles.inputRow}>
                              <Text style={styles.inputLabel}>{key}:</Text>
                              <TextInput
                                style={styles.textInput}
                                value={String(editData[key] || '')}
                                onChangeText={(text) => setEditData({...editData, [key]: text})}
                                placeholder={`Masukkan ${key}`}
                              />
                            </View>
                          );
                        })}
                      </View>
                    ) : (
                      Object.entries(itemData).map(([key, value]) => {
                        if (key === 'created_at' || key === 'updated_at') return null;
                        return (
                          <View key={key} style={styles.dataRow}>
                            <Text style={styles.dataLabel}>{key}:</Text>
                            <Text style={styles.dataValue}>
                              {value !== null && value !== undefined ? String(value) : 'N/A'}
                            </Text>
                          </View>
                        );
                      })
                    )}
                  </View>
                </ScrollView>
              ) : (
                <View style={styles.emptyState}>
                  <MaterialCommunityIcons name="package-variant" size={80} color="#BDC3C7" />
                  <Text style={styles.emptyText}>Belum ada barang yang di-scan</Text>
                  <Text style={styles.emptySubtext}>Tap tombol di bawah untuk mulai scan</Text>
                </View>
              )}

              {!scanning && !loading && (
                <View style={styles.buttonContainer}>
                  <TouchableOpacity style={styles.scanButton} onPress={startScanning}>
                    <Ionicons name="scan" size={20} color="white" />
                    <Text style={styles.scanButtonText}>
                      {itemData ? ' Scan Barcode Lagi' : ' Mulai Scan'}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )}
        </>
      )}

      {/* List Tab */}
      {activeTab === 'list' && (
        <View style={styles.content}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#007AFF" />
              <Text style={styles.loadingText}>Memuat data...</Text>
            </View>
          ) : (
            <ScrollView style={styles.listContainer}>
              <View style={styles.listHeader}>
                <Text style={styles.listTitle}>Semua Barang</Text>
                <TouchableOpacity onPress={fetchAllItems} style={styles.refreshButtonContainer}>
                  <Ionicons name="refresh" size={18} color="#3498DB" />
                  <Text style={styles.refreshButton}> Refresh</Text>
                </TouchableOpacity>
              </View>
              
              {allItems.length > 0 ? (
                allItems.map(item => renderItemCard(item, true))
              ) : (
                <View style={styles.emptyState}>
                  <MaterialCommunityIcons name="package-variant-closed" size={80} color="#BDC3C7" />
                  <Text style={styles.emptyText}>Tidak ada data</Text>
                  <Text style={styles.emptySubtext}>Belum ada barang di inventory</Text>
                </View>
              )}
            </ScrollView>
          )}
        </View>
      )}

      {/* Search Tab */}
      {activeTab === 'search' && (
        <View style={styles.content}>
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Cari nama, barcode, lokasi, atau pemakai..."
              value={searchQuery}
              onChangeText={(text) => {
                setSearchQuery(text);
                searchItems(text);
              }}
            />
          </View>

          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#007AFF" />
              <Text style={styles.loadingText}>Mencari...</Text>
            </View>
          ) : (
            <ScrollView style={styles.listContainer}>
              {searchResults.length > 0 ? (
                searchResults.map(item => renderItemCard(item, true))
              ) : searchQuery ? (
                <View style={styles.emptyState}>
                  <Ionicons name="search-circle" size={80} color="#BDC3C7" />
                  <Text style={styles.emptyText}>Tidak ada hasil</Text>
                  <Text style={styles.emptySubtext}>Coba kata kunci lain</Text>
                </View>
              ) : (
                <View style={styles.emptyState}>
                  <Ionicons name="search" size={80} color="#BDC3C7" />
                  <Text style={styles.emptyText}>Cari Barang</Text>
                  <Text style={styles.emptySubtext}>Ketik untuk mencari barang</Text>
                </View>
              )}
            </ScrollView>
          )}
        </View>
      )}
    </View>
  );
}

// --- STYLESHEET (Menambahkan style baru untuk header icons) ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  header: {
    backgroundColor: '#2C3E50',
    paddingTop: 45,
    paddingBottom: 20,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1, 
  },
  headerIcon: {
    marginRight: 10,
  },
  // --- PERUBAHAN FONT DI SINI ---
  title: {
    fontSize: 20, // Diperkecil dari 22
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 2, // Diperkecil dari 4
  },
  subtitle: {
    fontSize: 11, // Diperkecil dari 12
    color: '#BDC3C7',
    fontWeight: '500',
  },
  // --- AKHIR PERUBAHAN ---
  headerIconsGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  settingsButton: {
    padding: 8,
  },
  profileButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#3498DB',
  },
  profileImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#ECF0F1'
  },
  
  // Modal Settings
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  settingSection: {
    marginBottom: 20,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 5,
  },
  settingHint: {
    fontSize: 12,
    color: '#7F8C8D',
    marginBottom: 10,
  },
  settingInput: {
    borderWidth: 1,
    borderColor: '#BDC3C7',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    backgroundColor: '#F8F9FA',
    marginBottom: 15,
  },
  ipExamples: {
    backgroundColor: '#ECF0F1',
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
  },
  exampleTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#34495E',
    marginBottom: 5,
  },
  exampleText: {
    fontSize: 11,
    color: '#3498DB',
    marginBottom: 3,
    marginLeft: 5,
  },
  currentUrl: {
    fontSize: 11,
    color: '#27AE60',
    fontWeight: '600',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  resetButton: {
    flex: 1,
    backgroundColor: '#ECF0F1',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  resetButtonText: {
    color: '#7F8C8D',
    fontSize: 14,
    fontWeight: '600',
  },
  modalSaveButton: {
    flex: 1,
    backgroundColor: '#27AE60',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  modalSaveButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },

  // Modal Profil
  profileModalContent: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 25,
    width: '90%',
    maxWidth: 340,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  profileCloseButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 5,
  },
  profileModalAvatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 3,
    borderColor: '#3498DB',
    marginBottom: 15,
    backgroundColor: '#ECF0F1',
  },
  profileModalName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 5,
  },
  profileModalEmail: {
    fontSize: 15,
    color: '#7F8C8D',
    marginBottom: 25,
  },
  profileModalLogoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FADBD8',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  profileModalLogoutButtonText: {
    color: '#E74C3C',
    fontSize: 16,
    fontWeight: '600',
  },

  // Modal Konfirmasi Logout
  confirmModalContent: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 25,
    width: '90%',
    maxWidth: 340,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  confirmModalText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 25,
    textAlign: 'center',
  },
  confirmModalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: 15,
  },
  cancelConfirmButton: {
    flex: 1,
    backgroundColor: '#ECF0F1',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelConfirmButtonText: {
    color: '#7F8C8D',
    fontSize: 16,
    fontWeight: '600',
  },
  confirmButton: {
    flex: 1,
    backgroundColor: '#E74C3C',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },

  
  // Sisa Style
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    elevation: 2,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
    flexDirection: 'column',
    gap: 4,
  },
  activeTab: {
    borderBottomColor: '#3498DB',
  },
  tabText: {
    fontSize: 12,
    color: '#7F8C8D',
    fontWeight: '500',
    marginTop: 2,
  },
  activeTabText: {
    color: '#3498DB',
    fontWeight: '700',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  scannerContainer: {
    flex: 1,
    position: 'relative',
  },
  scanOverlay: {
    flex: 1,
  },
  overlayTop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  scannerMiddle: {
    flexDirection: 'row',
    height: 200,
  },
  overlayLeft: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  scanFrame: {
    width: width * 0.8,
    height: 200,
    position: 'relative',
    backgroundColor: 'transparent',
  },
  overlayRight: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  overlayBottom: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'flex-start',
    paddingTop: 30,
    alignItems: 'center',
  },
  corner: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderColor: '#27AE60',
  },
  topLeft: {
    top: 0,
    left: 0,
    borderTopWidth: 4,
    borderLeftWidth: 4,
  },
  topRight: {
    top: 0,
    right: 0,
    borderTopWidth: 4,
    borderRightWidth: 4,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 4,
    borderRightWidth: 4,
  },
  scanLineContainer: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    height: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanLine: {
    width: '100%',
    height: 3,
    backgroundColor: '#27AE60',
    shadowColor: '#27AE60',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 5,
  },
  scanText: {
    fontSize: 16,
    color: 'white',
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
  },
  scanSubtext: {
    fontSize: 13,
    color: '#BDC3C7',
    textAlign: 'center',
  },
  cancelButtonContainer: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#E74C3C',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  cancelButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F7FA',
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    color: '#7F8C8D',
    fontWeight: '500',
  },
  dataContainer: {
    flex: 1,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderLeftWidth: 4,
    borderLeftColor: '#3498DB',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ECF0F1',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  editButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editButton: {
    fontSize: 15,
    color: '#3498DB',
    fontWeight: '600',
  },
  editButtons: {
    flexDirection: 'row',
    gap: 15,
    alignItems: 'center',
  },
  saveButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  saveButton: {
    fontSize: 15,
    color: '#27AE60',
    fontWeight: '600',
  },
  dataRow: {
    marginBottom: 14,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F7FA',
  },
  dataLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#7F8C8D',
    textTransform: 'uppercase',
    marginBottom: 5,
    letterSpacing: 0.5,
  },
  dataValue: {
    fontSize: 16,
    color: '#2C3E50',
    fontWeight: '500',
  },
  inputRow: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#7F8C8D',
    textTransform: 'uppercase',
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#BDC3C7',
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    backgroundColor: '#F8F9FA',
    color: '#2C3E50',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2C3E50',
    marginBottom: 8,
    marginTop: 15,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#95A5A6',
  },
  buttonContainer: {
    marginTop: 20,
  },
  scanButton: {
    backgroundColor: '#3498DB',
    paddingVertical: 16,
    paddingHorizontal: 30,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#3498DB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  scanButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  errorText: {
    fontSize: 18,
    color: '#E74C3C',
    fontWeight: '700',
    marginBottom: 12,
  },
  helpText: {
    fontSize: 14,
    color: '#7F8C8D',
    textAlign: 'center',
    marginBottom: 25,
    lineHeight: 20,
  },
  listContainer: {
    flex: 1,
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    paddingHorizontal: 5,
  },
  listTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  refreshButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  refreshButton: {
    fontSize: 14,
    color: '#3498DB',
    fontWeight: '600',
  },
  itemCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    borderLeftWidth: 4,
    borderLeftColor: '#27AE60',
  },
  itemHeader: {
    marginBottom: 10,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 6,
  },
  barcodeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemBarcode: {
    fontSize: 13,
    color: '#7F8C8D',
    fontWeight: '500',
  },
  itemDetails: {
    marginTop: 8,
    gap: 6,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemDetailText: {
    fontSize: 13,
    color: '#34495E',
    lineHeight: 18,
  },
  selectButton: {
    marginTop: 12,
    backgroundColor: '#3498DB',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  selectButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  searchContainer: {
    marginBottom: 15,
  },
  searchInput: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#BDC3C7',
    borderRadius: 10,
    padding: 15,
    fontSize: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    color: '#2C3E50',
  },
});