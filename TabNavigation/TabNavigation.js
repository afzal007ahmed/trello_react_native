import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Boards from "../TabScreens/Boards";
import Profile from "../TabScreens/Profile";
import { Ionicons } from '@expo/vector-icons';


const TabNavigation = () => {
  const tab = createBottomTabNavigator();

  return (
    <tab.Navigator screenOptions={{
        headerStyle : {
            backgroundColor : "#232429"
        },
        headerTitleStyle : {
            color : "white"
        },
        tabBarStyle : {
            backgroundColor : "black",
            height:70
        },
        sceneStyle : {
            backgroundColor : "black"
        },
        tabBarItemStyle : {
            paddingVertical : 10 
        }
    }}>
      <tab.Screen name="boardsTab" component={Boards} options={{
        tabBarIcon : ({ color , size , focused } ) => <Ionicons name="layers" color={focused ? color : "grey"} size={20}/>,
        headerShown : false
      }} />
      <tab.Screen name="profile" component={Profile} options={{
         tabBarIcon : ({ color , size , focused } ) => <Ionicons name="person" color={focused ? color : "grey"} size={20} /> ,
         title : "Profile" ,
         tabBarLabel : "My Profile"
          
      }} />
    </tab.Navigator>
  );
};

export default TabNavigation;
