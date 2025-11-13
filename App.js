import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {StyleSheet} from 'react-native';
import Home from './src/screens/Home';
import QRscanner from './src/screens/QRscanner';
import Login from './src/screens/Login';
import Register from './src/screens/Register';
import QRData from './src/screens/QRDATA';
import Toast, {BaseToast, ErrorToast} from 'react-native-toast-message';

const Stack = createNativeStackNavigator();

const toastConfig = {
  success: props => (
    <BaseToast
      {...props}
      style={styles.successToast}
      contentContainerStyle={{paddingHorizontal: 15}}
      text1Style={styles.toastTitle}
      text2Style={styles.toastMessage}
      text1NumberOfLines={2}
    />
  ),
  error: props => (
    <ErrorToast
      {...props}
      style={styles.errorToast}
      contentContainerStyle={{paddingHorizontal: 15}}
      text1Style={styles.toastTitle}
      text2Style={styles.toastMessage}
      text1NumberOfLines={2}
    />
  ),
};

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{headerShown: false}}>
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="QR Scanner" component={QRscanner} />
        <Stack.Screen name="QR Data" component={QRData} />
      </Stack.Navigator>

      {/* Toast positioned at bottom with modern styling */}
      <Toast
        config={toastConfig}
        position="bottom"
        bottomOffset={70}
        visibilityTime={2500}
      />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  successToast: {
    borderLeftColor: '#CEAE7B',
    backgroundColor: '#E6FFFA',
    borderRadius: 12,
    shadowColor: '#CEAE7B',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 4,
  },
  errorToast: {
    borderLeftColor: '#FF6B6B',
    backgroundColor: '#FFECEC',
    borderRadius: 12,
    shadowColor: '#FF6B6B',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 4,
  },
  toastTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#333',
  },
  toastMessage: {
    fontSize: 13,
    color: '#555',
  },
});

export default App;
