import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Button} from '@rneui/themed';
import LinearGradient from 'react-native-linear-gradient';
import {CommonActions} from '@react-navigation/native';
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
    <LinearGradient colors={['#AC895B', '#531A89']} style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Welcome 👋</Text>
        <Text style={styles.subtitle}> Ready to scan or manage your data?</Text>

        <Button
          title="Scan QR"
          onPress={() => navigation.navigate('QR Scanner')}
          titleStyle={styles.titleButton}
          buttonStyle={styles.buttonPrimary}
          containerStyle={styles.buttonContainer}
        />

        <Button
          title="Log out"
          onPress={handleLogout}
          titleStyle={styles.titleButton}
          buttonStyle={styles.buttonPrimary}
          containerStyle={styles.buttonContainer}
        />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 25,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  subtitle: {
    color: '#E0F7F5',
    fontSize: 15,
    marginBottom: 40,
  },
  buttonContainer: {
    width: '100%',
    marginVertical: 8,
  },
  buttonPrimary: {
    backgroundColor: '#531A89',
    borderRadius: 14,
    paddingVertical: 14,
    elevation: 6,
    shadowColor: '#AC895B',
    shadowOffset: {width: 0, height: 6},
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  buttonSecondary: {
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingVertical: 14,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 6},
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  titleButton: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#FFF',
  },
});

export default Home;
