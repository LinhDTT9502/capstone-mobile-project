import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
} from "react-native";
import { useSelector } from "react-redux";
import { fetchBranchs } from "../../services/branchService";
import { fetchProductsbyBranch } from "../../services/warehouseService";
import DeliveryAddress from "../Payment/DeliveryAddress";
import AddressForm from "../Shipment/AddressForm";

const OrderMethod = ({
  userData,
  setUserData,
  selectedOption,
  handleOptionChange,
  selectedBranchId,
  setSelectedBranchId,
}) => {
  const [branches, setBranches] = useState([]);
  const [branchStatus, setBranchStatus] = useState({});
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    const loadBranchesWithStatus = async () => {
      try {
        const branchData = await fetchBranchs();
        setBranches(branchData);

        const statusPromises = branchData.map(async (branch) => {
          const products = await fetchProductsbyBranch(branch.id);
          const isAvailable = products.some(
            (product) => product.availableQuantity > 0
          );
          return {
            branchId: branch.id,
            status: isAvailable ? "Còn hàng" : "Hết hàng",
          };
        });

        const statuses = await Promise.all(statusPromises);

        const statusMap = {};
        statuses.forEach(({ branchId, status }) => {
          statusMap[branchId] = status;
        });
        setBranchStatus(statusMap);
      } catch (error) {
        console.error("Error loading branches or availability:", error);
        Alert.alert("Error", "Unable to load branch data.");
      }
    };

    loadBranchesWithStatus();
  }, []);

  const handleBranchChange = (branchId) => {
    setSelectedBranchId(branchId);
  };

  const handleAddressChange = (fullAddress) => {
    setUserData((prevData) => ({ ...prevData, address: fullAddress }));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Phương thức nhận hàng</Text>
      <View style={styles.radioGroup}>
        <TouchableOpacity
          style={styles.radioOption}
          onPress={() => handleOptionChange("HOME_DELIVERY")}
        >
          <View
            style={[
              styles.radioCircle,
              selectedOption === "HOME_DELIVERY" && styles.radioSelected,
            ]}
          />
          <Text style={styles.radioLabel}>Giao tận nơi</Text>
        </TouchableOpacity>

        {selectedOption === "HOME_DELIVERY" && (
          <View style={styles.deliveryAddressContainer}>
            <Text style={styles.deliveryInfoText}>
              Thông tin khách hàng sẽ được sử dụng.
            </Text>
          </View>
        )}
        <TouchableOpacity
          style={styles.radioOption}
          onPress={() => handleOptionChange("STORE_PICKUP")}
        >
          <View
            style={[
              styles.radioCircle,
              selectedOption === "STORE_PICKUP" && styles.radioSelected,
            ]}
          />
          <Text style={styles.radioLabel}>Nhận tại cửa hàng</Text>
        </TouchableOpacity>
        {selectedOption === "STORE_PICKUP" && (
          <FlatList
            data={branches}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.branchItem,
                  selectedBranchId === item.id && styles.selectedBranchItem,
                  branchStatus[item.id] === "Hết hàng" &&
                    styles.disabledBranchItem,
                ]}
                onPress={() =>
                  branchStatus[item.id] !== "Hết hàng" &&
                  handleBranchChange(item.id)
                }
                disabled={branchStatus[item.id] === "Hết hàng"}
              >
                <Text style={styles.branchName}>{item.branchName}</Text>
                <Text style={styles.branchLocation}>{item.location}</Text>
                <Text
                  style={[
                    styles.branchStatus,
                    branchStatus[item.id] === "Còn hàng"
                      ? styles.available
                      : styles.unavailable,
                  ]}
                >
                  {branchStatus[item.id]}
                </Text>
              </TouchableOpacity>
            )}
          />
        )}
      </View>
    </View>
  );
};

const COLORS = {
  primary: "#3366FF",
  danger: "#E74C3C",
  gray: "#BDC3C7",
  lightGray: "#F0F0F0",
  white: "#FFFFFF",
  black: "#000000",
  success: "#2ECC71",
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: COLORS.white,
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  radioGroup: {
    marginBottom: 16,
  },
  radioOption: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  radioCircle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: COLORS.gray,
    marginRight: 8,
  },
  radioSelected: {
    backgroundColor: COLORS.primary,
  },
  radioLabel: {
    fontSize: 16,
    color: COLORS.black,
  },
  deliveryAddressContainer: {
    marginTop: 16,
    backgroundColor: COLORS.lightGray,
    padding: 12,
    borderRadius: 8,
  },
  branchItem: {
    padding: 16,
    marginBottom: 8,
    borderRadius: 8,
    backgroundColor: COLORS.lightGray,
    borderWidth: 1,
    borderColor: COLORS.gray,
  },
  selectedBranchItem: {
    borderColor: COLORS.primary,
    borderWidth: 2,
  },
  disabledBranchItem: {
    opacity: 0.5,
  },
  branchName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  branchLocation: {
    fontSize: 14,
    color: COLORS.gray,
  },
  branchStatus: {
    marginTop: 4,
    fontSize: 14,
  },
  available: {
    color: COLORS.success,
  },
  unavailable: {
    color: COLORS.danger,
  },
  deliveryAddressContainer: {
    marginTop: 16,
    backgroundColor: COLORS.lightGray,
    padding: 12,
    borderRadius: 8,
  },
  deliveryInfoText: {
    fontSize: 14,
    color: COLORS.gray,
    textAlign: "center",
  },
});

export default OrderMethod;
