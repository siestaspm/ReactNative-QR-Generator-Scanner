import * as React from 'react';
import {View} from 'react-native';
import {Button} from '@rneui/themed';
import {CommonActions} from '@react-navigation/native';
import styles from '../styles/Style';
import * as functions from '../utils/functions';
function Home({navigation}) {
  const handleLogout = () => {
    functions.USER_DATA.delete('USER_DATA');
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{name: 'Login'}],
      }),
    );
  };

  return (
    <View style={styles.container}>
      <Button
        title="Scan QR"
        onPress={() => navigation.navigate('QR Scanner')}
        titleStyle={styles.titleButtonHome}
        buttonStyle={styles.buttonHome}
        containerStyle={styles.buttonHomeContainer}
      />
      <Button
        title="Log out"
        onPress={() => handleLogout()}
        titleStyle={styles.titleButtonHome}
        buttonStyle={styles.buttonHome}
        containerStyle={styles.buttonHomeContainer}
      />
    </View>
  );
}

export default Home;
