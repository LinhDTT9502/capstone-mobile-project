import { NavigationContainer } from "@react-navigation/native"
import MainContainer from "../src/navigations/index"
import { Provider } from "react-redux";
import { store, persistor } from "../src/redux/store";
import { PersistGate } from "redux-persist/integration/react";

export default function Index() {
  return (
    // <NavigationContainer>
    <Provider store={store}>
      <PersistGate persistor={persistor} loading={null}>
    <MainContainer/>
    </PersistGate>
    </Provider>
  // </NavigationContainer>
  );
};
