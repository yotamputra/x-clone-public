import { gql, useMutation } from "@apollo/client";
import { useNavigation } from "@react-navigation/native";
import { useContext, useState } from "react";
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  Keyboard,
  ActivityIndicator,
} from "react-native";
import { AuthContext } from "../context/AuthContext";
import * as SecureStore from "expo-secure-store";

const LOGIN = gql`
  mutation Login($email: String, $password: String) {
    login(email: $email, password: $password) {
      accessToken
    }
  }
`;

export default function LoginScreen() {
  const { setIsSignedIn } = useContext(AuthContext);
  const navigation = useNavigation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [login, { loading }] = useMutation(LOGIN);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in both fields.");
      return;
    }

    // console.log(email, password);
    try {
      const result = await login({
        variables: {
          email: email,
          password: password,
        },
      });

      setEmail("");
      setPassword("");
      Keyboard.dismiss();

      setIsSignedIn(true);

      await SecureStore.setItemAsync(
        "accessToken",
        result.data.login.accessToken
      );

      // console.log(result.data.login.accessToken);
    } catch (err) {
      console.log(err);
      Alert.alert("Error", err.message);
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="white" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Image
        style={{
          width: 80,
          height: 80,
          marginBottom: 35,
        }}
        source={{
          uri: "https://img.freepik.com/free-vector/new-2023-twitter-logo-x-icon-design_1017-45418.jpg",
        }}
      />

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#aaa"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#aaa"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.registerButton}
        onPress={() => {
          navigation.navigate("Register");
        }}
      >
        <Text style={styles.registerText}>Don't have an account? Register</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "black",
    padding: 20,
  },
  input: {
    width: "100%",
    backgroundColor: "#333",
    color: "#fff",
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    marginBottom: 15,
  },
  button: {
    backgroundColor: "#1DA1F2",
    borderRadius: 8,
    paddingVertical: 15,
    paddingHorizontal: 40,
    alignItems: "center",
    marginTop: 10,
    width: "100%",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  registerButton: {
    marginTop: 20,
  },
  registerText: {
    color: "#1DA1F2",
    fontSize: 16,
  },
});
