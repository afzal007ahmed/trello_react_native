import { NavigationContainer } from "@react-navigation/native";
import { StyleSheet, Text, View } from "react-native";
import TabNavigation from "./TabNavigation/TabNavigation";
import { SafeAreaView } from "react-native-safe-area-context";
import { Provider } from "react-redux";
import { store } from "./store";
import { StatusBar } from "react-native";

export default function App() {

  return (
    <Provider store={store}>
      <SafeAreaView style={styles.container}>
        <StatusBar backgroundColor="#232429" barStyle="light-content" />
        <View style={styles.container}>
          <NavigationContainer>
            <TabNavigation />
          </NavigationContainer>
        </View>
      </SafeAreaView>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
