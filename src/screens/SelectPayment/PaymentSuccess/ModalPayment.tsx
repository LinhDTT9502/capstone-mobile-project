import React from "react";
import { Modal, Alert } from "react-native";
import WebView from "react-native-webview";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

interface ModalPaymentProps {
  isVisible: boolean;
  onClose: () => void;
  link: string;
  onSucceed: () => void;
}

// Define the navigation type for the stack
type RootStackParamList = {
  HomeController: undefined; // Replace 'undefined' with params if needed
};

type NavigationProp = StackNavigationProp<RootStackParamList>;

export const ModalPayment: React.FC<ModalPaymentProps> = ({
  isVisible,
  onClose,
  link,
  onSucceed,
}) => {
  const navigation = useNavigation<NavigationProp>();
  const API_URL = "https://capstone-project-703387227873.asia-southeast1.run.app/api/Checkout/"

  return (
    <Modal visible={isVisible} onRequestClose={onClose}>
      <WebView
        source={{ uri: link }}
        onNavigationStateChange={(event) => {
          console.log(event.url);
          if (
            event.url.includes(API_URL +
              "sale-order-cancel-payos"
            )
          ) {
            console.log("this is sale order payos cancel")
          } else if (event.url.includes(API_URL + "sale-order-return-payos")) {

            console.log("This is sale order payos success");
            // Payment success
            onSucceed?.();
            navigation.navigate("HomeController");
            Alert.alert(
              "Thanh toán thành công",
              "Bạn đã xác nhận thanh toán đơn hàng thành công.",
              [{ text: "OK" }]
            );
          } else if (
            event.url.includes(API_URL +
              "sale-order-return-vnpay"
            )
          ) {
            // Extract query parameters
            const url = new URL(event.url);
            const TransactionStatus = url.searchParams.get("TransactionStatus");

            // Check the status value
            if (TransactionStatus === "0") {
              console.log("This is sale order vnpay cancel");
            } else if (TransactionStatus === "00") {
              console.log("This is sale order vnpay success");
              // Payment success
              onSucceed?.();
              navigation.navigate("HomeController");
              Alert.alert(
                "Thanh toán thành công",
                "Bạn đã xác nhận thanh toán đơn hàng thành công.",
                [{ text: "OK" }]
              );
            }
          } else  if (
            event.url.includes(API_URL +
              "rental-order-cancel-payos"
            )
          ) {
            console.log("this is rental order payos cancel")
          } else if (event.url.includes(API_URL + "rental-order-return-payos")) {

            console.log("This is rental order payos success");
            // Payment success
            onSucceed?.();
            navigation.navigate("HomeController");
            Alert.alert(
              "Thanh toán thành công",
              "Bạn đã xác nhận thanh toán đơn hàng thành công.",
              [{ text: "OK" }]
            );
          } else if (
            event.url.includes(API_URL +
              "rental-order-return-vnpay"
            )
          ) {
            // Extract query parameters
            const url = new URL(event.url);
            const TransactionStatus = url.searchParams.get("TransactionStatus");

            // Check the status value
            if (TransactionStatus === "0") {
              console.log("This is rental vnpay cancel");
            } else if (TransactionStatus === "00") {
              console.log("This is rental vnpay success");
              // Payment success
              onSucceed?.();
              navigation.navigate("HomeController");
              Alert.alert(
                "Thanh toán thành công",
                "Bạn đã xác nhận thanh toán đơn hàng thành công.",
                [{ text: "OK" }]
              );
            }
          } 
        }}
      />
    </Modal>
  );
};
