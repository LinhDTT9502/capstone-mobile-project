// MainContainer.js
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import HomeController from "./HomeController";
import LogoScreen from "../screens/Logo/index";
import SplashScreen from "../screens/Splash/index";
import LoginScreen from "../screens/Login/index";
import SignUpScreen from "../screens/SignUp/index";
import ForgotPasswordScreen from "../screens/Auth/ForgotPassword";
import IntroductionScreen from "../screens/Introduction/index";
import ContactUs from "../screens/ContactUs";
import ProductDetail from "../screens/ProductDetail/index";
import Checkout from "../screens/HomeScreen/Checkout";
import EditProfile from "../screens/EditProfile/index";
import ResetPasswordScreen from "../screens/Auth/ResetPassword";
import MyOrderScreen from "../screens/MyOrder";
import AccountResetPassword from "../screens/Auth/ResetPasswordProfile";
import MyOrder from "../screens/MyOrder/index";
import Policy from "../screens/Policy/index";
import UserShipment from "../screens/UserShipment/index";
import CategoryProduct from "../screens/CategoryProduct/index";
import VerifyOtpScreen from "../screens/VerifyOtpScreen/index";
import BrandProduct from "../screens/BrandProduct/index";
import BlogDetail from "../screens/Blog/BlogDetail/index";
import ResetPasswordProfile from "../screens/Auth/ResetPasswordProfile";
import VerifyAccountScreen from "../screens/Login/VerifyAccount/index";
import PolicySection from "../screens/Policy/PolicySection/index";
import PolicyDetail from "../screens/Policy/PolicyDetail/index";
import BranchList from "../screens/BranchList/index";
import PlaceOrderScreen from "../screens/PlaceOrder/index";
import OrderSuccessScreen from "../screens/PlaceOrder/OrderSuccess/index";

const Stack = createStackNavigator();

export default function MainContainer() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Logo" component={LogoScreen} />
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
      <Stack.Screen
        name="ResetPasswordProfile"
        component={ResetPasswordProfile}
      />
      <Stack.Screen name="HomeController" component={HomeController} />
      <Stack.Screen name="Introduction" component={IntroductionScreen} />
      <Stack.Screen name="ContactUs" component={ContactUs} />
      <Stack.Screen name="ProductDetail" component={ProductDetail} />
      <Stack.Screen name="Checkout" component={Checkout} />
      <Stack.Screen name="EditProfile" component={EditProfile} />
      <Stack.Screen name="PolicyDetail" component={PolicyDetail} />
      <Stack.Screen name="PolicySection" component={PolicySection} />
      <Stack.Screen name="BranchList" component={BranchList} />
      <Stack.Screen
        name="OrderSuccess"
        component={OrderSuccessScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="AccountResetPassword"
        component={AccountResetPassword}
      />
      <Stack.Screen name="VerifyAccount" component={VerifyAccountScreen} />

      <Stack.Screen name="MyOrder" component={MyOrder} />
      <Stack.Screen name="Policy" component={Policy} />
      <Stack.Screen name="UserShipment" component={UserShipment} />
      <Stack.Screen name="CategoryProduct" component={CategoryProduct} />
      <Stack.Screen name="BrandProduct" component={BrandProduct} />
      <Stack.Screen name="BlogDetail" component={BlogDetail} />
      <Stack.Screen name="VerifyOtpScreen " component={VerifyOtpScreen} />

      {/* testing */}
      <Stack.Screen name="PlacedOrder" component={PlaceOrderScreen} />
    </Stack.Navigator>
  );
}
