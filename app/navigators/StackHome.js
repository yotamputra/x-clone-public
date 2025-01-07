import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AddPost from "../screens/AddPost";
import DetailedScreen from "../screens/DetailedScreen";
import HomeScreen from "../screens/HomeScreen";
import { Image } from "react-native";
import AddComment from "../screens/AddComment";

const Stack = createNativeStackNavigator();

export default function StackHome() {
  function LogoTitle() {
    return (
      <Image
        style={{ width: 45, height: 45, marginRight: 20 }}
        source={{
          uri: "https://img.freepik.com/free-vector/new-2023-twitter-logo-x-icon-design_1017-45418.jpg",
        }}
      />
    );
  }

  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerStyle: {
          backgroundColor: "black",
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "bold",
        },
        contentStyle: {
          backgroundColor: "black",
          padding: 10,
        },
        headerRight: (props) => <LogoTitle {...props} />,
      }}
    >
      <Stack.Screen name="AddPost" component={AddPost} />
      <Stack.Screen
        name="AddComment"
        component={AddComment}
        options={{ title: "Add Comment" }}
      />
      <Stack.Screen
        name="Detailed"
        component={DetailedScreen}
        options={{ title: "Post" }}
      />
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerLeft: () => <LogoTitle />,
          headerRight: () => <></>,
        }}
      />
    </Stack.Navigator>
  );
}
