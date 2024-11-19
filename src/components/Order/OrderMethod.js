import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Alert,
} from "react-native";
import { RadioButton } from "react-native-paper";
import { Avatar } from "react-native-elements";
import { fetchBranchs } from "../../services/branchService";
import { fetchProductsbyBranch } from "../../services/warehouseService";

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
          return { branchId: branch.id, status: isAvailable ? "Còn hàng" : "Hết hàng" };
        });

        const statuses = await Promise.all(statusPromises);

        const statusMap = {};
        statuses.forEach(({ branchId, status }) => {
          statusMap[branchId] = status;
        });
        setBranchStatus(statusMap);
      } catch (error) {
        console.error("Error loading branches or availability:", error);
      }
    };

    loadBranchesWithStatus();
  }, []);

  const handleBranchChange = (branchId) => {
    if (branchStatus[branchId] === "Hết hàng") {
      Alert.alert("Thông báo", "Chi nhánh này đã hết hàng.");
      return;
    }
    setSelectedBranchId(branchId);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Phương thức nhận hàng</Text>
      <View>
        <TouchableOpacity
          style={styles.radioOption}
          onPress={() => handleOptionChange("HOME_DELIVERY")}
        >
          <RadioButton
            value="HOME_DELIVERY"
            status={selectedOption === "HOME_DELIVERY" ? "checked" : "unchecked"}
            onPress={() => handleOptionChange("HOME_DELIVERY")}
          />
          <Text style={styles.radioText}>Giao tận nơi</Text>
        </TouchableOpacity>
        {selectedOption === "HOME_DELIVERY" && (
          <View style={styles.deliveryDetails}>
            {/* Giao diện hoặc component nhập địa chỉ giao hàng */}
            <Text>Nhập địa chỉ giao hàng...</Text>
          </View>
        )}
        <TouchableOpacity
          style={styles.radioOption}
          onPress={() => handleOptionChange("STORE_PICKUP")}
        >
          <RadioButton
            value="STORE_PICKUP"
            status={selectedOption === "STORE_PICKUP" ? "checked" : "unchecked"}
            onPress={() => handleOptionChange("STORE_PICKUP")}
          />
          <Text style={styles.radioText}>Nhận tại cửa hàng</Text>
        </TouchableOpacity>
        {selectedOption === "STORE_PICKUP" && (
          <FlatList
            data={branches}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.branchItem,
                  selectedBranchId === item.id && styles.selectedBranch,
                  branchStatus[item.id] === "Hết hàng" && styles.disabledBranch,
                ]}
                onPress={() => handleBranchChange(item.id)}
                disabled={branchStatus[item.id] === "Hết hàng"}
              >
                <Avatar
                  rounded
                  source={{ uri: item.imgAvatarPath }}
                  size="medium"
                  containerStyle={styles.avatar}
                />
                <View>
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
                </View>
              </TouchableOpacity>
            )}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#F5F5F5",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  radioOption: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  radioText: {
    marginLeft: 8,
    fontSize: 16,
    color: "#333",
  },
  deliveryDetails: {
    marginTop: 8,
    backgroundColor: "#E8E8E8",
    padding: 16,
    borderRadius: 8,
  },
  branchItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    marginBottom: 8,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#DDD",
  },
  selectedBranch: {
    borderColor: "#3366FF",
    backgroundColor: "#E8F4FF",
  },
  disabledBranch: {
    opacity: 0.5,
  },
  avatar: {
    marginRight: 16,
  },
  branchName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  branchLocation: {
    fontSize: 14,
    color: "#555",
  },
  branchStatus: {
    marginTop: 4,
    fontSize: 14,
  },
  available: {
    color: "green",
  },
  unavailable: {
    color: "red",
  },
});

export default OrderMethod;
