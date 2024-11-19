import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
} from "react-native";
import {
  fetchBranchs,
  fetchProductsbyBranch,
} from "../../services/branchService";

const OrderMethod = ({
  selectedOption,
  handleOptionChange,
  selectedBranchId,
  setSelectedBranchId,
}) => {
  const [branches, setBranches] = useState([]);
  const [branchStatus, setBranchStatus] = useState({});

  useEffect(() => {
    const loadBranches = async () => {
      const branchData = await fetchBranchs();
      setBranches(branchData);

      const status = {};
      for (const branch of branchData) {
        const products = await fetchProductsbyBranch(branch.id);
        status[branch.id] = products.some((p) => p.availableQuantity > 0)
          ? "Còn hàng"
          : "Hết hàng";
      }
      setBranchStatus(status);
    };

    loadBranches();
  }, []);

  return (
    <View>
      <Text style={styles.title}>Phương thức nhận hàng</Text>
      <TouchableOpacity
        onPress={() => handleOptionChange("HOME_DELIVERY")}
        style={styles.option}
      >
        <Text
          style={
            selectedOption === "HOME_DELIVERY" ? styles.selected : styles.text
          }
        >
          Giao tận nơi
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => handleOptionChange("STORE_PICKUP")}
        style={styles.option}
      >
        <Text
          style={
            selectedOption === "STORE_PICKUP" ? styles.selected : styles.text
          }
        >
          Nhận tại cửa hàng
        </Text>
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
                branchStatus[item.id] === "Hết hàng" &&
                  styles.unavailableBranch,
              ]}
              onPress={() => {
                if (branchStatus[item.id] === "Hết hàng") {
                  Alert.alert("Thông báo", "Chi nhánh này đã hết hàng.");
                } else {
                  setSelectedBranchId(item.id);
                }
              }}
            >
              <Text>{item.branchName}</Text>
              <Text>{branchStatus[item.id]}</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  title: { fontSize: 16, fontWeight: "bold", marginBottom: 10 },
  option: { padding: 10, borderBottomWidth: 1, borderBottomColor: "#ccc" },
  text: { fontSize: 14 },
  selected: { fontSize: 14, fontWeight: "bold", color: "blue" },
  branchItem: { padding: 10, borderBottomWidth: 1, borderBottomColor: "#ccc" },
  unavailableBranch: { opacity: 0.5 },
  selectedBranch: { backgroundColor: "#f0f0f0" },
});

export default OrderMethod;
