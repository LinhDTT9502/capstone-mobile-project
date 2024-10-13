import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TextInput,
  Alert,
} from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faArrowLeft, faHeart, faCheckSquare, faSquare } from "@fortawesome/free-solid-svg-icons"; // Add check icons
import demoProduct from "../../../assets/images/product_demo.jpg"; // Ensure this path is correct

export default function ProductDetail({ navigation }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isAgreed, setIsAgreed] = useState(false);

  const handleRentProduct = () => {
    if (!startDate || !endDate) {
      Alert.alert('Error', 'Please select rental dates.');
      return;
    }

    if (!isAgreed) {
      Alert.alert('Error', 'You must agree to the terms before proceeding.');
      return;
    }

    Alert.alert('Success', 'Product rented successfully!');
    setModalVisible(false);
    navigation.navigate('PaymentDetail');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <FontAwesomeIcon icon={faArrowLeft} size={20} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>Product Details</Text>
        <FontAwesomeIcon icon={faHeart} size={20} color="#FF6B6B" />
      </View>

      <View style={styles.content}>
        <Image source={demoProduct} style={styles.productImage} />
        <Text style={styles.productName}>Do One Thing Every Morning To Make Your Day</Text>
        <Text style={styles.productTag}>For exchange</Text>

        <Text style={styles.sectionTitle}>Specification</Text>
        <Text style={styles.specificationText}>Condition: New</Text>
        <Text style={styles.specificationText}>
          Description: The Nike Air Max 270 React ENG combines a full-length React foam
        </Text>
        <Text style={styles.specificationText}>Location: 123 ABC Street</Text>

        <Text style={styles.sectionTitle}>Uploaded by:</Text>
        <View style={styles.uploaderContainer}>
          <Image
            source={{ uri: "https://via.placeholder.com/40" }}
            style={styles.uploaderImage}
          />
          <View style={styles.uploaderInfo}>
            <Text style={styles.uploaderName}>James Lawson</Text>
            <Text style={styles.publishedDate}>Published by: 21/02/2024</Text>
            <Text>⭐️⭐️⭐️⭐️☆</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.addToCartButton}>
          <Text style={styles.addToCartText}>Add to cart</Text>
        </TouchableOpacity>

        {/* Rent Product Button */}
        <TouchableOpacity
          style={styles.rentButton}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.rentButtonText}>Rent Product</Text>
        </TouchableOpacity>
      </View>

      {/* Rent Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(!modalVisible)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Rent this Product</Text>

            {/* Date Inputs */}
            <TextInput
              style={styles.dateInput}
              placeholder="Start Date (DD/MM/YYYY)"
              value={startDate}
              onChangeText={setStartDate}
            />
            <TextInput
              style={styles.dateInput}
              placeholder="End Date (DD/MM/YYYY)"
              value={endDate}
              onChangeText={setEndDate}
            />

            {/* Agreement Checkbox */}
            <View style={styles.checkboxContainer}>
              <TouchableOpacity
                onPress={() => setIsAgreed(!isAgreed)}
                style={styles.checkbox}
              >
                <FontAwesomeIcon
                  icon={isAgreed ? faCheckSquare : faSquare} // Toggle between check and uncheck icons
                  size={24}
                  color={isAgreed ? "#4CAF50" : "#333"}
                />
              </TouchableOpacity>
              <Text style={styles.checkboxLabel}>
                I agree to the rental terms and conditions.
              </Text>
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleRentProduct}
            >
              <Text style={styles.submitButtonText}>Proceed to Payment</Text>
            </TouchableOpacity>

            {/* Cancel Button */}
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 30,
    backgroundColor: "#FFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "#FFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  productImage: {
    width: "100%",
    height: 250,
    borderRadius: 8,
    marginBottom: 16,
    resizeMode: "contain",
  },
  productName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  productTag: {
    backgroundColor: "#E6F0FF",
    color: "#4A90E2",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    alignSelf: "flex-start",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 8,
    color: "#333",
  },
  specificationText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
    lineHeight: 20,
  },
  uploaderContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
    backgroundColor: "#F9F9F9",
    padding: 8,
    borderRadius: 8,
  },
  uploaderImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 8,
  },
  uploaderInfo: {
    flex: 1,
  },
  uploaderName: {
    fontWeight: "bold",
    fontSize: 14,
    color: "#333",
  },
  publishedDate: {
    fontSize: 12,
    color: "#999",
  },
  addToCartButton: {
    backgroundColor: "#FF9900",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 24,
    width: "90%",
    alignSelf: "center",
  },
  addToCartText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  rentButton: {
    backgroundColor: "#4A90E2",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
    width: "90%",
    alignSelf: "center",
  },
  rentButtonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#FFF",
    borderRadius: 8,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
  dateInput: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  checkboxLabel: {
    marginLeft: 10,
    fontSize: 14,
  },
  submitButton: {
    backgroundColor: "#FF9900",
    paddingVertical: 14,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
    marginBottom: 10,
  },
  submitButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  cancelButton: {
    backgroundColor: "#FFF",
    paddingVertical: 10,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
    borderColor: "#FF6B6B",
    borderWidth: 1,
  },
  cancelButtonText: {
    color: "#FF6B6B",
    fontSize: 16,
    fontWeight: "bold",
  },
});
