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
import Icon from 'react-native-vector-icons/Ionicons';

const Stack = createNativeStackNavigator();

const toastConfig = {
  success: props => (
    <BaseToast
      {...props}
      style={styles.successToast}
      contentContainerStyle={styles.toastContent}
      text1Style={styles.toastTitle}
      text2Style={styles.toastMessage}
      renderLeadingIcon={() => (
        <Icon name="checkmark-circle" size={28} color="#2ECC71" />
      )}
    />
  ),

  error: props => (
    <ErrorToast
      {...props}
      style={styles.errorToast}
      contentContainerStyle={styles.toastContent}
      text1Style={styles.toastTitle}
      text2Style={styles.toastMessage}
      renderLeadingIcon={() => (
        <Icon name="close-circle" size={28} color="#FF4D4D" />
      )}
    />
  ),
};
function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="QR Scanner"
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
        position="top"
        topOffset={100}
        visibilityTime={10000}
      />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  successToast: {
    backgroundColor: '#F2FFF7',
    borderLeftWidth: 0,
    borderRadius: 16,
    marginHorizontal: 16,
    shadowColor: '#2ECC71',
    shadowOpacity: 0.25,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },

  errorToast: {
    backgroundColor: '#FFF2F2',
    borderLeftWidth: 0,
    borderRadius: 16,
    marginHorizontal: 16,
    shadowColor: '#FF4D4D',
    shadowOpacity: 0.25,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },

  toastContent: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },

  toastTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111',
  },

  toastMessage: {
    fontSize: 13,
    color: '#555',
    marginTop: 2,
  },
})


export default App;
