import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { cardDetails } from "../services/cardDetails";
import Checkbox from "expo-checkbox";
import { Ionicons } from "@expo/vector-icons";
import { createCheckItem } from "../services/createCheckItem";
import { changeItemState } from "../services/changeItemState";
import { deleteCheckList } from "../services/deleteCheckList";
import { changeChecklistName } from "../services/changeChecklistName";
import { createChecklist } from "../services/createChecklist";
import { changeCardName } from "../services/changeCardName";

const CardDetails = ({ open, setOpen, id, handleCheck, fetchLists }) => {
  const [card, setCard] = useState({
    loading: false,
    error: null,
    data: null,
  });
  const [checkListNameUpdateId, setChecklistNameUpdateId] = useState(null);
  const [checkListNewName, setCheckListNewName] = useState("");
  const [checkItemName, setCheckItemName] = useState("");
  const [cardNewName, setCardNewName] = useState(null);
  const [listId, setListId] = useState(null);
  const [editCardName, setEditCardName] = useState(false);
  const currentCheckListRef = useRef(null);
  const currRef = useRef(null);
  const ref = useRef([]);
  const checkListRef = useRef([]);
  const cardNameRef = useRef();
  const cardTemp = useMemo(() => {
    const arr = { ...card };
    if (!card.data) {
      return arr;
    }
    arr.data.checklists = arr.data.checklists.map((item) => {
      const newItem = { ...item };
      newItem.visible = true;
      let count = 0;
      newItem.checkItems = newItem.checkItems.map((list) => {
        if (list.state === "complete") {
          count++;
        }
        return list;
      });
      if (count === newItem.checkItems.length && count != 0) {
        newItem.all = true;
      } else {
        newItem.all = false;
      }
      return newItem;
    });
    return arr;
  }, [card.data]);

  const addChecklist = async () => {
    try {
      await createChecklist(id, "checklist");
      fetchCardDetails();
    } catch (error) {
      Alert.alert("Error", error?.response?.data?.message || error.message);
    }
  };

  const deleteCheckListHandler = async (id, name) => {
    try {
      await deleteCheckList(id);
      fetchCardDetails();
      Alert.alert("Delete checklist status", name + " deleted successfully.");
    } catch (error) {
      Alert.alert("Error", error?.response?.data?.message || error.message);
    }
  };

  const changeState = async (checkItemId, value) => {
    try {
      await changeItemState(id, checkItemId, value);
      fetchCardDetails();
    } catch (error) {
      Alert.alert("Error", error?.response?.data?.message || error.message);
    }
  };

  const updateChecklistName = async () => {
    try {
      await changeChecklistName(checkListNameUpdateId, checkListNewName);
      fetchCardDetails();
      setCheckListNewName(null);
      setChecklistNameUpdateId(null);
    } catch (error) {
      Alert.alert("Error", error?.response?.data?.message || error.message);
    }
  };

  const updateCardName = async () => {
    try {
      await changeCardName(id, cardNewName);
      await fetchCardDetails();
      setCardNewName(null);
    } catch (error) {
      fetchCardDetails();
      setCardNewName(null);
      setEditCardName(false);
      Alert.alert("Error", error?.response?.data?.message || error.message);
    }
  };

  const addCheckItem = async (id) => {
    try {
      await createCheckItem(id, checkItemName);
      fetchCardDetails();
      setCheckItemName("");
      setListId(null);
    } catch (error) {
      setCheckItemName("");
      setListId(null);
      Alert.alert(
        "Error Message",
        error?.response?.data?.message || error.message
      );
    }
  };

  const fetchCardDetails = useCallback(async () => {
    try {
      setCard((prev) => ({ ...prev, loading: true }));
      const response = await cardDetails(id);
      setCard((prev) => ({ ...prev, data: response, loading: false }));
    } catch (error) {
      setCard((prev) => ({
        ...prev,
        loading: false,
        error: error?.response?.data?.message || error.message,
      }));
    }
  }, [id]);

  useEffect(() => {
    if (open) {
      fetchCardDetails(id);
    }
  }, [open, id]);

  const handleCheckChange = async (value) => {
    await handleCheck(id, value);
    fetchCardDetails();
  };

  return (
    <Modal
      visible={open}
      onRequestClose={() => {
        setOpen(false);
        setListId(null);
        setCard((prev) => ({ ...prev, data: null, error: null }));
        setCheckItemName("");
        setListId(null);
        setChecklistNameUpdateId(null);
        setCheckListNewName(null);
        setEditCardName(false);
        setCardNewName(null);
      }}
      animationType="slide"
    >
      <View style={{ backgroundColor: "black", flex: 1 }}>
        {card.loading && !card.data && !card.error && (
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <ActivityIndicator size="large" color="white" />
          </View>
        )}
        {card.data && (
          <View style={{ padding: 20 }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                paddingRight: 10,
              }}
            >
              <View
                style={{ flexDirection: "row", gap: 10, alignItems: "center" }}
              >
                <Checkbox
                  style={{ borderRadius: 30, height: 30, width: 30 }}
                  value={card.data.dueComplete}
                  onValueChange={(value) => {
                    handleCheckChange(value);
                  }}
                />
                <TextInput
                  style={{
                    color: "white",
                    fontWeight: 700,
                    fontSize: 25,
                    flex: 1,
                  }}
                  ref={cardNameRef}
                  value={cardNewName !== null ? cardNewName : card.data.name}
                  onFocus={() => {
                    setEditCardName(true);
                    setCardNewName(card.data.name);
                    setListId(null);
                    setChecklistNameUpdateId(null);
                    setCheckListNewName(null);
                    setCheckItemName(null);
                  }}
                  onChangeText={(text) => setCardNewName(text)}
                  placeholder="Enter Card Name..."
                  placeholderTextColor="white"
                  onSubmitEditing={() => {
                    if (cardNewName.trim().length === 0) {
                      return;
                    }
                    setEditCardName(false);
                    updateCardName();
                  }}
                />
              </View>
              {(listId || checkListNameUpdateId || editCardName) && (
                <Ionicons
                  name="close"
                  color="white"
                  size={25}
                  onPress={() => {
                    if (listId) {
                      setListId(null);
                    }
                    if (checkListNameUpdateId) {
                      currentCheckListRef.current.blur();
                      setChecklistNameUpdateId(null);
                      setCheckListNewName(null);
                    }
                    if (currRef.current) {
                      currRef.current.blur();
                    }
                    if (editCardName) {
                      cardNameRef.current?.blur();
                      setEditCardName(false);
                      setCardNewName(null);
                    }
                  }}
                />
              )}
            </View>
          </View>
        )}
        {card.data && (
          <View style={{ marginTop: 20 }}>
            <Pressable
              onPress={() => addChecklist()}
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                padding: 15,
              }}
            >
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
              >
                <Ionicons name="checkbox" color="white" />
                <Text style={{ color: "white", fontSize: 15, fontWeight: 700 }}>
                  Checklist
                </Text>
              </View>
              <Ionicons name="add" color="white" size={18} />
            </Pressable>
            <View>
              <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                keyboardVerticalOffset={200}
              >
                <FlatList
                  style={{ maxHeight: 550 }}
                  data={cardTemp.data.checklists}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item, index }) => (
                    <View style={{ marginBottom: 10 }}>
                      <Pressable
                        onPress={() => {
                          setChecklistNameUpdateId(item.id);
                          setCheckListNewName(item.name);
                        }}
                        onLongPress={() =>
                          Alert.alert(
                            "Do you want to delete this checklist : " +
                              item.name,
                            null,
                            [
                              {
                                text: "Delete",
                                onPress: () =>
                                  deleteCheckListHandler(item.id, item.name),
                              },
                              {
                                text: "Close",
                              },
                            ]
                          )
                        }
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          backgroundColor: "#232429",
                          padding: 15,
                          alignItems: "center",
                        }}
                      >
                        <TextInput
                          ref={(el) => {
                            checkListRef.current[index] = el;
                          }}
                          onSubmitEditing={() => {
                            if (checkListNewName.trim().length === 0) {
                              return;
                            }
                            updateChecklistName();
                          }}
                          placeholder="Enter checklist name..."
                          onFocus={() => {
                            currentCheckListRef.current =
                              checkListRef.current[index];
                            setEditCardName(false);
                            setCardNewName(null);
                            setCheckItemName(null);
                            setListId(null);
                            setChecklistNameUpdateId(item.id);
                            setCheckListNewName(item.name);
                          }}
                          editable={
                            checkListNameUpdateId &&
                            checkListNameUpdateId === item.id
                          }
                          value={
                            checkListNameUpdateId === item.id
                              ? checkListNewName
                              : item.name
                          }
                          onChangeText={(text) => setCheckListNewName(text)}
                          style={{
                            color: "white",
                            fontWeight: 700,
                            fontSize: 18,
                            flex: 1,
                          }}
                          placeholderTextColor="white"
                        />

                        <Ionicons
                          name={item.visible ? "arrow-up" : "arrow-down"}
                          color="white"
                          size={18}
                          onPress={() => {
                            setCard((prev) => {
                              const obj = { ...prev };
                              obj.data.checklists = obj.data.checklists.map(
                                (list) => {
                                  const newList = { ...list };
                                  if (newList.id === item.id) {
                                    newList.visible = !newList.visible;
                                  }
                                  return newList;
                                }
                              );
                              return obj;
                            });
                          }}
                        />
                      </Pressable>
                      <View
                        style={{
                          borderBottomWidth: 3,
                          borderColor: item.all ? "lightgreen" : "grey",
                        }}
                      ></View>
                      {item.visible && (
                        <FlatList
                          data={item.checkItems}
                          keyExtractor={(item) => item.id}
                          renderItem={({ item }) => (
                            <View
                              style={{
                                flexDirection: "row",
                                alignItems: "center",
                                gap: 10,
                                padding: 20,
                                backgroundColor: "#232429",
                              }}
                            >
                              <Checkbox
                                value={item.state === "complete"}
                                onValueChange={(value) =>
                                  changeState(item.id, value)
                                }
                              />
                              <Text
                                style={{
                                  color: "white",
                                  textDecorationLine:
                                    item.state === "complete"
                                      ? "line-through"
                                      : "none",
                                }}
                              >
                                {item.name}
                              </Text>
                            </View>
                          )}
                        />
                      )}
                      {listId === item.id ? (
                        <TextInput
                          autoFocus={true}
                          ref={(el) => {
                            ref.current[index] = el;
                          }}
                          onFocus={() => {
                            currRef.current = ref.current[index];
                            setEditCardName(false);
                            setCardNewName(null);
                            setCheckListNewName(null);
                            setChecklistNameUpdateId(null);
                          }}
                          value={checkItemName}
                          onChangeText={(text) => setCheckItemName(text)}
                          returnKeyType="done"
                          placeholder="Enter list name..."
                          placeholderTextColor="white"
                          style={{
                            color: "white",
                            padding: 15,
                            paddingLeft: 50,
                            backgroundColor: "#232429",
                          }}
                          onSubmitEditing={() => {
                            if (checkItemName.trim().length === 0) {
                              return;
                            }
                            addCheckItem(item.id);
                          }}
                        />
                      ) : (
                        <Pressable
                          style={{
                            padding: 15,
                            paddingLeft: 50,
                            backgroundColor: "#232429",
                          }}
                          onPress={() => setListId(item.id)}
                        >
                          <Text style={{ color: "white" }}>Add item</Text>
                        </Pressable>
                      )}
                    </View>
                  )}
                />
              </KeyboardAvoidingView>
            </View>
          </View>
        )}
      </View>
    </Modal>
  );
};

export default CardDetails;
