import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import LandingPage from '../screens/Product/LandingPage';
import SearchingPage from '../screens/Product/SearchingPage';
import ProductDetail from '../screens/Product/ProductDetail';
import Cart from '../screens/Product/Cart';
import Checkout from '../screens/Product/Checkout';
import PaymentDetail from '../screens/Product/PaymentDetail';
import Account from '../screens/Product/Account';
import BottomNavigation from '../components/BottomNavigation';

export default function HomeController() {
  const [activeScreen, setActiveScreen] = useState('LandingPage');

  const renderScreen = () => {
    switch (activeScreen) {
      case 'LandingPage':
        return <LandingPage />;
      case 'SearchingPage':
        return <SearchingPage />;
      case 'ProductDetail':
        return <ProductDetail />;
      case 'Cart':
        return <Cart />;
      case 'Account':
        return <Account />;
      case 'Checkout':
        return <Checkout />;
      case 'PaymentDetail':
        return <PaymentDetail />;
      default:
        return <LandingPage />;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>{renderScreen()}</View>
      {/* Pass both activeScreen and setActiveScreen to BottomNavigation */}
      <BottomNavigation setActiveScreen={setActiveScreen} activeScreen={activeScreen} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  content: {
    flex: 1,
  },
});
