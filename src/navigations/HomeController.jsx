// HomeController.js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from '@expo/vector-icons/Ionicons';
import { View, Text, StyleSheet } from 'react-native';

import LandingPage from '../screens/HomeScreen/index';
import ProductList from '../screens/ProductList/index';
import Cart from '../screens/CartList';
import Account from '../screens/Profile';

const Tab = createBottomTabNavigator();

export default function HomeController() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size, focused }) => {
          let iconName;

          if (route.name === 'LandingPage') {
            iconName = 'home-outline';
          } else if (route.name === 'ProductList') {
            iconName = 'search-outline';
          } else if (route.name === 'Cart') {
            iconName = 'cart-outline';
          } else if (route.name === 'Account') {
            iconName = 'person-outline';
          }

          // Enhanced icon styling with active icon effect
          return (
            <View style={[styles.iconContainer, focused && styles.activeIconContainer]}>
              <Ionicons name={iconName} size={size} color={color} />
            </View>
          );
        },
        tabBarLabel: ({ focused, color }) => (
          <Text style={[styles.tabLabel, focused && styles.activeTabLabel]}>
            {route.name === 'LandingPage' ? 'Trang chủ' : route.name === 'ProductList' ? 'Sản phẩm' : route.name === 'Cart' ? 'Giỏ hàng' : 'Tài khoản'}
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
    height: 70,
    paddingBottom: 8,
    paddingTop: 4,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  iconContainer: {
    padding: 10,
    borderRadius: 20,
  },
  activeIconContainer: {
    backgroundColor: '#F0F4F8',
  },
  tabLabel: {
    fontSize: 10,
    textAlign: 'center',
    color: '#999',
    fontWeight: '500',
  },
  activeTabLabel: {
    color: '#4A90E2',
    fontWeight: '600',
  },
});
