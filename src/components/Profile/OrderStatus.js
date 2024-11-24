import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import styles from './OrderStatusStyle';

const OrderSection = () => {
  const navigation = useNavigation();

  const statuses = [
    { label: "Chờ xác nhận", icon: "time-outline", value: "pending" },
    { label: "Chờ lấy hàng", icon: "cube-outline", value: "pickup" },
    { label: "Đang giao", icon: "bicycle-outline", value: "shipping" },
    { label: "Đánh giá", icon: "star-outline", value: "review" },
  ];

  const handleStatusClick = (status) => {
    navigation.navigate("MyOrder", { status });
  };

  return (
    <View style={styles.orderSection}>
      <Text style={styles.sectionTitle}>Đơn hàng của tôi</Text>
      <View style={styles.statusMenu}>
        {statuses.map((item) => (
          <TouchableOpacity
            key={item.value}
            style={styles.statusButton}
            onPress={() => handleStatusClick(item.value)}
          >
            <Ionicons
              name={item.icon}
              size={28}
              color="#FF9900"
              style={styles.statusIcon}
            />
            <Text style={styles.statusText}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <TouchableOpacity
        style={styles.viewAllOrders}
        onPress={() => navigation.navigate("MyOrder", { status: "all" })}
      >
        <Text style={styles.viewAllOrdersText}>Xem tất cả đơn hàng</Text>
        <Ionicons name="chevron-forward" size={20} color="#FF9900" />
      </TouchableOpacity>
    </View>
  );
};

export default OrderSection;

