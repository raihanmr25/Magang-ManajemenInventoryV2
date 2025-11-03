// AuthScreen.js
import React, { useState } from 'react';
import { 
  Text, 
  View, 
  StyleSheet, 
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Image
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

// --- Komponen Internal ---

// 1. Halaman Login (Tidak berubah)
function LoginScreen({ onLoginSuccess, setAuthPage }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    setLoading(true);
    
    setTimeout(() => {
      if (email.toLowerCase().trim() === 'admin@example.com' && password === 'password123') {
        const user = {
          name: 'Admin', 
          email: 'admin@example.com'
        };
        onLoginSuccess(user);
      } else {
        Alert.alert('Login Gagal', 'Email atau password salah.');
      }
      setLoading(false);
    }, 500);
  };

  return (
    <View style={styles.authContainer}>
      
      <Image 
        source={require('./assets/logodisnaker.png')} 
        style={styles.authLogo} 
      />
      <Text style={styles.authAppName}>Manajemen Inventori</Text>

      <Text style={styles.authTitle}>Selamat Datang</Text>
      <Text style={styles.authSubtitle}>Login ke akun admin Anda</Text>

      <TextInput
        style={styles.authInput}
        placeholder="Email (admin@example.com)"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        placeholderTextColor="#7F8C8D"
      />
      <TextInput
        style={styles.authInput}
        placeholder="Password (password123)"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholderTextColor="#7F8C8D"
      />

      <TouchableOpacity 
        style={styles.authButton} 
        onPress={handleLogin} 
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.authButtonText}>Login</Text>
        )}
      </TouchableOpacity>

      <View style={styles.linkContainer}>
        <TouchableOpacity onPress={() => setAuthPage('register')}>
          <Text style={styles.linkText}>Buat Akun</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setAuthPage('forgot')}>
          <Text style={styles.linkText}>Lupa Password?</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// 2. Halaman Registrasi (DIPERBARUI)
function RegisterScreen({ setAuthPage }) {
  const handleRegister = () => {
    Alert.alert(
      'Fitur Nonaktif', 
      'Hanya akun admin yang dapat login ke aplikasi mobile ini.',
      [{ text: 'OK', onPress: () => setAuthPage('login') }]
    );
  };

  return (
    <View style={styles.authContainer}>
      <MaterialCommunityIcons name="account-plus" size={80} color="#2C3E50" style={styles.authIcon} />
      <Text style={styles.authTitle}>Buat Akun</Text>
      <Text style={styles.authSubtitle}>Fitur registrasi dinonaktifkan</Text>

      <TextInput 
        style={styles.authInput} 
        placeholder="Nama Lengkap" 
        placeholderTextColor="#7F8C8D" 
      />
      
      {/* --- PERUBAHAN DI SINI --- */}
      <TextInput 
        style={styles.authInput} 
        placeholder="Jabatan" 
        placeholderTextColor="#7F8C8D" 
      />
      <TextInput 
        style={styles.authInput} 
        placeholder="NIP" 
        placeholderTextColor="#7F8C8D" 
        keyboardType="numeric" // Keyboard angka untuk NIP
      />
      {/* --- AKHIR PERUBAHAN --- */}

      <TextInput 
        style={styles.authInput} 
        placeholder="Email" 
        keyboardType="email-address" 
        placeholderTextColor="#7F8C8D" 
      />
      <TextInput 
        style={styles.authInput} 
        placeholder="Password" 
        secureTextEntry 
        placeholderTextColor="#7F8C8D" 
      />

      <TouchableOpacity style={styles.authButton} onPress={handleRegister}>
        <Text style={styles.authButtonText}>Register</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setAuthPage('login')} style={styles.bottomLink}>
        <Text style={styles.linkText}>Sudah punya akun? Login</Text>
      </TouchableOpacity>
    </View>
  );
}

// 3. Halaman Lupa Password (Tidak berubah)
function ForgotPasswordScreen({ setAuthPage }) {
  const handleForgotPassword = () => {
    Alert.alert(
      'Fitur Nonaktif', 
      'Silakan hubungi administrator sistem Anda.',
      [{ text: 'OK', onPress: () => setAuthPage('login') }]
    );
  };

  return (
    <View style={styles.authContainer}>
      <MaterialCommunityIcons name="lock-question" size={80} color="#2C3E50" style={styles.authIcon} />
      <Text style={styles.authTitle}>Lupa Password</Text>
      <Text style={styles.authSubtitle}>Fitur ini dinonaktifkan</Text>

      <TextInput style={styles.authInput} placeholder="Masukkan Email Anda" keyboardType="email-address" placeholderTextColor="#7F8C8D" />

      <TouchableOpacity style={styles.authButton} onPress={handleForgotPassword}>
        <Text style={styles.authButtonText}>Kirim Link Reset</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setAuthPage('login')} style={styles.bottomLink}>
        <Text style={styles.linkText}>Kembali ke Login</Text>
      </TouchableOpacity>
    </View>
  );
}


// --- Komponen Utama (Tidak Berubah) ---
export default function AuthScreen({ onLoginSuccess }) {
  const [authPage, setAuthPage] = useState('login'); // 'login', 'register', 'forgot'

  let content;
  if (authPage === 'login') {
    content = <LoginScreen onLoginSuccess={onLoginSuccess} setAuthPage={setAuthPage} />;
  } else if (authPage === 'register') {
    content = <RegisterScreen setAuthPage={setAuthPage} />;
  } else {
    content = <ForgotPasswordScreen setAuthPage={setAuthPage} />;
  }

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"} 
      style={styles.container}
    >
      <StatusBar style="dark" />
      {content}
    </KeyboardAvoidingView>
  );
}

// --- Stylesheet (Tidak Berubah) ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA', // Background Light Gray
    justifyContent: 'center',
  },
  authContainer: {
    paddingHorizontal: 30,
    alignItems: 'center',
  },
  authLogo: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  authAppName: {
    fontSize: 24,
    fontWeight: '600',
    color: '#2C3E50', // Navy
    marginBottom: 10,
    textAlign: 'center',
  },
  authIcon: {
    marginBottom: 20,
    opacity: 0.8,
  },
  authTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2C3E50', // Navy
    marginBottom: 10,
  },
  authSubtitle: {
    fontSize: 16,
    color: '#7F8C8D', // Gray
    marginBottom: 30,
  },
  authInput: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#BDC3C7', // Gray border
    borderRadius: 8,
    padding: 15,
    fontSize: 15,
    backgroundColor: '#F8F9FA', // Input background
    color: '#2C3E50',
    marginBottom: 15,
  },
  authButton: {
    width: '100%',
    backgroundColor: '#3498DB', // Accent Blue
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#3498DB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
    marginTop: 10,
  },
  authButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
  },
  linkContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 25,
  },
  linkText: {
    color: '#3498DB', // Accent Blue
    fontSize: 14,
    fontWeight: '600',
  },
  bottomLink: {
    marginTop: 25,
  }
});