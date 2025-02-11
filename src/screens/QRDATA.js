import React, {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {Button, Dialog} from '@rneui/themed';
import styles from '../styles/Style';
import QRCodeScanner from 'react-native-qrcode-scanner';
import {RNCamera} from 'react-native-camera';
import {API_BASE_URL} from '../utils/apiConfig';
import * as functions from '../utils/functions';
import axios from 'axios';
function QRData() {
  const [qrValue, setQrValue] = useState({});

  useEffect(() => {
    setQrValue(JSON.parse(functions.QR_DATA.getString('QR_DATA')));
  }, []);

  const handleVerify = async () => {
    try {
      const userData = JSON.parse(functions.USER_DATA.getString('USER_DATA'));
      const endpoint = `${API_BASE_URL}/VerifyAttendee`;
      const inputData = {
        token: userData.token,
        attendee_code: qrValue.attendee_code,
        first_name: qrValue.first_name,
        last_name: qrValue.last_name,
        nickname: qrValue.nickname,
        gender: qrValue.gender,
        attendee_type: qrValue.attendee_type,
        email: qrValue.email,
      };
      const response = await axios.post(endpoint, inputData);
      if (response.data === '') { 
        return;
      }
    } catch (er) {
      console.error(er);
    }
  };
  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => console.log(JSON.stringify(qrValue, null, 2))}>
        <Text>Hello</Text>
      </TouchableOpacity>
      <Text style={styles.input}>{qrValue.attendee_code}</Text>
      <Text style={styles.input}>{qrValue.attendee_type}</Text>
      <Text style={styles.input}>{qrValue.email}</Text>
      <Text style={styles.input}>{qrValue.first_name}</Text>
      <Text style={styles.input}>{qrValue.gender}</Text>
      <Text style={styles.input}>{qrValue.last_name}</Text>
      <Text style={styles.input}>{qrValue.mobile_no}</Text>
      <Text style={styles.input}>{qrValue.nickname}</Text>
      <Text style={styles.input}>{qrValue.registered_date}</Text>
      <Text style={styles.input}>{qrValue.type}</Text>
      <TouchableOpacity style={styles.button} onPress={handleVerify}>
        <Text style={styles.buttonText}>Verify </Text>
      </TouchableOpacity>
    </View>
  );
}

export default QRData;
