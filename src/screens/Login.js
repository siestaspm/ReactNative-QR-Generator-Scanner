import axios from 'axios';
import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  TextInput,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import {API_BASE_URL} from '../utils/apiConfig';
import * as functions from '../utils/functions';
import Toast from 'react-native-toast-message';
import { CommonActions } from '@react-navigation/native';
const Login = ({navigation}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false)
  const pressLogin = async () => {
    try {
      if (username === '' || password === '') { 
        Toast.show({
          type: 'error', // success | error | info
          text1: 'Please enter your username or password!'
        });
        return;
      }
      setLoading(true)
      const endpoint = `${API_BASE_URL}/VerifierLogin`;
      const inputData = {
        username: username,
        password: password,
      };
      const response = await axios.post(endpoint, inputData);
      console.log(response.data);
      if (response.status === 200 && typeof response.data === 'object') {
        functions.USER_DATA.set(
          'USER_DATA',
          JSON.stringify(response.data, null, 2),
        );
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{name: 'Home'}]
          })
        )
      } else if (response.data === 'Invalid username or password') { 
  Toast.show({
    type: 'error',
    text1: 'Invalid username or password!'
  });
      } else if (response.data === 'Account is pending') { 
Toast.show({
    type: 'info',
    text1: 'Account is pending'
  });
      } else { 
Toast.show({
    type: 'error',
    text1: 'Something went wrong. Please try again'
  });
}
    } catch (er) {
      console.log(er);
    } finally { 
      setLoading(false)
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
          {loading ? ( 
            <ActivityIndicator size='small' color='#FFF'/>
          ):(
            <Text style={styles.buttonText}>Login</Text>)}
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
