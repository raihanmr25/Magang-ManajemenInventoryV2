import React, { useState } from 'react';
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
  FlatList
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { StatusBar } from 'expo-status-bar';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { API_URL } from './config';

export default function App() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [loading, setLoading] = useState(false);
  const [itemData, setItemData] = useState(null);
  const [activeTab, setActiveTab] = useState('scan'); // 'scan', 'list', 'search'
  const [allItems, setAllItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({});

  const isPermissionGranted = permission?.granted;

  // Fetch item by barcode
  const fetchItemByBarcode = async (barcode) => {
    setLoading(true);
    try {
      const url = `${API_URL}/inventory/barcode/${barcode}`;
      console.log('� Fetching from:', url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });
      
      const textResponse = await response.text();
      console.log('� Raw response:', textResponse.substring(0, 200));
      
      if (textResponse.trim().startsWith('<')) {
        Alert.alert(
          'API Error',
          'Server returned HTML instead of JSON. Check if Laravel is running properly.'
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
      Alert.alert('Error', error.message || 'Gagal mengambil data barang');
      setItemData(null);
      console.error('❌ Fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Update item by barcode
  const updateItemByBarcode = async () => {
    if (!itemData) return;
    
    setLoading(true);
    try {
      const url = `${API_URL}/inventory/barcode/${itemData.barcode}`;
      console.log('� Updating:', url);
      
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

  // Fetch all items
  const fetchAllItems = async () => {
    setLoading(true);
    try {
      const url = `${API_URL}/inventory`;
      console.log('� Fetching all items from:', url);
      
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
        // Handle pagination
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

  // Search items
  const searchItems = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setLoading(true);
    try {
      const url = `${API_URL}/inventory/search?q=${encodeURIComponent(query)}`;
      console.log('� Searching:', url);
      
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

  // Render item card
  const renderItemCard = (item, showSelectButton = false) => (
    <View key={item.id} style={styles.itemCard}>
      <View style={styles.itemHeader}>
        <Text style={styles.itemName}>{item.nama || 'N/A'}</Text>
        <View style={styles.barcodeRow}>
          <MaterialCommunityIcons name="barcode-scan" size={16} color="#666" />
          <Text style={styles.itemBarcode}> {item.barcode || 'N/A'}</Text>
        </View>
      </View>
      
      <View style={styles.itemDetails}>
        <View style={styles.detailRow}>
          <MaterialCommunityIcons name="package-variant" size={14} color="#666" />
          <Text style={styles.itemDetailText}> {item.kode_barang || 'N/A'}</Text>
        </View>
        <View style={styles.detailRow}>
          <Ionicons name="location" size={14} color="#666" />
          <Text style={styles.itemDetailText}> {item.lokasi || 'N/A'}</Text>
        </View>
        <View style={styles.detailRow}>
          <Ionicons name="person" size={14} color="#666" />
          <Text style={styles.itemDetailText}> {item.pemakai || 'N/A'}</Text>
        </View>
      </View>

      {showSelectButton && (
        <TouchableOpacity 
          style={styles.selectButton}
          onPress={() => selectItemFromList(item)}
        >
          <Text style={styles.selectButtonText}>Lihat Detail</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  // Permission checks
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
          <View style={styles.headerWithIcon}>
            <MaterialCommunityIcons name="package-variant" size={28} color="white" />
            <Text style={styles.title}>Inventory Scanner</Text>
          </View>
        </View>
        <View style={styles.content}>
          <MaterialCommunityIcons name="camera-off" size={60} color="#FF3B30" />
          <Text style={styles.errorText}>Tidak ada akses kamera</Text>
          <Text style={styles.helpText}>Izinkan akses kamera untuk scan barcode</Text>
          <TouchableOpacity style={styles.scanButton} onPress={requestPermission}>
            <Ionicons name="checkmark-circle" size={20} color="white" />
            <Text style={styles.scanButtonText}> Berikan Izin</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      
      <View style={styles.header}>
        <View style={styles.headerWithIcon}>
          <MaterialCommunityIcons name="package-variant" size={28} color="white" />
          <Text style={styles.title}> Inventory Scanner</Text>
        </View>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'scan' && styles.activeTab]}
          onPress={() => setActiveTab('scan')}
        >
          <MaterialCommunityIcons 
            name="barcode-scan" 
            size={20} 
            color={activeTab === 'scan' ? '#007AFF' : '#666'} 
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
          <Ionicons 
            name="list" 
            size={20} 
            color={activeTab === 'list' ? '#007AFF' : '#666'} 
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
            color={activeTab === 'search' ? '#007AFF' : '#666'} 
          />
          <Text style={[styles.tabText, activeTab === 'search' && styles.activeTabText]}>
            Search
          </Text>
        </TouchableOpacity>
      </View>

      {/* Scanner Tab */}
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
                <View style={styles.scanFrame} />
                <Text style={styles.scanText}>Scan barcode barang</Text>
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
                        <TouchableOpacity onPress={() => setEditMode(true)}>
                          <View style={styles.editButtonContainer}>
                            <MaterialCommunityIcons name="pencil" size={16} color="#007AFF" />
                            <Text style={styles.editButton}> Edit</Text>
                          </View>
                        </TouchableOpacity>
                      ) : (
                        <View style={styles.editButtons}>
                          <TouchableOpacity onPress={updateItemByBarcode}>
                            <View style={styles.saveButtonContainer}>
                              <MaterialCommunityIcons name="content-save" size={16} color="#34C759" />
                              <Text style={styles.saveButton}> Simpan</Text>
                            </View>
                          </TouchableOpacity>
                          <TouchableOpacity onPress={() => {
                            setEditMode(false);
                            setEditData(itemData);
                          }}>
                            <Ionicons name="close-circle" size={20} color="#FF3B30" />
                          </TouchableOpacity>
                        </View>
                      )}
                    </View>
                    
                    {editMode ? (
                      // Edit Mode - Show Input Fields
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
                      // View Mode - Show Data
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
                  
                  <TouchableOpacity style={styles.scanButton} onPress={startScanning}>
                    <Text style={styles.scanButtonText}>Scan Barang Lain</Text>
                  </TouchableOpacity>
                </ScrollView>
              ) : (
                <View style={styles.emptyState}>
                  <MaterialCommunityIcons name="package-variant-closed" size={80} color="#ccc" />
                  <Text style={styles.emptyText}>Belum ada barang yang di-scan</Text>
                  <Text style={styles.emptySubtext}>Tap tombol di bawah untuk mulai scan</Text>
                </View>
              )}

              {!scanning && !loading && (
                <View style={styles.buttonContainer}>
                  <TouchableOpacity style={styles.scanButton} onPress={startScanning}>
                    <MaterialCommunityIcons name="barcode-scan" size={20} color="white" />
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
                <TouchableOpacity onPress={fetchAllItems}>
                  <View style={styles.refreshButtonContainer}>
                    <Ionicons name="refresh" size={16} color="#007AFF" />
                    <Text style={styles.refreshButton}> Refresh</Text>
                  </View>
                </TouchableOpacity>
              </View>
              
              {allItems.length > 0 ? (
                allItems.map(item => renderItemCard(item, true))
              ) : (
                <View style={styles.emptyState}>
                  <MaterialCommunityIcons name="database-off" size={80} color="#ccc" />
                  <Text style={styles.emptyText}>Tidak ada data</Text>
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
                  <Ionicons name="search-outline" size={80} color="#ccc" />
                  <Text style={styles.emptyText}>Tidak ada hasil</Text>
                  <Text style={styles.emptySubtext}>Coba kata kunci lain</Text>
                </View>
              ) : (
                <View style={styles.emptyState}>
                  <Ionicons name="search" size={80} color="#ccc" />
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#007AFF',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  headerWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  tab: {
    flex: 1,
    paddingVertical: 15,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 5,
  },
  activeTab: {
    borderBottomColor: '#007AFF',
  },
  tabText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#007AFF',
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  scannerContainer: {
    flex: 1,
    position: 'relative',
  },
  scanOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanFrame: {
    width: 250,
    height: 250,
    borderWidth: 3,
    borderColor: 'white',
    borderRadius: 10,
    backgroundColor: 'transparent',
  },
  scanText: {
    marginTop: 20,
    fontSize: 18,
    color: 'white',
    fontWeight: '600',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  cancelButtonContainer: {
    position: 'absolute',
    bottom: 50,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: 'rgba(255,59,48,0.9)',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  cancelButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  dataContainer: {
    flex: 1,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  editButton: {
    fontSize: 16,
    color: '#007AFF',
  },
  editButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editButtons: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  saveButton: {
    fontSize: 16,
    color: '#34C759',
    marginRight: 10,
  },
  saveButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cancelEditButton: {
    fontSize: 16,
    color: '#FF3B30',
  },
  dataRow: {
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 8,
  },
  dataLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    textTransform: 'capitalize',
    marginBottom: 4,
  },
  dataValue: {
    fontSize: 16,
    color: '#333',
  },
  inputRow: {
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    textTransform: 'capitalize',
    marginBottom: 5,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyIcon: {
    fontSize: 60,
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginBottom: 10,
    marginTop: 15,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
  },
  buttonContainer: {
    marginTop: 20,
  },
  scanButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  scanButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  errorText: {
    fontSize: 18,
    color: '#FF3B30',
    fontWeight: '600',
    marginBottom: 10,
  },
  helpText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  listContainer: {
    flex: 1,
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  listTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  refreshButton: {
    fontSize: 14,
    color: '#007AFF',
  },
  refreshButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  itemHeader: {
    marginBottom: 8,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  barcodeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemBarcode: {
    fontSize: 14,
    color: '#666',
  },
  itemDetails: {
    marginTop: 5,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 3,
  },
  itemDetailText: {
    fontSize: 13,
    color: '#666',
  },
  selectButton: {
    marginTop: 10,
    backgroundColor: '#007AFF',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    alignItems: 'center',
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
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
});
