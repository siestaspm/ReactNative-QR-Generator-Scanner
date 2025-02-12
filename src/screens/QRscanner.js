import React, {useState} from 'react';
import {View, Text, TouchableOpacity, ActivityIndicator} from 'react-native';
import {Button, Dialog} from '@rneui/themed';
import styles from '../styles/Style';
import QRCodeScanner from 'react-native-qrcode-scanner';
import {RNCamera} from 'react-native-camera';
import * as functions from '../utils/functions';
import Toast from 'react-native-toast-message';
import axios from 'axios';
import {API_BASE_URL} from '../utils/apiConfig';

const QRscanner = ({navigation}) => {
  const [qrValue, setQrValue] = useState('');
  const [light, setLight] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [loading, setLoading] = useState(false);

  const verifyData = async data => {
    setLoading(true);
    try {
      const qrData = JSON.parse(data);
      if (!qrData.attendee_code) {
        Toast.show({
          type: 'error',
          text1: 'Invalid QR Code',
        });
        return;
      }
      const userData = JSON.parse(functions.USER_DATA.getString('USER_DATA'));
      const endpoint = `${API_BASE_URL}/VerifyAttendee`;
      const inputData = {
        token: userData.token,
        attendee_code: qrData.attendee_code,
        first_name: qrData.first_name,
        last_name: qrData.last_name,
        nickname: qrData.nickname,
        gender: qrData.gender,
        attendee_type: qrData.attendee_type,
        email: qrData.email,
      };
      const response = await axios.post(endpoint, inputData);
      console.log(response.USER_DATA);
      if (response.data === 'Unable to find attendee') {
        Toast.show({
          type: 'error',
          text1: 'Unable to find attendee!',
        });
      } else if (response.data === 'Attendee is already present') {
        Toast.show({
          type: 'error',
          text1: 'Attendee is already present!',
        });
      } else if (response.data === 'Success') {
        Toast.show({
          type: 'success',
          text1: 'Successfully Validate the QR code',
          text2: `${qrData.first_name} has been successfully validated`,
        });
      } else {
        Toast.show({
          type: 'error',
          text1: `${response.data}`,
        });
      }
    } catch (er) {
      Toast.show({
        type: 'error',
        text1: `Invalid QR Code`,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <QRCodeScanner
        ref={node => {
          this.scanner = node;
        }}
        onRead={e => {
          verifyData(e.data);
        }}
        topContent={<></>}
        bottomContent={
          <Button
            disabled={loading}
            title={
              loading ? <ActivityIndicator size="small" color="#FFF" /> : 'Scan'
            }
            icon={{...styles.iconButtonHome, size: 20, name: 'qr-code-scanner'}}
            iconContainerStyle={styles.iconButtonHomeContainer}
            titleStyle={{...styles.titleButtonHome, fontSize: 20}}
            buttonStyle={{...styles.buttonHome, height: 50}}
            containerStyle={{
              ...styles.buttonHomeContainer,
              marginTop: 20,
              marginBottom: 10,
            }}
            onPress={() => {
              this.scanner.reactivate();
            }}
          />
        }
      />
    </View>
  );
};

export default QRscanner;
