import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Alert,
  View,
  FlatList,
  StyleSheet,
  Text,
  ActivityIndicator,
  Pressable,
  TextInput,
  BackHandler,
} from "react-native";
import Header from "../components/Header";
import axios from "axios";
import { ENV } from "../config";
import { useFocusEffect } from "@react-navigation/native";
import Checkbox from "expo-checkbox";
import { Ionicons } from "@expo/vector-icons";
import { checkCard } from "../services/checkCard";
import { archiveList } from "../services/archiveList";
import AddList from "../components/AddList";
import CardDetails from "../components/CardDetails";
import { changeCardName } from "../services/changeCardName";

const Board = ({ route, navigation }) => {
  const [selected, setSelected] = useState(false);
  const [cardLoading, setCardLoading] = useState(false);
  const cardId = useRef(null);
  const [open, setOpen] = useState(false);
  const { name, id, headColor, backgroundColor } = route.params;
  const [addId, setAddId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cardName, setCardName] = useState("");
  const [updatedListName, setUpatedListName] = useState(null);
  const [updateListId, setUpdateListId] = useState(null);
  const [cards, setCards] = useState(null);
  const ref = useRef([]);
  const currentRef = useRef(null);
  const [lists, setLists] = useState({
    loading: false,
    data: null,
  });

  const data = useMemo(() => {
    if (!lists.data) return [];
    return lists.data.filter((item) => !item.closed);
  }, [lists.data]);

  const addCard = async () => {
    try {
      const body = {
        idList: addId,
        name: cardName,
      };
      await axios.post(
        ENV.API_CREATE_CARD + `?key=${ENV.API_KEY}&token=${ENV.API_TOKEN}`,
        body
      );
      setCardName("");
      setLoading(false);
      fetchCards();
    } catch (error) {
      Alert.alert(
        "Adding Card Status",
        error?.response?.data?.message || error.message
      );
      setLoading(false);
    }
  };

  const fetchCards = useCallback(() => {
    try {
      setCardLoading(true);
      const arr = [];
      lists.data.map((item) =>
        arr.push(
          axios.get(
            ENV.API_GET_CARDS(item.id) +
              `?key=${ENV.API_KEY}&token=${ENV.API_TOKEN}`
          )
        )
      );
      const ListCardMap = {};
      Promise.all(arr).then((res) => {
        res.map(({ data }) => {
          data.map((item) => {
            if (!ListCardMap[item.idList]) {
              ListCardMap[item.idList] = [];
            }
            ListCardMap[item.idList].push(item);
          });
        });
        setCards(ListCardMap);
        setCardLoading(false);
      });
    } catch (error) {
      setCardLoading(false);
      Alert.alert(
        "Fetching Cards",
        error.response?.data?.message || error.message
      );
    }
  }, [lists.data]);

  useEffect(() => {
    if (lists.data) {
      fetchCards();
    }
  }, [lists.data]);

  const updateListName = async (id) => {
    try {
      currentRef.current?.blur();
      await changeCardName(id, updatedListName);
      fetchLists();
      currentRef.current = null;
      setUpatedListName(null);
      setUpdateListId(null);
    } catch (error) {
      currentRef.current?.blur();
      currentRef.current = null;
      setUpatedListName(null);
      setUpdateListId(null);
      Alert.alert(
        "Error",
        error.response?.data?.message || error.message
      );
    }
  };
  const fetchLists = useCallback(
    async function () {
      try {
        setLists((prev) => ({ ...prev, loading: true }));
        const response = await axios.get(
          ENV.API_GET_LISTS(id) + `?key=${ENV.API_KEY}&token=${ENV.API_TOKEN}`
        );
        setLists((prev) => ({ ...prev, loading: false, data: response.data }));
      } catch (error) {
        setLists((prev) => ({ ...prev, loading: false }));
        Alert.alert(
          "Lists Fetching",
          error.response?.data?.message || error.message
        );
      }
    },
    [id]
  );

  const fetchHandler = useCallback(function () {
    fetchLists();
    return () => {
      setLists((prev) => ({ ...prev, data: null, loading: false }));
    };
  }, []);

  useFocusEffect(fetchHandler);

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        if (addId) {
          setAddId(null);
          return true;
        }
        if (selected) {
          setSelected(false);
          return true;
        }
        if (updateListId) {
          currentRef.current?.blur();
          setUpdateListId(null);
          setUpatedListName(null);
          currentRef.current = null;
          return true;
        }

        return false;
      };
      const subscription = BackHandler.addEventListener(
        "hardwareBackPress",
        onBackPress
      );
      return () => subscription.remove();
    }, [addId, selected, updateListId])
  );

  async function handleCheck(id, value) {
    try {
      await checkCard(id, value);
      fetchCards();
    } catch (error) {
      Alert.alert("Status", error?.response?.data?.message || error.message);
    }
  }
  async function handleArchiveList(id) {
    try {
      await archiveList(id);
      fetchLists();
    } catch (error) {
      Alert.alert(
        "Archive List Status",
        error?.response?.data?.message || error.message
      );
    }
  }

  const listFooter = useCallback(
    () => (
      <AddList
        BoardId={id}
        selected={selected}
        setSelected={setSelected}
        fetchLists={fetchLists}
      />
    ),
    [id, selected, fetchLists]
  );
  return (
    <View style={{ flex: 1 }}>
      <Header title={name || "NA"} color={headColor} />
      <View style={{ flex: 1, backgroundColor: backgroundColor }}>
        {lists.loading && (
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <ActivityIndicator size="large" color="white" />
          </View>
        )}
        {lists.data && !lists.loading && (
          <FlatList
            contentContainerStyle={{
              alignItems: "flex-start",
              gap: 20,
              padding: 10,
            }}
            data={data}
            renderItem={({ item, index }) => (
              <View style={styles.listContainer}>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <TextInput
                    ref={(el) => {
                      ref.current[index] = el;
                    }}
                    style={[styles.listName, { flex: 1 }]}
                    placeholder="Enter list name..."
                    placeholderTextColor="white"
                    value={
                      updatedListName === null
                        ? item.name
                        : item.id !== updateListId
                        ? item.name
                        : updatedListName
                    }
                    onFocus={() => {
                      currentRef.current = ref.current[index];
                      setUpatedListName(item.name);
                      setUpdateListId(item.id);
                    }}
                    onChangeText={(text) => setUpatedListName(text)}
                    onSubmitEditing={() => {
                      if(!updatedListName.trim().length){
                        return ;
                      }
                      updateListName( item.id )
                    }}
                  />
                  <Pressable
                    style={{
                      backgroundColor: "#232429",
                      paddingHorizontal: 10,
                      paddingVertical: 5,
                      borderRadius: 5,
                    }}
                    onPress={() => {
                      Alert.alert(
                        `Do you want to Archive this list : ${item.name}`,
                        null,
                        [
                          {
                            text: "Archive",
                            onPress: () => {
                              handleArchiveList(item.id);
                            },
                          },
                          { text: "Close" },
                        ]
                      );
                    }}
                  >
                    <Text
                      style={{ fontSize: 10, fontWeight: 700, color: "white" }}
                    >
                      Archive
                    </Text>
                  </Pressable>
                </View>
                <View>
                  {cards && (
                    <FlatList
                      data={cards[item.id]}
                      renderItem={({ item }) => (
                        <Pressable
                          style={{
                            flexDirection: "row",
                            gap: 10,
                            marginTop: 10,
                            paddingVertical: 10,
                            backgroundColor: "#232429",
                            paddingHorizontal: 5,
                            borderRadius: 5,
                          }}
                          onPress={() => {
                            setOpen(true);
                            cardId.current = item.id;
                          }}
                        >
                          <Checkbox
                            style={{ borderRadius: 20 }}
                            value={item.dueComplete}
                            onValueChange={(value) =>
                              handleCheck(item.id, value)
                            }
                          />
                          <Text style={{ color: "white" }}>{item.name}</Text>
                        </Pressable>
                      )}
                      keyExtractor={(item) => item.id}
                    />
                  )}
                  {cardLoading && <ActivityIndicator color="white" />}
                </View>
                {(!addId || addId != item.id) && (
                  <Pressable
                    style={{ marginVertical: 10, flexDirection: "row", gap: 5 }}
                    onPress={() => setAddId(item.id)}
                  >
                    <Ionicons name="add" color="#6495ED" size={20} />
                    <Text style={{ color: "#6495ED", fontWeight: 700 }}>
                      Add Card
                    </Text>
                  </Pressable>
                )}
                <View>
                  {addId && addId === item.id && !loading && (
                    <TextInput
                      placeholder="Enter card name..."
                      returnKeyType="done"
                      onSubmitEditing={() => {
                        if (cardName.trim().length !== 0) {
                          setLoading(true);
                          addCard();
                        }
                      }}
                      style={{
                        backgroundColor: "#232429",
                        color: "white",
                        borderRadius: 5,
                        padding: 10,
                        marginTop: 10,
                      }}
                      autoFocus
                      placeholderTextColor="white"
                      onChangeText={(text) => setCardName(text)}
                      value={cardName}
                    />
                  )}
                  {loading && (
                    <ActivityIndicator
                      size="small"
                      color="white"
                      style={{ padding: 10 }}
                    />
                  )}
                </View>
              </View>
            )}
            ListFooterComponent={listFooter}
            horizontal={true}
            keyExtractor={(item) => item.id}
          />
        )}
      </View>
      <CardDetails
        open={open}
        setOpen={setOpen}
        id={cardId.current}
        handleCheck={handleCheck}
        fetchLists={fetchLists}
      />
    </View>
  );
};

export default Board;

const styles = StyleSheet.create({
  listContainer: {
    padding: 10,
    backgroundColor: "black",
    minWidth: 250,
    borderRadius: 5,
  },
  listName: {
    color: "white",
    fontWeight: 700,
  },
});
