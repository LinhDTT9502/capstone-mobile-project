import { Ionicons } from "@expo/vector-icons";
import { Linking, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { selectCheckout } from '../../api/Checkout/apiCheckout'
import { useState } from "react";
import { useNavigation } from "@react-navigation/native";

function SelectPayment({ route }) {
  const { order } = route.params
  const navigation = useNavigation()
  const [url, setUrl] = useState('')
  
  const handleCheck = async (value) => {
    try {
      const data = await selectCheckout({ paymentMethodID: parseInt(value), orderId: order.id, orderCode: order.saleOrderCode })
      if ((value == 2 ||value == 3) && data?.data?.data?.paymentLink) {
        Linking.canOpenURL(data?.data?.data?.paymentLink).then(supported => {
          if (supported) {
            Linking.openURL(data?.data?.data?.paymentLink);
          } else {
            // console.log("Don't know how to open URI: " + data?.data?.data?.paymentLink);
          }
        });
        return
      }
    } catch (error) {
      // console.log("handleCheck ~ error:", error)
      
    }
  }

  return (
    <View>
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text>Trạng thái đơn hàng</Text>
      </View>
      <View>
        {[{ title: 'COD', value: '1' }, { title: 'POS', value: '2' },{ title: 'VNPay', value: '3' }, { title: 'Banktransfer', value: '4' }].map(item => {
          return (
            <View key={item.value}>
              <TouchableOpacity 
                onPress={() => handleCheck(item.value)}
              >
                <Text>{item.title}</Text>
              </TouchableOpacity>
            </View>
          )
        })}
      </View>
  </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop:30,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    marginLeft: 12,
    fontSize: 16,
    fontWeight: "600",
    color: "#333333",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  orderList: {
    paddingVertical: 12,
  },
  checkoutButton: {
    backgroundColor: "#FF9900",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 16,
    marginTop: 12,
    alignSelf: 'flex-start',
  },
  checkoutText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333333",
    marginBottom: 16,
    textAlign: "center",
  },
  closeIcon: {
    position: "absolute",
    top: 16,
    right: 16,
    zIndex: 1,
  },
  productName: {
    fontSize: 14,
    color: "#666666",
    textAlign: "center",
  },
  errorText: {
    fontSize: 14,
    color: "#FF0000",
    textAlign: "center",
    marginTop: 20,
  },
});

export default SelectPayment;