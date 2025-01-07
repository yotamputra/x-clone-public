import { gql, useMutation } from "@apollo/client";
import { useNavigation } from "@react-navigation/native";
import { use, useState } from "react";
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  Keyboard,
} from "react-native";

const REGISTER = gql`
  mutation Register(
    $name: String
    $username: String
    $email: String
    $password: String
  ) {
    register(
      name: $name
      username: $username
      email: $email
      password: $password
    ) {
      email
      name
      username
      _id
    }
  }
`;

export default function RegisterScreen() {
  const navigation = useNavigation();

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [register, { loading }] = useMutation(REGISTER);

  const handleRegister = async () => {
    if (!name || !username || !email || !password) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    try {
      const result = await register({
        variables: {
          name: name,
          username: username,
          email: email,
          password: password,
        },
      });

      setName("");
      setUsername("");
      setEmail("");
      setPassword("");
      Keyboard.dismiss();

      navigation.navigate("Login");

      console.log(result);
    } catch (err) {
      console.log(err);
      Alert.alert("Error", err.message);
    }
  };

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
        placeholder="Name"
        placeholderTextColor="#aaa"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={styles.input}
        placeholder="Username"
        placeholderTextColor="#aaa"
        value={username}
        onChangeText={setUsername}
      />

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#aaa"
        keyboardType="email-address"
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

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.loginButton}
        onPress={() => {
          navigation.navigate("Login");
        }}
      >
        <Text style={styles.loginText}>Have an account? Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#000",
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
  loginButton: {
    marginTop: 20,
  },
  loginText: {
    color: "#1DA1F2",
    fontSize: 16,
  },
});
