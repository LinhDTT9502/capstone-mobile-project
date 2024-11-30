import React from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet, ScrollView } from "react-native";
import { Feather } from "@expo/vector-icons";

const paymentMethods = [
  { title: "COD", value: "1", icon: "truck" },
  { title: "PayOS", value: "2", icon: "smartphone" },
  { title: "VNPay", value: "3", icon: "credit-card" },
  { title: "Bank Transfer", value: "4", icon: "briefcase" },
];

function PaymentMethod({
  selectedOption,
  setSelectedOption,
  paymentCompleted,
  order,
}) {
  console.log("🚀 ~ order:", order)
  const renderPaymentDetails = (value) => {
    switch (value) {
      case "1":
        return renderCODDetails();
      case "2":
        return renderPayOSDetails();
      case "3":
        return renderVnPayDetails();
      case "4":
        return renderBankDetails();
      default:
        return null;
    }
  };

  const renderCODDetails = () => (
    <View style={styles.detailsContainer}>
      <Text style={styles.detailsText}>
        Khi chọn hình thức thanh toán khi nhận hàng (COD), quý khách vui lòng
        kiểm tra kỹ hàng hóa khi nhận hàng và thanh toán đầy đủ toàn bộ giá trị
        đơn hàng cho người gửi.
      </Text>
    </View>
  );

  const renderPayOSDetails = () => (
    <View style={styles.detailsContainer}>
      <Text style={styles.detailsText}>
        Sử dụng ứng dụng ngân hàng để quét mã QR và tự động xác nhận thanh toán
        trong 5 phút. Vui lòng nhấn "Thanh toán" để thực hiện thanh toán đơn
        hàng ở bước tiếp theo.
      </Text>
    </View>
  );

  const renderVnPayDetails = () => (
    <View style={styles.detailsContainer}>
      <Text style={styles.detailsText}>
        Khi lựa chọn hình thức thanh toán qua VNPay, quý khách vui lòng đảm bảo
        rằng thông tin thanh toán được điền đầy đủ và chính xác. Sau khi thực
        hiện thanh toán, quý khách sẽ nhận được thông báo xác nhận từ hệ thống.
        Vui lòng nhấn "Thanh toán" để thực hiện thanh toán đơn hàng ở bước tiếp
        theo.
      </Text>
    </View>
  );

  const renderBankDetails = () => (
    <View style={styles.detailsContainer}>
      <Text style={styles.detailsTitle}>Thông tin chuyển khoản</Text>
      <Text style={styles.detailsText}>
        Vui lòng chuyển khoản vào tài khoản ngân hàng sau:
      </Text>
      <Image source={require("../../screens/SelectPayment/qrthanhtoan.png")} style={styles.qrCode} />
      <View style={styles.bankInfo}>
        <BankInfoItem label="Ngân hàng" value="TP Bank - Ngân hàng Thương mại Cổ phần Tiên Phong" />
        <BankInfoItem label="Số tài khoản" value="04072353101" />
        <BankInfoItem label="Chủ tài khoản" value="DUONG THI TRUC LINH" />
        <BankInfoItem label="Mã giao dịch" value={order.saleOrderCode} />
      </View>
      <Text style={styles.detailsText}>
        Khi chuyển khoản, quý khách vui lòng ghi Mã số Đơn hàng vào phần nội
        dung thanh toán của lệnh chuyển khoản. (VD: Tên – Mã Đơn hàng – SĐT)
      </Text>
      <Text style={styles.detailsText}>
        Trong vòng 48h kể từ khi đặt hàng thành công (không kể thứ Bảy, Chủ nhật
        và ngày lễ), nếu quý khách vẫn chưa thanh toán, chúng tôi xin phép hủy
        đơn hàng.
      </Text>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      {paymentMethods?.filter(item => order?.paymentMethodId ? item.value == order?.paymentMethodId : true).map((item) => (
        <View key={item.value}>
          <TouchableOpacity
            onPress={() => setSelectedOption(item.value)}
            style={[
              styles.optionContainer,
              selectedOption == item.value && styles.selectedOption,
            ]}
            disabled={paymentCompleted}
          >
            <View style={styles.optionContent}>
              <View style={styles.iconContainer}>
                <Feather name={item.icon} size={24} color={selectedOption == item.value ? "#FFFFFF" : "#3366FF"} />
              </View>
              <Text style={[
                styles.optionText,
                selectedOption == item.value && styles.selectedOptionText,
                paymentCompleted && styles.disabledOptionText,
              ]}>
                {item.title}
              </Text>
            </View>
            {!order?.paymentMethodId ? <View style={[
              styles.radioButton,
              selectedOption == item.value && styles.selectedRadioButton,
              paymentCompleted && styles.disabledRadioButton,
            ]}>
              {selectedOption == item.value && <View style={styles.selectedDot} />}
            </View> : null}
          </TouchableOpacity>
          {(selectedOption == item.value && !order?.paymentMethodId) && renderPaymentDetails(item.value)}
        </View>
      ))}
    </ScrollView>
  );
}

const BankInfoItem = ({ label, value }) => (
  <View style={styles.bankInfoItem}>
    <Text style={styles.bankInfoLabel}>{label}:</Text>
    <Text style={styles.bankInfoValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  optionContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
    backgroundColor: "#FFFFFF",
  },
  selectedOption: {
    backgroundColor: "#F0F5FF",
  },
  optionContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F0F5FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  optionText: {
    fontSize: 16,
    color: "#333333",
    fontWeight: "500",
  },
  selectedOptionText: {
    color: "#3366FF",
    fontWeight: "600",
  },
  disabledOptionText: {
    color: "#BBBBBB",
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#3366FF",
    justifyContent: "center",
    alignItems: "center",
  },
  selectedRadioButton: {
    borderColor: "#3366FF",
    backgroundColor: "#3366FF",
  },
  selectedDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#FFFFFF",
  },
  disabledRadioButton: {
    borderColor: "#BBBBBB",
  },
  detailsContainer: {
    backgroundColor: "#F9FAFC",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  detailsTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333333",
    marginBottom: 12,
  },
  detailsText: {
    fontSize: 14,
    color: "#666666",
    marginBottom: 12,
    lineHeight: 20,
  },
  qrCode: {
    width: 200,
    height: 200,
    resizeMode: "contain",
    alignSelf: "center",
    marginVertical: 20,
  },
  bankInfo: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  bankInfoItem: {
    flexDirection: "row",
    marginBottom: 8,
  },
  bankInfoLabel: {
    fontSize: 14,
    color: "#666666",
    width: 120,
  },
  bankInfoValue: {
    fontSize: 14,
    color: "#333333",
    fontWeight: "500",
    flex: 1,
  },
});

export default PaymentMethod;

