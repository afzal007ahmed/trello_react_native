import { Ionicons } from "@expo/vector-icons";
import {
  Button,
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

const ColorModal = ({ details, setDetails, open, setOpen }) => {
  const boardColors = [
    "blue",
    "green",
    "orange",
    "purple",
    "red",
    "lime",
    "pink",
    "black",
  ];

  return (
    <Modal
      visible={open}
      onRequestClose={() => setOpen(false)}
      style={{ flex: 1 }}
      animationType="slide"
    >
      <View style={styles.modal}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Text style={styles.title}>Background Colors</Text>
          <Pressable onPress={() => setOpen(false)}>
            <Ionicons name="close" color="white" size={25} />
          </Pressable>
        </View>
        <View style={{ flex: 1, justifyContent: "space-between" }}>
          <FlatList
            data={boardColors}
            style={{}}
            renderItem={({ item }) => (
              <Pressable
                style={[
                  styles.box,
                  {
                    backgroundColor: item,
                    borderWidth: details.color === item ? 3 : 0,
                    borderColor: details.color === item ? "white" : "black",
                  },
                ]}
                onPress={() => {
                  setDetails((prev) => ({ ...prev, color: item }));
                  setOpen(false);
                }}
              ></Pressable>
            )}
            keyExtractor={(item) => item}
            ItemSeparatorComponent={() => (
              <View style={styles.seperator}></View>
            )}
          />
        </View>
      </View>
    </Modal>
  );
};

export default ColorModal;

const styles = StyleSheet.create({
  modal: {
    backgroundColor: "#232429",
    flex: 1,
    padding: 20,
  },
  title: {
    color: "white",
    fontWeight: 700,
    fontSize: 20,
    marginVertical: 20,
  },
  box: {
    width: "100%",
    height: 80,
    borderRadius: 10,
  },
  seperator: {
    height: 20,
  },
});
