import React, { useRef, useState, useEffect } from "react";
import { View, TouchableOpacity, ActivityIndicator, Text, StyleSheet } from "react-native";
import QRCodeScanner from "react-native-qrcode-scanner";
import Icon from "react-native-vector-icons/Ionicons";
import Toast from "react-native-toast-message";
import axios from "axios";
import { check, request, PERMISSIONS, RESULTS } from "react-native-permissions";
import { API_BASE_URL, VERSION_NUMBER } from "../utils/apiConfig";
import { lightColors } from "../utils/colors";
import { TextInput, Keyboard } from "react-native";

const QRscanner = () => {
  const scannerRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [scannerName, setScannerName] = useState("");
  const [isLocked, setIsLocked] = useState(false);

  useEffect(() => {
    (async () => {
      const res = await check(PERMISSIONS.IOS.CAMERA);
      if (res !== RESULTS.GRANTED) await request(PERMISSIONS.IOS.CAMERA);
    })();
  }, []);

  const verifyData = async data => {
    setLoading(true);
    try {
      const endpoint = `${API_BASE_URL}/ReadXclusiveQR`;
      const parameter = {
        code_generated: data,
        scanned_by: scannerName,
        version_number: VERSION_NUMBER,
      };
      const res = await axios.post(endpoint, parameter);

      if (res?.data?.freebies) {
        Toast.show({
          type: "success",
          text1: res.data.freebies,
          text2: res.data.date_claimed || "Just now",
        });
      } else if (typeof res.data === "object") {
        Toast.show({
          type: "success",
          text1: res.data.text,
          text2: res.data.date || "Just now",
        });
      } else {
        Toast.show({ type: "error", text1: "Invalid QR Code" });
      }
    } catch {
      Toast.show({ type: "error", text1: "Something went wrong" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Floating Emojis */}
      <Text style={styles.floatLeft}>🏀</Text>
      <Text style={styles.floatRight}>⚡</Text>

      {/* <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
        <Icon name="arrow-back" size={22} color="#111" />
      </TouchableOpacity> */}

      <Text style={styles.title}>Scan QR</Text>
      <Text style={styles.subtitle}>Point your camera at the code</Text>

      <View style={styles.inputWrapper}>
        <TextInput
          placeholder="Enter scanner name..."
          value={scannerName}
          editable={!isLocked}
          onChangeText={setScannerName}
          onSubmitEditing={() => {
            if (!scannerName.trim()) return;
            setIsLocked(true);
            Keyboard.dismiss();
          }}
          returnKeyType="done"
          style={[styles.input, isLocked && styles.inputLocked]}
        />

        {isLocked && <Text style={styles.lockedText}>🔒 Scanner Locked</Text>}
      </View>

      <View style={{ flex: 1, top: 100 }}>
        <View style={styles.card}>
          <QRCodeScanner
            ref={scannerRef}
            onRead={e => {
              if (!isLocked) {
                Toast.show({
                  type: "error",
                  text1: "Enter scanner name first",
                });
                return;
              }
              verifyData(e.data);
            }}
            reactivateTimeout={2000}
            cameraStyle={styles.camera}
            showMarker
            customMarker={<View style={styles.marker} />}
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={() => scannerRef.current?.reactivate()} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Scan Again 🚀</Text>}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
    alignItems: "center",
    paddingTop: 70,
  },

  backBtn: {
    position: "absolute",
    top: 55,
    left: 20,
  },

  title: {
    fontSize: 26,
    fontWeight: "800",
    color: "#111",
  },

  subtitle: {
    marginTop: 6,
    marginBottom: 30,
    color: "#888",
  },

  card: {
    width: 320,
    height: 320,
    borderRadius: 24,
    backgroundColor: "#fff",
    shadowColor: "#531A89",
    shadowOpacity: 0.2,
    shadowRadius: 25,
    shadowOffset: { width: 0, height: 12 },
    elevation: 8,
    justifyContent: "center",
    alignItems: "center",
  },

  camera: {
    width: 280,
    height: 280,
    left: 55,
    borderRadius: 18,
  },

  marker: {
    width: 250,
    height: 250,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: lightColors.BrandColor,
  },

  button: {
    marginTop: 40,
    backgroundColor: lightColors.BrandColor,
    paddingVertical: 14,
    paddingHorizontal: 70,
    borderRadius: 40,
    shadowColor: lightColors.BrandColor,
    shadowOpacity: 0.3,
    shadowRadius: 15,
  },

  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },

  floatLeft: {
    position: "absolute",
    left: 25,
    top: 240,
    fontSize: 26,
    opacity: 0.25,
  },

  floatRight: {
    position: "absolute",
    right: 30,
    top: 220,
    fontSize: 26,
    opacity: 0.25,
  },
  inputWrapper: {
  width: '85%',
  marginBottom: 20,
},

input: {
  borderWidth: 1,
  borderColor: '#ddd',
  borderRadius: 12,
  paddingVertical: 12,
  paddingHorizontal: 16,
  fontSize: 16,
  backgroundColor: '#fff',
},

inputLocked: {
  backgroundColor: '#f1f1f1',
  color: '#666',
},

lockedText: {
  marginTop: 6,
  fontSize: 12,
  color: '#4CAF50',
  fontWeight: '600',
},

});

export default QRscanner;
