import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { selectShipment, setShipment } from '../../redux/slices/shipmentSlice';
import { getUserShipmentDetails } from '../../services/shipmentService';
import AddShipment from '../../components/Shipment/AddShipment';
import UpdateShipment from '../../components/Shipment/UpdateShipment';
import DeleteShipment from '../../components/Shipment/DeleteShipment';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function UserShipment() {
  const dispatch = useDispatch();
  const shipments = useSelector(selectShipment);
  const [isLoading, setIsLoading] = useState(true);
  const [currentShipment, setCurrentShipment] = useState(null);
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);

  const fetchShipments = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert('Error', 'No token found');
        return;
      }
      const shipmentData = await getUserShipmentDetails(token);
      dispatch(setShipment(shipmentData.$values));
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching shipments:', error);
      Alert.alert('Error', 'Failed to fetch shipments');
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchShipments();
  }, [dispatch]);

  const handleUpdateShipment = (shipment) => {
    setCurrentShipment(shipment);
    setIsUpdateModalVisible(true);
  };

  const closeUpdateModal = () => {
    setIsUpdateModalVisible(false);
    setCurrentShipment(null);
  };

  return (
    <View style={styles.container}>
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FFA500" />
          <Text style={styles.loadingText}>Loading shipments...</Text>
        </View>
      ) : shipments.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Icon name="local-shipping" size={50} color="#CCC" />
          <Text style={styles.emptyText}>No shipment details available</Text>
        </View>
      ) : (
        <ScrollView style={styles.scrollView}>
          <Text style={styles.title}>My Addresses</Text>
          {shipments.map((shipment) => (
            <View key={shipment.id} style={styles.shipmentItem}>
              <View style={styles.shipmentInfo}>
                <Text style={styles.shipmentName}>{shipment.fullName}</Text>
                <Text style={styles.shipmentDetails}>
                  <Icon name="phone" size={16} color="#666" /> {shipment.phoneNumber}
                </Text>
                <Text style={styles.shipmentDetails}>
                  <Icon name="location-on" size={16} color="#666" /> {shipment.address}
                </Text>
              </View>
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  onPress={() => handleUpdateShipment(shipment)}
                  style={styles.updateButton}
                >
                  <Icon name="edit" size={20} color="#FFF" />
                </TouchableOpacity>
                <DeleteShipment id={shipment.id} refreshShipments={fetchShipments} />
              </View>
            </View>
          ))}
        </ScrollView>
      )}
      <AddShipment refreshShipments={fetchShipments} />
      {isUpdateModalVisible && (
        <UpdateShipment shipment={currentShipment} onClose={closeUpdateModal} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F4F8',
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    marginTop: 10,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    marginTop: 10,
    color: '#666',
  },
  shipmentItem: {
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  shipmentInfo: {
    flex: 1,
  },
  shipmentName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#333',
  },
  shipmentDetails: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  updateButton: {
    backgroundColor: '#4CAF50',
    padding: 8,
    borderRadius: 8,
    marginRight: 8,
  },
});