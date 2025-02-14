import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  TextInput,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'; // Import Ionicons
import Toast from 'react-native-toast-message';
import axios from 'axios';
import {CommonActions} from '@react-navigation/native';
import {API_BASE_URL} from '../utils/apiConfig';
import * as functions from '../utils/functions';

const Login = ({navigation}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false); // State for password visibility

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const pressLogin = async () => {
    try {
      if (username === '' || password === '') {
        Toast.show({
          type: 'error',
          text1: 'Please enter your username or password!',
        });
        return;
      }
      setLoading(true);
      const endpoint = `${API_BASE_URL}/VerifierLogin`;
      const inputData = {username, password};
      const response = await axios.post(endpoint, inputData);
      console.log(endpoint);
      console.log(JSON.stringify(inputData, null, 2));
      console.log(response.data);
      if (response.status === 200 && typeof response.data === 'object') {
        functions.USER_DATA.set(
          'USER_DATA',
          JSON.stringify(response.data, null, 2),
        );
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{name: 'Home'}],
          }),
        );
      } else if (response.data === 'Invalid username or password') {
        Toast.show({type: 'error', text1: 'Invalid username or password!'});
      } else if (response.data === 'Account is Pending') {
        Toast.show({type: 'info', text1: 'Account is pending'});
      } else {
        Toast.show({
          type: 'error',
          text1: 'Something went wrong. Please try again',
        });
      }
    } catch (er) {
      console.log(er);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <ImageBackground
          source={{uri: 'https://www.bootdey.com/image/580x580/20B2AA/20B2AA'}}
          style={styles.header}>
          <Text style={styles.heading}>LOGIN</Text>
        </ImageBackground>
        <View style={styles.card}>
          <TextInput
            style={styles.input}
            placeholder="Username"
            placeholderTextColor="#000"
            value={username}
            onChangeText={setUsername}
          />
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Password"
              secureTextEntry={!isPasswordVisible}
              placeholderTextColor="#000"
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity
              onPress={togglePasswordVisibility}
              style={styles.eyeIcon}>
              <Icon
                name={isPasswordVisible ? 'eye-off' : 'eye'}
                size={20}
                color="#000"
              />
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={styles.button}
            disabled={loading}
            onPress={pressLogin}>
            {loading ? (
              <ActivityIndicator size="small" color="#FFF" />
            ) : (
              <Text style={styles.buttonText}>Login</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.createAccountButton}
            onPress={() => navigation.navigate('Register')}>
            <Text style={styles.createAccountButtonText}>Create Account</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 50,
    paddingBottom: 20,
    width: '100%',
    height: 200,
  },
  heading: {fontSize: 30, fontWeight: 'bold', color: '#fff', marginBottom: 10},
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
    padding: 20,
    marginTop: 40,
    width: '90%',
    alignItems: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginVertical: 10,
    width: '100%',
    color: '#000',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    width: '100%',
    marginVertical: 10,
    paddingRight: 10,
  },
  passwordInput: {flex: 1, padding: 10, color: '#000'},
  eyeIcon: {padding: 10},
  button: {
    backgroundColor: '#20B2AA',
    borderRadius: 5,
    padding: 10,
    marginTop: 10,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {color: '#fff', fontWeight: 'bold'},
  createAccountButton: {marginTop: 20},
  createAccountButtonText: {color: '#20B2AA', fontSize: 12, fontWeight: 'bold'},
});

export default Login;
