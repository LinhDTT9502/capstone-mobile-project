// SelectPayment.js
import React, { useEffect, useState } from "react";
import {
  Alert,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  View,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { selectCheckout } from "../../api/Checkout/apiCheckout";
import PaymentMethod from "../../components/Payment/PaymentMethod";
import { Feather } from "@expo/vector-icons";

function SelectPayment({ route }) {
  const { order } = route.params;
  const navigation = useNavigation();
  const [selectedOption, setSelectedOption] = useState("1");
  const [paymentCompleted, setPaymentCompleted] = useState(false);

  const handleCheck = async () => {
    if (paymentCompleted) {
      return;
    }

    try {
      if (selectedOption === "1") {
        // COD
        setPaymentCompleted(true);
        Alert.alert(
          "Thanh toán thành công",
          "Bạn đã chọn thanh toán khi nhận hàng.",
          [{ text: "OK", onPress: () => navigation.navigate("HomeController") }]
        );
      } else if (selectedOption === "2" || selectedOption === "3") {
        // PayOS or VNPay
        const data = await selectCheckout({
          paymentMethodID: parseInt(selectedOption),
          orderId: order.id,
          orderCode: order.saleOrderCode,
        });

        if (data?.data?.data?.paymentLink) {
          Linking.canOpenURL(data.data.data.paymentLink).then((supported) => {
            if (supported) {
              Linking.openURL(data.data.data.paymentLink);
            } else {
              console.log("Can't open URI:", data.data.data.paymentLink);
            }
          });
        }

        setPaymentCompleted(true);
        Alert.alert("Thanh toán thành công", "Bạn đã thanh toán thành công.", [
          { text: "OK", onPress: () => navigation.navigate("HomeController") },
        ]);
      } else if (selectedOption === "4") {
        // Bank Transfer
        setPaymentCompleted(true);
        Alert.alert(
          "Thanh toán thành công",
          "Bạn đã chọn thanh toán qua chuyển khoản ngân hàng.",
          [{ text: "OK", onPress: () => navigation.navigate("HomeController") }]
        );
      }
    } catch (error) {
      console.error("Error during checkout:", error);
      Alert.alert(
        "Lỗi",
        "Đã xảy ra lỗi trong quá trình thanh toán. Vui lòng thử lại."
      );
    }
  };

  const data = order.saleOrderDetailVMs?.['$values'] || order.children

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Feather name="arrow-left" size={24} color="#050505" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Trạng thái đơn hàng</Text>
      </View>

      <ScrollView style={styles.content}>
        {/* Customer Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Thông tin khách hàng</Text>
          <View style={styles.card}>
            <InfoItem icon="user" label="Tên" value={order.fullName} />
            <InfoItem icon="mail" label="Email" value={order.email} />
            <InfoItem
              icon="phone"
              label="Số điện thoại"
              value={order.contactPhone}
            />
            <InfoItem icon="map-pin" label="Địa chỉ" value={order.address} />
          </View>
        </View>

        {/* Order Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tóm tắt đơn hàng</Text>
          <View style={styles.card}>
            {(data?.length > 0 ? data : [order]).map((item, index) => {
              const _item = {...item}
              return <View style={styles.cardItem}>
                <Image
                  source={{
                    uri: _item?.imgAvatarPath || "https://via.placeholder.com/100",
                  }}
                  style={{ width: 50, height: 50}}
                />
                <View key={index} style={styles.itemRow}>
                  <Text style={styles.itemName}>{_item.productName}</Text>
                  <Text style={styles.itemQuantity}>x{_item?.quantity}</Text>
                  <Text style={styles.itemPrice}>
                    {formatCurrency(_item.unitPrice || _item.subTotal)}
                  </Text>
                </View>
              </View>
            })}
            <View style={styles.divider} />
            <TotalItem
              label="Tổng cộng"
              value={formatCurrency(order.totalAmount)}
            />
            <TotalItem
              label="Phí vận chuyển"
              value={formatCurrency(order.tranSportFee)}
            />
            <TotalItem
              label="Thành tiền"
              value={formatCurrency(order.totalAmount + order.tranSportFee)}
              isTotal
            />
          </View>
        </View>

        {/* Payment Method */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Phương thức thanh toán</Text>
          <PaymentMethod
            selectedOption={selectedOption || order.paymentMethodID}
            setSelectedOption={setSelectedOption}
            paymentCompleted={paymentCompleted}
            order={order}
          />
        </View>
      </ScrollView>

      {order?.paymentMethod ? <View></View> : <TouchableOpacity
        style={[
          styles.checkoutButton,
          paymentCompleted && styles.disabledButton,
        ]}
        onPress={handleCheck}
        disabled={paymentCompleted}
      >
        <Text style={styles.checkoutText}>Xác nhận thanh toán</Text>
      </TouchableOpacity>}
      
    </View>
  );
}

const InfoItem = ({ icon, label, value }) => (
  <View style={styles.infoItem}>
    <Feather name={icon} size={18} color="#666" style={styles.infoIcon} />
    <View>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  </View>
);

const TotalItem = ({ label, value, isTotal = false }) => (
  <View style={[styles.totalItem, isTotal && styles.finalTotal]}>
    <Text style={[styles.totalLabel, isTotal && styles.finalTotalLabel]}>
      {label}
    </Text>
    <Text style={[styles.totalValue, isTotal && styles.finalTotalValue]}>
      {value}
    </Text>
  </View>
);

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    marginLeft: 12,
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  content: {
    flex: 1,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardItem: {
    flexDirection: "row",
    gap: 20
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  infoIcon: {
    marginRight: 12,
  },
  infoLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  itemName: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  itemQuantity: {
    fontSize: 16,
    color: "#666",
    marginRight: 8,
  },
  itemPrice: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
  divider: {
    height: 1,
    backgroundColor: "#E0E0E0",
    marginVertical: 12,
  },
  totalItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  totalLabel: {
    fontSize: 16,
    color: "#333",
  },
  totalValue: {
    fontSize: 16,
    color: "#333",
    fontWeight: "600",
  },
  finalTotal: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
  },
  finalTotalLabel: {
    fontSize: 18,
    fontWeight: "bold",
  },
  finalTotalValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#3366FF",
  },
  checkoutButton: {
    margin: 16,
    padding: 16,
    backgroundColor: "#3366FF",
    borderRadius: 12,
    alignItems: "center",
  },
  disabledButton: {
    backgroundColor: "#A0AEC0",
  },
  checkoutText: {
    fontSize: 18,
    color: "#FFFFFF",
    fontWeight: "bold",
  },
});

export default SelectPayment;
