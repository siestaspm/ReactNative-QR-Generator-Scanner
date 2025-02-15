import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Button, Dialog } from '@rneui/themed';
import styles from '../styles/Style';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { RNCamera } from 'react-native-camera';
import { API_BASE_URL } from '../utils/apiConfig';
import * as functions from '../utils/functions';
import axios from 'axios';
import Toast from 'react-native-toast-message';

const QRData = ({ navigation }) => {
  const [qrValue, setQrValue] = useState({});
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setQrValue(JSON.parse(functions.QR_DATA.getString('QR_DATA')));
  }, []);

  const handleVerify = async () => {
    setLoading(true);
    try {
      const userData = JSON.parse(functions.USER_DATA.getString('USER_DATA'));
      const endpoint = `${API_BASE_URL}/VerifyAttendee`;
      let parameter = qrValue
      delete parameter.type
      parameter.token = userData.token
      console.log("endpoint", endpoint);
      console.log("inputData", JSON.stringify(parameter, null, 2));

      const response = await axios.post(endpoint, parameter);
      if (response.data === 'Unable to find attendee') {
        Toast.show({
          type: 'error',
          text1: 'Unable to find attendee!',
        });
        setTimeout(() => {
          navigation.navigate('QR Scanner');
        }, 1000);
      } else if (response.data === 'Attendee is already present') {
        Toast.show({
          type: 'error',
          text1: 'Attendee is already present!',
        });
        setTimeout(() => {
          navigation.navigate('QR Scanner');
        }, 1000);
      } else if (response.data === 'Success') {
        Toast.show({
          type: 'success',
          text1: 'Successfully Validate the QR code',
        });
        setTimeout(() => {
          navigation.navigate('QR Scanner');
        }, 1000);
      } else {
        Toast.show({
          type: 'error',
          text1: `${response.data}`,
        });
        setTimeout(() => {
          navigation.navigate('QR Scanner');
        }, 1000);
      }
    } catch (er) {
      console.error(er);
    } finally {
      setLoading(false);
    }
  };
  return (
    <View style={styles.container}>
      <Text style={styles.input}>{qrValue.attendee_code}</Text>
      <Text style={styles.input}>{qrValue.attendee_type}</Text>
      <Text style={styles.input}>{qrValue.email}</Text>
      <Text style={styles.input}>{qrValue.first_name}</Text>
      <Text style={styles.input}>{qrValue.gender}</Text>
      <Text style={styles.input}>{qrValue.last_name}</Text>
      {qrValue.mobile_no && (
        <Text style={styles.input}>{qrValue.mobile_no}</Text>
      )}

      <Text style={styles.input}>{qrValue.nickname}</Text>
      <Text style={styles.input}>{qrValue.registered_date}</Text>
      <Text style={styles.input}>{qrValue.type}</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={handleVerify}
        disabled={loading}>
        {loading ? (
          <ActivityIndicator size="small" color="#FFF" />
        ) : (
          <Text style={styles.buttonText}>Verify Attendee</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default QRData;
