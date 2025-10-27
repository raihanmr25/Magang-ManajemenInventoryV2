export default {
  expo: {
    name: "Manajemen Inventori",
    slug: "manajemen-inventori",
    version: "1.0.2",
    orientation: "portrait",
    userInterfaceStyle: "light",
    splash: {
      resizeMode: "contain",
      backgroundColor: "#2C3E50"
    },
    assetBundlePatterns: [
      "**/*"
    ],
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.manajemen.inventori",
      infoPlist: {
        NSCameraUsageDescription: "Aplikasi memerlukan akses kamera untuk memindai barcode inventaris."
      }
    },
    android: {
      adaptiveIcon: {
        backgroundColor: "#2C3E50"
      },
      package: "com.manajemen.inventori",
      versionCode: 3,
      permissions: [
        "CAMERA",
        "INTERNET",
        "ACCESS_NETWORK_STATE",
        "ACCESS_WIFI_STATE"
      ],
      config: {
        usesCleartextTraffic: true
      }
    },
    web: {
      bundler: "metro"
    },
    plugins: [
      [
        "expo-camera",
        {
          cameraPermission: "Izinkan $(PRODUCT_NAME) mengakses kamera untuk memindai barcode inventaris."
        }
      ],
      [
        "expo-build-properties",
        {
          android: {
            usesCleartextTraffic: true,
            networkInspector: true
          }
        }
      ]
    ],
    extra: {
      eas: {
        projectId: "d48c88de-c36e-4661-8ff5-398b25fa9e27"
      }
    }
  }
};
