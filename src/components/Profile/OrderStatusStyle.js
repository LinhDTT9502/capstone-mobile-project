import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  orderSection: {
    backgroundColor: "#FFF",
    padding: 20,
    marginBottom: 16,
    borderRadius: 12,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 16,
    borderBottomWidth: 2,
    borderBottomColor: "#FF9900",
    paddingBottom: 8,
  },
  statusMenu: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  statusButton: {
    alignItems: "center",
    width: "22%",
  },
  iconContainer: {
    backgroundColor: "#FF9900",
    borderRadius: 30,
    width: 56,
    height: 56,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  statusText: {
    fontSize: 12,
    color: "#333",
    textAlign: "center",
    fontWeight: "600",
  },
  viewAllOrders: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
    marginTop: 8,
  },
  viewAllOrdersText: {
    fontSize: 16,
    color: "#FF9900",
    fontWeight: "bold",
  },
});

export default styles;

