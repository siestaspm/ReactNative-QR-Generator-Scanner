import React, {useState} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {Button, Dialog} from '@rneui/themed';
import styles from '../styles/Style';
import QRCodeScanner from 'react-native-qrcode-scanner';
import {RNCamera} from 'react-native-camera';
import * as functions from '../utils/functions';
import Toast from 'react-native-toast-message';
const QRscanner = ({navigation}) => {
  const [qrValue, setQrValue] = useState('');
  const [light, setLight] = useState(false);
  const [showDialog, setShowDialog] = useState(false);

  return (
    <View style={styles.container}>
      <QRCodeScanner
        ref={node => {
          this.scanner = node;
        }}
        onRead={e => {
          navigation.navigate('QR Data')
          functions.QR_DATA.set('QR_DATA', e.data);
        }}
        topContent={<></>}
        bottomContent={
          <Button
            title="Scan Again"
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
