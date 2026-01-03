import { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import {
  boardsFailed,
  boardsLoading,
  boardsReset,
  boardsSuccess,
} from "../redux/boardsSlice";
import axios from "axios";
import { ENV } from "../config";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { archiveBoard } from "../services/archiveBoard";

const BoardsScreen = ({ navigation }) => {
  const boards = useSelector((state) => state.boardsReducer);
  const [refresh, setRefresh] = useState(false);
  const dispatch = useDispatch();
  const data = useMemo(() => {
    if (!boards.data) {
      return null;
    }
    const map = {};
    for (let i of boards.data) {
      if (!map[i.organization.id]) {
        map[i.organization.id] = [];
      }
      if (!i.closed) {
        map[i.organization.id].push(i);
      }
    }
    return map;
  }, [boards.data]);

  const workspaceMap = useMemo(() => {
    if (!boards.data) {
      return null;
    }
    const obj = {};
    for (let i of boards.data) {
      if (!obj[i.organization.id]) {
        obj[i.organization.id] = i.organization.displayName;
      }
    }
    return obj;
  }, [boards.data]);

  const fetchBoards = useCallback(async () => {
    try {
      dispatch(boardsLoading());
      const response = await axios.get(
        ENV.API_BOARDS +
          "?" +
          `organization=true&key=${ENV.API_KEY}&token=${ENV.API_TOKEN}`
      );
      dispatch(boardsSuccess(response.data));
    } catch (error) {
      dispatch(boardsFailed(error.message));
    }
  }, [dispatch]);

  const fetchHandler = useCallback(() => {
    fetchBoards();
    return () => {
      dispatch(boardsReset());
    };
  }, [dispatch]);
 
  async function handleArchive( id ){
    try {
       await archiveBoard( id ) ;
       fetchBoards() ;
    } catch (error) {
      Alert.alert("Archive Status" , error?.response?.data?.message || error.message ) ; 
    }
  }

  useFocusEffect(fetchHandler);

  return (
    <View style={style.container}>
      {boards.loading && (
        <View style={style.loadingContainer}>
          <ActivityIndicator size="large" />
        </View>
      )}
      {data && !boards.loading && (
        <FlatList
          style={{ flex: 1 }}
          data={Object.entries(data)}
          renderItem={({ item: [key, value] }) => (
            <View style={style.boardsContainer}>
              <Text style={style.workspaceHeader}>{workspaceMap[key]}</Text>
              <FlatList
                data={value}
                style={style.flat}
                renderItem={({ item }) => (
                  <Pressable
                    style={style.boardContainer}
                    onLongPress={() => { Alert.alert(`Archive Board : ${item.name}`,null, [{ text : "Archive" , onPress : () => handleArchive(item.id)} , { text : "Close"}])}}
                    onPress={() => {
                      navigation.navigate("board", {
                        name: item.name,
                        id: item.id,
                        headColor : item.prefs.background,
                        backgroundColor : item.prefs.backgroundColor
                      });
                    }}
                  >
                    <View
                      style={[
                        style.board,
                        { backgroundColor: item.prefs.backgroundColor },
                      ]}
                    >
                      {item.prefs.backgroundImage && (
                        <ImageBackground
                          source={{ uri: item.prefs.backgroundImage }}
                          style={[style.board]}
                          imageStyle={{ resizeMode: "cover" }}
                        />
                      )}
                    </View>
                    <Text style={style.boardName}>{item.name}</Text>
                  </Pressable>
                )}
                keyExtractor={(item) => item.id}
                ItemSeparatorComponent={() => (
                  <View style={style.seperator}></View>
                )}
                ListHeaderComponent={() => (
                  <View style={style.seperator}></View>
                )}
                ListFooterComponent={() => (
                  <View style={style.seperator}></View>
                )}
              />
            </View>
          )}
          refreshing={refresh}
          onRefresh={async () => {
            setRefresh(true);
            await fetchBoards();
            setRefresh(false);
          }}
          keyExtractor={(item) => item[0]}
        />
      )}
      <Pressable
        onPress={() => navigation.navigate("addBoard")}
        style={style.addBoardContainer}
      >
        <Ionicons name="add" size={30} color={"white"} />
        <Text style={style.addBoardContainerText}> Create Board</Text>
      </Pressable>
    </View>
  );
};

export default BoardsScreen;

const style = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  workspaceHeader: {
    fontWeight: 700,
    color: "white",
    paddingHorizontal: 30,
    paddingVertical: 10,
    fontSize: 12,
  },
  boardsContainer: {
    marginTop: 20,
  },
  boardContainer: {
    paddingVertical: 10,
    paddingHorizontal: 30,
    flexDirection: "row",
    gap: 15,
    alignItems: "center",
  },
  boardName: {
    color: "white",
    fontWeight: 700,
  },
  seperator: {
    height: 5,
  },
  board: {
    height: 40,
    width: 60,
    borderRadius: 6,
  },
  flat: {
    backgroundColor: "#232429",
    flex: 1,
  },
  addBoardContainer: {
    backgroundColor: "#6146cdfc",
    width: 150,
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 10,
    position: "absolute",
    justifyContent: "center",
    bottom: 10,
    right: 10,
  },
  addBoardContainerText: {
    fontSize: 15,
    fontWeight: 700,
    color: "white",
  },
});
