import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Button,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import axios from "axios";
import { ENV } from "../config";
import { useFocusEffect } from "@react-navigation/native";
import { Picker } from "@react-native-picker/picker";
import ColorModal from "../components/ColorModal";

const AddBoard = ({ navigation }) => {
  const [totalBoards, setTotalBoards] = useState(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [details, setDetails] = useState({
    workspace: "",
    boardName: "",
    visibility: "org",
    color: "blue",
  });
  const disable =
    details.boardName.trim().length === 0 ||
    details.workspace.trim().length === 0;
  const [workspaces, setWorkspaces] = useState({
    loading: false,
    data: null,
    error: null,
  });

  const addBoard = async () => {
    try {
      setLoading(true);
      const body = {
        name: details.boardName,
        idOrganization: details.workspace,
        prefs_permissionLevel: details.visibility,
        prefs_background: details.color,
      };
      await axios.post(
        ENV.API_ADD_BOARD + "?" + `key=${ENV.API_KEY}&token=${ENV.API_TOKEN}` , body
      );
      setLoading( false) ;
      Alert.alert("Adding Board Status" , "Success") ;
      navigation.navigate("boardsScreen")
    } catch (error) {
      setLoading( false ) ;
      Alert.alert("Adding Board Status" , error.response.data.message || error.message ) ;
    }
  };

  const fetchBoardBalance = () => {
    try {
      if (!workspaces.data) return;
      const arr = [];
      if (workspaces.data) {
        for (let i of workspaces.data) {
          arr.push(
            axios.get(
              ENV.API_BOARDS_COUNT +
                `/${i.id}/boards?key=${ENV.API_KEY}&token=${ENV.API_TOKEN}`
            )
          );
        }
        Promise.all(arr).then((res) => {
          const map = {};
          res.map(({ data }) => {
            if (data.length === 0) {
              return;
            }
            const length = data.reduce((first, second) => {
              if (!second.closed) {
                first++;
              }
              return first;
            }, 0);
            map[data[0].idOrganization] = length;
          });
          setTotalBoards(map);
        });
      }
    } catch (error) {
      Alert.alert("Boards Fetch Status" , error.message ) ;
    }
  };
  const fetchWorkspace = useCallback(async () => {
    try {
      setWorkspaces((prev) => ({ ...prev, loading: true }));
      const response = await axios.get(
        ENV.API_WORKSPACES + "?" + `key=${ENV.API_KEY}&token=${ENV.API_TOKEN}`
      );
      setDetails((prev) => ({
        ...prev,
        workspace: response.data ? response.data[0].id : "",
      }));
      setWorkspaces((prev) => ({
        ...prev,
        loading: false,
        data: response.data,
        error: null,
      }));
    } catch (error) {
      setWorkspaces((prev) => ({
        ...prev,
        loading: false,
        error: error.message,
      }));
    }
  }, []);

  const fetchHandler = useCallback(() => {
    fetchWorkspace();
    return () => {
      setWorkspaces((prev) => ({ ...prev, data: null, error: null }));
      setTotalBoards(null);
    };
  }, []);

  useFocusEffect(fetchHandler);
  useEffect(() => {
    if (workspaces.data) {
      fetchBoardBalance();
    }
  }, [workspaces.data]);

  const picker = useMemo(() => {
    if (!workspaces.data) return null;
    let arr = [];

    arr = workspaces.data.map((item) => {
      return (
        <Picker.Item label={item.displayName} value={item.id} key={item.id} />
      );
    });

    return arr;
  }, [workspaces.data, totalBoards]);

  return (
    <>
      <View style={style.container}>
        <View>
          {workspaces.loading && !workspaces.data && (
            <View style={style.loadingContainer}>
              <ActivityIndicator size="large" />
            </View>
          )}
          {workspaces.data && (
            <>
              <View style={style.boardName}>
                <Text style={style.label}>Board name</Text>
                <TextInput
                  style={style.input}
                  autoFocus
                  onChangeText={(value) =>
                    setDetails((prev) => ({ ...prev, boardName: value }))
                  }
                  value={details.boardName}
                />
              </View>
              <Text style={style.workspaceTitle}>Workspace</Text>
              {details.workspace && (
                <>
                  <View style={style.pickerViewContainer}>
                    <Picker
                      selectedValue={details.workspace}
                      style={style.pickerContainer}
                      onValueChange={(value) =>
                        setDetails((prev) => ({ ...prev, workspace: value }))
                      }
                      dropdownIconColor="white"
                    >
                      {picker}
                    </Picker>
                  </View>
                  {totalBoards && (
                    <Text style={style.boardsRemaining}>
                      {10 - totalBoards[details.workspace]}{" "}
                      {10 - totalBoards[details.workspace] > 1
                        ? "Boards"
                        : "Board"}{" "}
                      remaining
                    </Text>
                  )}
                </>
              )}
              <Text style={style.visibilityHeading}>Visibility</Text>
              <View style={[style.pickerViewContainer]}>
                <Picker
                  selectedValue={details.visibility}
                  dropdownIconColor="white"
                  onValueChange={(value) =>
                    setDetails((prev) => ({ ...prev, visibility: value }))
                  }
                  style={style.visibilityContainer}
                >
                  <Picker.Item value="private" label="Private" />
                  <Picker.Item value="org" label="Workspace" />
                  <Picker.Item value="public" label="Public" />
                </Picker>
              </View>
              <Pressable
                style={style.backgroundContainer}
                onPress={() => setOpen(true)}
              >
                <Text style={style.backgroundTitle}>Board Background</Text>
                <View
                  style={[style.colorBox, { backgroundColor: details.color }]}
                ></View>
              </Pressable>
            </>
          )}
        </View>
        <Pressable
        onPress={addBoard}
          style={[style.btn, { backgroundColor: disable ? "grey" : "#6495ED" }]}
        >
          { loading ? <ActivityIndicator size="small" color="white"/>:<Text style={{ color: disable ? "black" : "white", fontWeight: 700 }}>
            Create Board
          </Text>}
        </Pressable>
      </View>
      <ColorModal
        details={details}
        setDetails={setDetails}
        open={open}
        setOpen={setOpen}
      />
    </>
  );
};

export default AddBoard;

const style = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#232429",
    flex: 1,
    justifyContent: "space-between",
  },
  input: {
    borderBottomColor: "#6495ED",
    borderBottomWidth: 2,
    marginTop: 5,
    paddingHorizontal: 20,
    color: "white",
  },
  label: {
    color: "white",
    fontSize: 11,
    marginLeft: 20,
    marginTop: 5,
    color: "#6495ED",
    fontWeight: 700,
  },
  boardName: {
    backgroundColor: "black",
    borderRadius: 5,
    padding: 2,
  },
  workspaceTitle: {
    color: "#6495ED",
    marginTop: 20,
    fontSize: 11,
    fontWeight: 700,
  },
  pickerContainer: {
    color: "white",
    margin: 0,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  pickerViewContainer: {
    borderBottomColor: "white",
    borderBottomWidth: 1,
    marginHorizontal: 5,
  },
  visibilityContainer: {
    color: "white",
  },
  visibilityHeading: {
    marginTop: 20,
    color: "#6495ED",
    fontSize: 11,
  },
  boardsRemaining: {
    color: "white",
    fontWeight: 700,
    marginVertical: 5,
    fontSize: 10,
    paddingLeft: 10,
  },
  btn: {
    padding: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  backgroundContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    paddingLeft: 10,
    alignItems: "center",
  },
  colorBox: {
    height: 40,
    width: 40,
    backgroundColor: "blue",
    borderRadius: 5,
  },
  backgroundTitle: {
    color: "white",
  },
});
