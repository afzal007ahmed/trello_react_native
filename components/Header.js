import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Pressable, StyleSheet, Text, View } from "react-native";

const Header = ({ title , color = "#232429"}) => {
  const nav = useNavigation();
  return (
    <View style={[styles.headerContainer , { backgroundColor : color}]}>
      {nav.canGoBack() && (
        <Pressable onPress={() => nav.goBack()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </Pressable>
      )}
      <Text style={styles.header}>{title}</Text>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  header: {
    color: "white",
    fontSize: 20,
    fontWeight: 500,
  },
  headerContainer: {
    padding: 18,
    flexDirection: "row",
    gap: 10,
  },
});
