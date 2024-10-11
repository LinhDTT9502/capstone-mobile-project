import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeController from './HomeController'; 
import LogoScreen from '../screens/Logo/index';
import SplashScreen from '../screens/Splash/index';
import LoginScreen from '../screens/Login/index';
import SignUpScreen from '../screens/SignUp/index';
import ForgotPasswordScreen from '../screens/Auth/ForgotPassword';

import ProductDetail from '../screens/Product/ProductDetail';
import Checkout from '../screens/Product/Checkout';
import Cart from '../screens/Product/Cart';
import PaymentDetail from '../screens/Product/PaymentDetail';

const Stack = createStackNavigator();

export default function MainContainer() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Logo" component={LogoScreen} />
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <Stack.Screen name="HomeController" component={HomeController} /> 

      <Stack.Screen name="ProductDetail" component={ProductDetail} />
      <Stack.Screen name="Checkout" component={Checkout} />
      <Stack.Screen name="Cart" component={Cart} />
      <Stack.Screen name="PaymentDetail" component={PaymentDetail} />
    </Stack.Navigator>
  );
}
