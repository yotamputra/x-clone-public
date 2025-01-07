import { createNativeStackNavigator } from "@react-navigation/native-stack";
import RegisterScreen from "../screens/Register";
import LoginScreen from "../screens/Login";
import TabNav from "./TabNav";
import ProfileUser from "../screens/ProfileUser";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Stack = createNativeStackNavigator();

export default function StackNav() {
  const { isSignedIn } = useContext(AuthContext);

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: "black" },
      }}
    >
      {isSignedIn ? (
        <>
          <Stack.Screen name="Home" component={TabNav} />
          <Stack.Screen name="ProfileUser" component={ProfileUser} />
        </>
      ) : (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}
