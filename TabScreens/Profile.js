import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import {
  profileFailed,
  profileLoading,
  profileReset,
  profileSuccess,
} from "../redux/profileSlice";
import { ENV } from "../config";
import {
  ActivityIndicator,
  StyleSheet,
  View,
  ImageBackground,
  Text,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";

const Profile = () => {
  const profileDetails = useSelector((state) => state.profileReducer);
  const data = profileDetails.data;
  const dispatch = useDispatch();
  const fetchDetails = useCallback(async () => {
    try {
      dispatch(profileLoading());
      const response = await axios.get(
        `${ENV.API_PROFILE}?key=${ENV.API_KEY}&token=${ENV.API_TOKEN}`
      );
      dispatch(profileSuccess(response.data));
    } catch (error) {
      dispatch(profileFailed(error.message));
    }
  }, [dispatch]);

  const fetchReference = useCallback(() => {
    fetchDetails();
    return () => {
        dispatch(profileReset())
    }
  }, []);

  useFocusEffect(fetchReference);

  return (
    <View style={style.container}>
      {profileDetails.loading && (
        <View style={style.loadingContainer}>
          <ActivityIndicator size={40} color="white" />
        </View>
      )}
      {profileDetails.error && <View style={style.errorMessageContainer}>
          <Text></Text>
        </View>}
      {data && (
        <View style={style.profileContainer}>
          <View>
            {data.avatarUrl && (
              <ImageBackground
                source={`url(${data?.avatarUrl})`}
                resizeMode="cover"
              />
            )}
            {data.initials && (
              <Text style={style.initials}>{data.initials}</Text>
            )}
          </View>
          <View>
            <Text style={style.name}>{data.fullName}</Text>
            <Text style={style.user}>@{data.username}</Text>
            <Text style={style.email}>{data.email}</Text>
          </View>
        </View>
      )}
    </View>
  );
};

export default Profile;

const style = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  profileContainer: {
    alignItems: "center",
    flexDirection: "row",
    gap: 15,
    backgroundColor: "#232429",
    padding: 20,
    borderRadius: 10,
  },
  initials: {
    color: "white",
    fontSize: 30,
    fontWeight: 700,
    padding: 10,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1abc9c",
  },
  name: {
    fontWeight: 500,
    color: "white",
    fontSize: 18,
  },
  user: {
    color: "grey",
  },
  email: {
    color: "grey",
  },
  errorMessageContainer:{
   flex : 1 ,
   justifyContent : "center" ,
   alignItems : "center"
  },
  errorMessage : {
    color : "red" ,
    fontWeight : 700 ,
    fontSize : 20
  }
});
