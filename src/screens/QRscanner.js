import React, {useState, useEffect, useRef} from 'react';
import {View, Text, TouchableOpacity, ActivityIndicator} from 'react-native';
import {Button} from '@rneui/themed';
import styles from '../styles/Style';
import QRCodeScanner from 'react-native-qrcode-scanner';
import * as functions from '../utils/functions';
import Toast from 'react-native-toast-message';
import axios from 'axios';
import {API_BASE_URL} from '../utils/apiConfig';
import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import Icon from 'react-native-vector-icons/Ionicons'; // Import Ionicons

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
      const inputData = {
        token: userData.token,
        attendee_code: qrData.attendee_code || '',
        first_name: qrData.first_name || '',
        last_name: qrData.last_name || '',
        nickname: qrData.nickname || '',
        gender: qrData.gender || '',
        attendee_type: qrData.attendee_type || '',
        email: qrData.email || '',
      };

      const response = await axios.post(endpoint, inputData);
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
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity
        style={{position: 'absolute', top: 20, left: 20, zIndex: 10}}
        onPress={() => navigation.goBack()}>
        <Icon name="arrow-back" size={30} color="#000" />
      </TouchableOpacity>

      <QRCodeScanner
        ref={scannerRef}
        onRead={e => verifyData(e.data)}
        topContent={<></>}
        bottomContent={
          <Button
            disabled={loading}
            title={
              loading ? <ActivityIndicator size="small" color="#FFF" /> : 'Scan'
            }
            titleStyle={{...styles.titleButtonHome, fontSize: 20}}
            buttonStyle={{...styles.buttonHome, height: 50}}
            containerStyle={{
              ...styles.buttonHomeContainer,
              marginTop: 20,
              marginBottom: 10,
            }}
            onPress={() => scannerRef.current?.reactivate()}
          />
        }
      />
    </View>
  );
};

export default QRscanner;
