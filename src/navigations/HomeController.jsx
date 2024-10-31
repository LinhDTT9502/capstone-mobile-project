import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import LandingPage from '../screens/HomeScreen/index';
import ProductList from '../screens/ProductList/index';
import Cart from '../screens/CartList';
import Account from '../screens/Profile';

const Tab = createBottomTabNavigator();

const TabBarIcon = ({ focused, color, size, name }) => {
  const animatedSize = React.useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
    Animated.spring(animatedSize, {
      toValue: focused ? 1.2 : 1,
      useNativeDriver: true,
    }).start();
  }, [focused]);

  return (
    <Animated.View style={{ transform: [{ scale: animatedSize }] }}>
      <Ionicons name={name} size={size} color={color} />
    </Animated.View>
  );
};

export default function HomeController() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size, focused }) => {
          let iconName;

          if (route.name === 'LandingPage') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'ProductList') {
            iconName = focused ? 'search' : 'search-outline';
          } else if (route.name === 'Cart') {
            iconName = focused ? 'cart' : 'cart-outline';
          } else if (route.name === 'Account') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return (
            <TabBarIcon
              focused={focused}
              name={iconName}
              size={size}
              color={color}
            />
          );
        },
        tabBarLabel: ({ focused, color }) => (
          <Text style={[styles.tabLabel, focused && styles.activeTabLabel]}>
            {route.name === 'LandingPage' ? 'Trang chủ' : 
             route.name === 'ProductList' ? 'Sản phẩm' : 
             route.name === 'Cart' ? 'Giỏ hàng' : 'Tài khoản'}
          </Text>
        ),
        tabBarActiveTintColor: '#4A90E2',
        tabBarInactiveTintColor: '#999',
        tabBarStyle: styles.tabBar,
        headerShown: false,
      })}
    >
      <Tab.Screen name="LandingPage" component={LandingPage} />
      <Tab.Screen name="ProductList" component={ProductList} />
      <Tab.Screen name="Cart" component={Cart} />
      <Tab.Screen name="Account" component={Account} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    height: 60,
    paddingBottom: 5,
    paddingTop: 5,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  tabLabel: {
    fontSize: 10,
    textAlign: 'center',
    color: '#999',
    fontWeight: '500',
    marginTop: 2,
  },
  activeTabLabel: {
    color: '#4A90E2',
    fontWeight: '600',
  },
});