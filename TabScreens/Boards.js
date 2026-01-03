import { createNativeStackNavigator } from "@react-navigation/native-stack"
import BoardsScreen from "../StackScreens/BoardsScreen";
import Header from "../components/Header";
import AddBoard from "../StackScreens/AddBoard";
import Board from "../StackScreens/Board";


const Boards = () => {
    const stack = createNativeStackNavigator() ;
  return (
    <stack.Navigator screenOptions={{
         contentStyle : {
            backgroundColor : "black",
         },
         headerTitleStyle : {
            color : "white"
         }
        
    }}>
        <stack.Screen name="boardsScreen" component={BoardsScreen} options={{
            header : () => <Header title="Boards" />
        }} />
        <stack.Screen  name="addBoard" component={AddBoard} options={{
            header : () => <Header title="Add Board" />
        }} /> 
        <stack.Screen name="board" component={Board} options={{ 
          headerShown : false
        }}/>
    </stack.Navigator>
  )
}

export default Boards

