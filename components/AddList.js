import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import React, { useCallback,useRef,useState } from "react";
import { Alert, Pressable, Text, TextInput, View } from "react-native";
import { ENV } from "../config";

const AddList = ({ BoardId, selected, setSelected, fetchLists }) => {
  const [name, setName] = useState("");
  const ref = useRef(null) ;


  const addList = useCallback(async () => {
    try {
      const body = {
        name: name,
        idBoard: BoardId,
      };
      await axios.post(
        ENV.API_ADD_LIST + `?key=${ENV.API_KEY}&token=${ENV.API_TOKEN}`,
        body
      );
      fetchLists();
    } catch (error) {
      Alert.alert(
        "Add lists status",
        error?.response?.data?.message || error.message
      );
    }
  }, [name , BoardId , fetchLists ]);

  return !selected ? (
    <Pressable
      style={{
        backgroundColor: "black",
        minWidth: 250,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 5,
        flexDirection: "row",
        gap: 10,
        alignItems: "center",
      }}
      onPress={() => setSelected(true)}
    >
      <Ionicons name="add" size={25} color="#6495ED" />
      <Text style={{ color: "#6495ED", fontWeight: 700 }}>Add List</Text>
    </Pressable>
  ) : (
    <View
      style={{
        backgroundColor: "black",
        minWidth: 250,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 5,
      }}
    >
      <TextInput
      ref={ref}
        value={name}
        autoFocus={true}
        onChangeText={(text) => setName(text)}
        placeholder="Enter list name..."
        placeholderTextColor="white"
        style={{
          borderBottomColor: "white",
          borderBottomWidth: 1,
          marginVertical: 10,
          backgroundColor: "#232429",
          color: "white",
          borderRadius: 5,
        }}
        returnKeyType="done"
        onSubmitEditing={async() => {
          if (name.trim().length === 0) return;
          await addList() ;
          setName("") ;
          setSelected( false ) ;
        }}
      />
    </View>
  );
};

export default React.memo(AddList);
