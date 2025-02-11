import axios from 'axios';
import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import {API_BASE_URL} from '../utils/apiConfig';
import * as functions from '../utils/functions';

const Login = ({navigation}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const pressLogin = async () => {
    try {
      const endpoint = `${API_BASE_URL}/api/raffle/VerifierLogin`;
      const inputData = {
        username: username,
        password: password,
      };
      console.log(endpoint);
      console.log(JSON.stringify(inputData, null, 2));
      const response = await axios.post(endpoint, inputData);
      console.log(response.data);
      if (response.status === 200 && typeof response.data === 'object') {
        functions.USER_DATA.set(
          'USER_DATA',
          JSON.stringify(response.data, null, 2),
        );
        navigation.navigate('Home');
      }
      console.log('this is the response', response.data);
    } catch (er) {
      console.log(er);
    }
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={{uri: 'https://www.bootdey.com/image/580x580/20B2AA/20B2AA'}}
        style={styles.header}>
        <Text style={styles.heading}>LOGIN</Text>
      </ImageBackground>
      <View style={styles.card}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#000"
          value={username}
          onChangeText={text => setUsername(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry={true}
          placeholderTextColor="#000"
          value={password}
          onChangeText={text => setPassword(text)}
        />

        <TouchableOpacity style={styles.button} onPress={pressLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.createAccountButton}
          onPress={() => navigation.navigate('Register')}>
          <Text style={styles.createAccountButtonText}>Create Account</Text>
        </TouchableOpacity>
      </View>
    </View>
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
  heading: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  forgotPasswordButton: {
    width: '100%',
    textAlign: 'flex-end',
  },
  forgotPasswordButtonText: {
    color: '#20B2AA',
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'right',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
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
    color: '#000', // Change text color to black
  },
  button: {
    backgroundColor: '#20B2AA',
    borderRadius: 5,
    padding: 10,
    marginTop: 10,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  createAccountButton: {
    marginTop: 20,
  },
  createAccountButtonText: {
    color: '#20B2AA',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default Login;
