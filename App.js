import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Home from './src/screens/Home';
import QRscanner from './src/screens/QRscanner';
import Login from './src/screens/Login';
import Register from './src/screens/Register';
import QRData from './src/screens/QRDATA';
const Stack = createNativeStackNavigator();

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
    </NavigationContainer>
  );
}

export default App;
