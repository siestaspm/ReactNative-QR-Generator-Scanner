import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  TouchableOpacity,
  ActivityIndicator,
  Text,
  StyleSheet,
} from 'react-native';
import {Button} from '@rneui/themed';
import QRCodeScanner from 'react-native-qrcode-scanner';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import * as functions from '../utils/functions';
import {API_BASE_URL} from '../utils/apiConfig';
import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';

const QRscanner = ({navigation}) => {
  const [loading, setLoading] = useState(false);
  const scannerRef = useRef(null);

  const requestCameraPermission = async () => {
    const result = await check(PERMISSIONS.IOS.CAMERA);
    if (result !== RESULTS.GRANTED) {
      await request(PERMISSIONS.IOS.CAMERA);
    }
  };

  useEffect(() => {
    requestCameraPermission();
  }, []);

  const verifyData = async data => {
    setLoading(true);
    try {
      const qrData = JSON.parse(data);
      if (!qrData.attendee_code) {
        Toast.show({type: 'error', text1: 'Invalid QR Code'});
        return;
      }

      const userData = JSON.parse(functions.USER_DATA.getString('USER_DATA'));
      const endpoint = `${API_BASE_URL}/VerifyAttendee`;
      let parameter = qrData;
      delete parameter.type;
      parameter.token = userData.token;

      const response = await axios.post(endpoint, parameter);
      if (response.data === 'Unable to find attendee') {
        Toast.show({type: 'error', text1: 'Unable to find attendee!'});
      } else if (response.data === 'Attendee is already present') {
        Toast.show({type: 'error', text1: 'Attendee is already present!'});
      } else if (response.data === 'Success') {
        Toast.show({
          type: 'success',
          text1: 'Successfully Validated QR Code',
          text2: `${qrData.first_name} has been validated`,
        });
      } else {
        Toast.show({type: 'error', text1: response.data});
      }
    } catch (error) {
      Toast.show({type: 'error', text1: 'Invalid QR Code'});
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={['#AC895B', '#531A89']} style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}>
        <Icon name="arrow-back" size={28} color="#FFF" />
      </TouchableOpacity>

      {/* Centered QR Scanner */}
      <View style={styles.centerContainer}>
        <Text style={styles.headerText}>Scan Attendee QR Code</Text>

        <QRCodeScanner
          ref={scannerRef}
          onRead={e => verifyData(e.data)}
          reactivateTimeout={2000}
          showMarker
          cameraStyle={styles.cameraContainer}
          customMarker={
            <View style={styles.markerContainer}>
              <View style={styles.markerBorder} />
            </View>
          }
          // topViewStyle={{flex: 0}}
          // bottomViewStyle={{flex: 0}}
        />

        {/* Scan Again Button */}
        <Button
          disabled={loading}
          title={
            loading ? (
              <ActivityIndicator size="small" color="#FFF" />
            ) : (
              'Scan Again'
            )
          }
          titleStyle={styles.buttonTitle}
          buttonStyle={styles.buttonStyle}
          onPress={() => scannerRef.current?.reactivate()}
        />
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1},
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 8,
    borderRadius: 12,
  },
  centerContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  headerText: {
    fontSize: 20,
    color: '#FFF',
    fontWeight: '600',
    marginTop: 150,
    textAlign: 'center',
  },
  cameraContainer: {
    width: 300,
    height: 300,
    borderRadius: 20,
    left: 25,
    overflow: 'hidden',
  },
  markerContainer: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: '#FFF',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  markerBorder: {
    flex: 1,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#FFF',
    width: '100%',
    height: '100%',
  },
  buttonContainer: {
    width: 200,
    marginTop: 30, // keeps button above bottom
  },
  buttonStyle: {
    backgroundColor: '#fff',
    borderRadius: 25,
    height: 50,
    marginBottom: 70,
  },
  buttonTitle: {
    color: '#531A89',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default QRscanner;
