import React, { useRef, useState, useEffect, useMemo } from "react";
import {
  View,
  TouchableOpacity,
  ActivityIndicator,
  Text,
  StyleSheet,
  TextInput,
  Keyboard,
  Dimensions,
  Animated,
  Platform,
  StatusBar,
} from "react-native";
import QRCodeScanner from "react-native-qrcode-scanner";
import Toast from "react-native-toast-message";
import axios from "axios";
import { check, request, PERMISSIONS, RESULTS } from "react-native-permissions";
import { API_BASE_URL, VERSION_NUMBER } from "../utils/apiConfig";
import { lightColors } from "../utils/colors";
import * as functions from "../utils/functions";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const isSmallDevice = SCREEN_WIDTH < 375;
const isTablet = SCREEN_WIDTH > 768;

const QRscanner = () => {
  const scannerRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [scannerName, setScannerName] = useState("");
  const [isLocked, setIsLocked] = useState(false);
  const [qrData, setQrData] = useState('');
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const bounceAnim = useRef(new Animated.Value(1)).current;

  const canScan = isLocked && scannerName.trim().length > 0;

  useEffect(() => {
    (async () => {
      const cameraPermission = Platform.select({
        ios: PERMISSIONS.IOS.CAMERA,
        android: PERMISSIONS.ANDROID.CAMERA,
      });
      const res = await check(cameraPermission);
      if (res !== RESULTS.GRANTED) await request(cameraPermission);
    })();
  }, []);

  useEffect(() => {
    const savedName = functions.storage.getString("scanner_name");
    if (savedName) {
      setScannerName(savedName);
      setIsLocked(true);
    }
  }, []);

  // Add pulsing animation for scanner
  useEffect(() => {
    if (canScan) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(bounceAnim, {
            toValue: 1.05,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(bounceAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [canScan, bounceAnim]);

  const verifyData = async (data, confirmed) => {
    
  if (!canScan || loading) return;
      if (!data || data.trim() === "") {
      Toast.show({
        type: "error",
        text1: "No QR scanned",
        text2: "Scan a QR code first",
      });
      return;
    }
    setQrData(data);
    setLoading(true);

    

    
    // Button press animation
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    try {
      const inputData = {
        code_generated: data,
        scanned_by: scannerName,
        confirmed: confirmed,
        version_number: VERSION_NUMBER,
      }
      const res = await axios.post(`${API_BASE_URL}/ReadXclusiveQR`, inputData);

      console.log(JSON.stringify(inputData, null, 2))
      console.log(JSON.stringify(res.data,null,2))
      if (res?.data?.freebies) {
        Toast.show({
          type: "success",
          text1: res.data.freebies,
          text2: res.data.date_claimed || "Just now",
        });
      } else if (typeof res.data === "object" && confirmed === false) {
        Toast.show({
          type: "success",
          text1: res.data.text,
          text2: res.data.date || "Just now",
        });
      } else if (typeof res.data === "object" && confirmed === true) { 
        setQrData('');
        scannerRef.current?.reactivate();
        Toast.show({
          type: "success",
          text1: res.data.text,
          text2: res.data.date || "Just now",
        });
      }else {
        Toast.show({ 
          type: "error", 
          text1: "🚫 Foul!",
          text2: "Invalid QR Code"
        });
      }
    } catch {
      Toast.show({ 
        type: "error", 
        text1: "⛔ Technical Foul!",
        text2: "Something went wrong" 
      });
    } finally {
      setLoading(false);
    }
  };

  const fontSize = useMemo(() => ({
    title: isSmallDevice ? 22 : isTablet ? 32 : 26,
    subtitle: isSmallDevice ? 14 : isTablet ? 20 : 16,
    button: isSmallDevice ? 14 : isTablet ? 20 : 16,
    input: isSmallDevice ? 14 : isTablet ? 18 : 16,
  }), [isSmallDevice, isTablet]);

  const containerPadding = useMemo(() => 
    isSmallDevice ? 50 : isTablet ? 100 : 70
  , [isSmallDevice, isTablet]);

  const scannerSize = useMemo(() => 
    isSmallDevice ? 280 : isTablet ? 400 : 320
  , [isSmallDevice, isTablet]);

  const markerSize = useMemo(() => 
    isSmallDevice ? 230 : isTablet ? 350 : 250
  , [isSmallDevice, isTablet]);

  const cameraSize = useMemo(() => 
    isSmallDevice ? 240 : isTablet ? 360 : 280
  , [isSmallDevice, isTablet]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      {/* NBA x Pokémon Themed Background Elements */}
      <Text style={[styles.floatLeft, { fontSize: isSmallDevice ? 22 : isTablet ? 36 : 26 }]}>
        🏀
      </Text>
      <Text style={[styles.floatRight, { fontSize: isSmallDevice ? 22 : isTablet ? 36 : 26 }]}>
        ⚡
      </Text>
      
      {/* Pokémon-style Floating Elements */}
      <Animated.Text 
        style={[
          styles.pokeball, 
          { 
            left: SCREEN_WIDTH * 0.1,
            fontSize: isSmallDevice ? 24 : isTablet ? 40 : 30,
          }
        ]}
      >
        ⚾
      </Animated.Text>
      
      <Animated.Text 
        style={[
          styles.nbaBall,
          { 
            right: SCREEN_WIDTH * 0.1,
            fontSize: isSmallDevice ? 20 : isTablet ? 36 : 28,
          }
        ]}
      >
        🏐
      </Animated.Text>

      {/* Header */}
      <View style={[styles.header, { paddingTop: containerPadding }]}>
        <Text style={[styles.title, { fontSize: fontSize.title }]}>
           XURE QR Scanner 
        </Text>
        <Text style={[styles.subtitle, { fontSize: fontSize.subtitle }]}>
          Point your QR at the camera!
        </Text>
      </View>

      {/* Trainer/Scanner Name Input */}
      <View style={[styles.inputWrapper, { width: SCREEN_WIDTH * 0.85 }]}>
        <TextInput
          placeholder="Enter your scanner name..."
          placeholderTextColor="#888"
          value={scannerName}
          editable={!isLocked}
          onChangeText={setScannerName}
          onSubmitEditing={() => {
            if (!scannerName.trim()) return;
            setIsLocked(true);
            functions.storage.set("scanner_name", scannerName);
            Keyboard.dismiss();
          }}
          style={[
            styles.input, 
            isLocked && styles.inputLocked,
            { fontSize: fontSize.input }
          ]}
        />

      </View>

      {/* Scanner Area */}
      <View style={[styles.scannerContainer, { top: isSmallDevice ? 40 : isTablet ? 10 : 80 }]}>
        <Animated.View 
          style={[
            styles.card, 
            { 
              width: scannerSize, 
              height: scannerSize,
            }
          ]}
        >
          {canScan ? (
          <QRCodeScanner
            ref={scannerRef}
            onRead={
              canScan && !loading
                ? e => verifyData(e.data, false)
                : undefined
            }
            cameraStyle={[styles.camera, { width: cameraSize, height: cameraSize, left: SCREEN_WIDTH * 0.14, top: SCREEN_HEIGHT * 0.02 }]}
            showMarker={canScan}
            customMarker={canScan ? (
              <Animated.View style={[styles.marker, { width: markerSize, height: markerSize }]}>
              </Animated.View>
            ) : null}
          />
          ) : (
            <View style={[styles.overlay, { width: cameraSize, height: cameraSize }]}>
              <Text style={styles.overlayText}>
                 Enter name to start scanning
              </Text>
            </View>
          )}
        </Animated.View>

        {canScan && qrData && (
          <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
          <TouchableOpacity
            style={[
              styles.button,
              { 
                marginTop: isSmallDevice ? 30 : isTablet ? 60 : 40,
                paddingHorizontal: isSmallDevice ? 50 : isTablet ? 80 : 70
              }
            ]}
            disabled={loading || !canScan}
            onPress={() => verifyData(qrData, true)}
            // onPress={() => functions.storage.delete('scanner_name')}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={[styles.buttonText, { fontSize: fontSize.button }]}>
                Mark as used
              </Text>
            )}
          </TouchableOpacity>
        </Animated.View>
          )}

        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
          <TouchableOpacity
            style={[
              styles.button,
              { 
                marginTop: isSmallDevice ? 20 : isTablet ? 50 : 30,
                paddingHorizontal: isSmallDevice ? 50 : isTablet ? 80 : 70
              }
            ]}
            disabled={loading || !canScan}
            onPress={() => scannerRef.current?.reactivate()}
            // onPress={() => functions.storage.delete('scanner_name')}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={[styles.buttonText, { fontSize: fontSize.button }]}>
                {canScan ? "Scan Again 🚀" : "Enter Name First 🔒"}
              </Text>
            )}
          </TouchableOpacity>
        </Animated.View>
      </View>

      {/* NBA Scoreboard-style Footer */}
      {/* <View style={styles.footer}>
        <Text style={styles.footerText}>
          🏀 XURE x PICCC • Version 1.0.0 ⚡
        </Text>
      </View> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff", // Pokémon yellow
    alignItems: "center",
  },
  header: {
    alignItems: "center",
    width: "100%",
  },
  title: {
    fontWeight: "900",
    color: "#003A70", // NBA blue
    textShadowColor: "#FF0000", // Pokémon red
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 1,
  },
  subtitle: {
    marginTop: 6,
    marginBottom: 30,
    color: "#003A70",
    fontWeight: "600",
    textAlign: "center",
  },
  scannerContainer: {
    alignItems: "center",
    flex: 1,
  },
  card: {
    borderRadius: 24,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    elevation: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    borderWidth: 3,
    borderColor: "#003A70",
  },
  camera: {
    borderRadius: 18,
    overflow: "hidden", 
  },
  marker: {
    borderRadius: 18,
    borderWidth: 4,
    borderColor: "#FF0000",
    justifyContent: "center",
    alignItems: "center",
  },
  cornerTL: {
    position: "absolute",
    top: 0,
    left: 0,
    width: 30,
    height: 30,
    borderLeftWidth: 5,
    borderTopWidth: 5,
    borderColor: "#FFDE00",
  },
  cornerTR: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 30,
    height: 30,
    borderRightWidth: 5,
    borderTopWidth: 5,
    borderColor: "#FFDE00",
  },
  cornerBL: {
    position: "absolute",
    bottom: 0,
    left: 0,
    width: 30,
    height: 30,
    borderLeftWidth: 5,
    borderBottomWidth: 5,
    borderColor: "#FFDE00",
  },
  cornerBR: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 30,
    height: 30,
    borderRightWidth: 5,
    borderBottomWidth: 5,
    borderColor: "#FFDE00",
  },
  scanningText: {
    color: "#FFDE00",
    fontSize: 16,
    fontWeight: "800",
    backgroundColor: "rgba(0, 58, 112, 0.8)",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    marginTop: 10,
  },
  overlay: {
    position: "absolute",
    backgroundColor: "rgba(0, 58, 112, 0.85)", // NBA blue overlay
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  overlayText: {
    color: "#FFDE00",
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
    paddingHorizontal: 20,
  },
  inputWrapper: {
    marginBottom: 20,
  },
  input: {
    borderWidth: 3,
    borderColor: "#003A70",
    borderRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 20,
    fontSize: 16,
    backgroundColor: "white",
    color: "#003A70",
    fontWeight: "600",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  inputLocked: {
    backgroundColor: "#f0f8ff",
    color: "#003A70",
  },
  lockedContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
    paddingHorizontal: 5,
  },
  lockedText: {
    fontSize: 14,
    color: "#4CAF50",
    fontWeight: "700",
  },
  unlockButton: {
    backgroundColor: "#FF0000",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  unlockText: {
    color: "white",
    fontSize: 12,
    fontWeight: "700",
  },
  button: {
    backgroundColor: "#003A70", // NBA blue
    paddingVertical: 16,
    borderRadius: 40,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  buttonText: {
    color: "#FFDE00", // Pokémon yellow
    fontWeight: "800",
    textAlign: "center",
  },
  floatLeft: {
    position: "absolute",
    left: 20,
    top: 100,
    opacity: 0.3,
  },
  floatRight: {
    position: "absolute",
    right: 20,
    top: 80,
    opacity: 0.3,
  },
  pokeball: {
    position: "absolute",
    top: 180,
    opacity: 0.2,
    transform: [{ rotate: "15deg" }],
  },
  nbaBall: {
    position: "absolute",
    top: 150,
    opacity: 0.2,
    transform: [{ rotate: "-15deg" }],
  },
  footer: {
    position: "absolute",
    bottom: Platform.OS === 'ios' ? 30 : 20,
    width: "100%",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  footerText: {
    fontSize: 12,
    color: "#003A70",
    fontWeight: "600",
    textAlign: "center",
    opacity: 0.8,
  },
});

export default QRscanner;