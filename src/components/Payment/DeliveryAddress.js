import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, FlatList, Alert } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { getUserShipmentDetails } from "../../services/shipmentService";
import { selectedShipment, setShipment } from "../../redux/slices/shipmentSlice";

const DeliveryAddress = ({ userData, setUserData }) => {
  const token = localStorage.getItem("token");
  const dispatch = useDispatch();
  const shipments = useSelector((state) => state.shipment.shipments);
  const [isAddingAddress, setIsAddingAddress] = useState(false);

  useEffect(() => {
    const fetchShipments = async () => {
      if (token) {
        const shipmentData = await getUserShipmentDetails(token);
        dispatch(setShipment(shipmentData.$values));
      }
    };
    fetchShipments();
  }, [token, dispatch]);

  const handleAddAddress = () => {
    setIsAddingAddress(true);
  };

  return (
    <View>
      <Text style={styles.title}>Địa chỉ giao hàng</Text>
      <FlatList
        data={shipments}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.addressItem}>
            <Text>{item.fullName}</Text>
            <Text>{item.address}</Text>
            <Text>{item.phoneNumber}</Text>
          </View>
        )}
      />
      <Button title="Thêm địa chỉ mới" onPress={handleAddAddress} />
      {isAddingAddress && (
        <View>
          <TextInput
            placeholder="Nhập địa chỉ mới"
            onChangeText={(text) => setUserData((prev) => ({ ...prev, address: text }))}
          />
          <Button title="Lưu" onPress={() => setIsAddingAddress(false)} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  title: { fontSize: 16, fontWeight: "bold", marginBottom: 10 },
  addressItem: { padding: 10, borderBottomWidth: 1, borderBottomColor: "#ccc" },
});

export default DeliveryAddress;
