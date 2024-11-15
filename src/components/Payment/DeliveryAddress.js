import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  StyleSheet,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  selectedShipment,
  selectShipment,
  setShipment,
} from "../../redux/slices/shipmentSlice";
import { selectUser } from "../../redux/slices/authSlice";
import {
  addUserShipmentDetail,
  getUserShipmentDetails,
} from "../../services/shipmentService";
import AddressForm from "../../components/Shipment/AddressForm";

const DeliveryAddress = ({ userData, setUserData, setIsEditing }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const user = useSelector(selectUser);
  const shipments = useSelector(selectShipment);
  const shipment = useSelector(selectedShipment) || {};
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [gender, setGender] = useState(userData.gender || "Male");

  useEffect(() => {
    const fetchShipments = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const shipmentData = await getUserShipmentDetails(token);
        dispatch(
          setShipment({
            shipment: shipmentData?.$values || [],
            wardCode: shipmentData?.wardCode || null,
            districtId: shipmentData?.districtId || null,
          })
        );
      } catch (error) {
        console.error("Error fetching shipment:", error);
        Alert.alert("Error", "Failed to fetch shipment details.");
      }
    };

    if (!shipments || shipments.length === 0) fetchShipments();
  }, [dispatch, shipments]);

  useEffect(() => {
    if (shipment?.id && userData?.shipmentDetailID !== shipment.id) {
      setUserData((prevData) => ({
        ...prevData,
        fullName: shipment.fullName || prevData.fullName,
        address: shipment.address || prevData.address,
        phoneNumber: shipment.phoneNumber || prevData.phoneNumber,
        shipmentDetailID: shipment.id,
      }));
    }
  }, [shipment, userData.shipmentDetailID, setUserData]);

  const handleSaveClick = async () => {
    if (!userData.address || !userData.wardCode) {
      Alert.alert("Error", "Please fill in all required fields.");
      return;
    }

    try {
      const token = await AsyncStorage.getItem("token");
      setIsSubmitting(true);
      const response = await addUserShipmentDetail(token, userData);

      if (response?.status === 200) {
        Alert.alert("Success", "Shipment details saved successfully.");
        setIsEditing(false);
      } else {
        throw new Error("Failed to save shipment details.");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to save shipment details. Please try again.");
      console.error("Error saving shipment details:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGenderChange = (value) => {
    setGender(value);
    setUserData((prevData) => ({ ...prevData, gender: value }));
  };

  const handleAddressChange = (fullAddress, wardCode) => {
    setUserData((prevData) => ({ ...prevData, address: fullAddress, wardCode }));
  };
  

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.label}>Thông tin khách hàng</Text>
        <View style={styles.genderContainer}>
          <TouchableOpacity
            style={[styles.genderButton, gender === "Male" && styles.genderButtonSelected]}
            onPress={() => handleGenderChange("Male")}
          >
            <Text style={styles.genderText}>Anh</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.genderButton, gender === "Female" && styles.genderButtonSelected]}
            onPress={() => handleGenderChange("Female")}
          >
            <Text style={styles.genderText}>Chị</Text>
          </TouchableOpacity>
        </View>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={userData.email}
          onChangeText={(text) =>
            setUserData((prevData) => ({ ...prevData, email: text }))
          }
          keyboardType="email-address"
        />
        <AddressForm onAddressChange={handleAddressChange} />
        <View style={styles.buttonGroup}>
          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSaveClick}
            disabled={isSubmitting}
          >
            <Text style={styles.buttonText}>{isSubmitting ? "Saving..." : "Save"}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  section: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  genderContainer: {
    flexDirection: "row",
    marginBottom: 16,
  },
  genderButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#CCCCCC",
    alignItems: "center",
    marginHorizontal: 4,
  },
  genderButtonSelected: {
    backgroundColor: "#3366FF",
  },
  genderText: {
    color: "#333",
  },
  input: {
    borderColor: "#CCCCCC",
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  buttonGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  saveButton: {
    backgroundColor: "#3366FF",
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginRight: 8,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#FF6347",
    padding: 12,
    borderRadius: 8,
    flex: 1,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default DeliveryAddress;
