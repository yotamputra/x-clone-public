import { gql, useMutation } from "@apollo/client";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import {
  Text,
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Keyboard,
} from "react-native";

const ADD_COMMENT = gql`
  mutation AddComment($content: String, $id: ID) {
    addComment(content: $content, _id: $id)
  }
`;

export default function AddComment({ route }) {
  const navigation = useNavigation();

  const { _id } = route.params;
  // console.log(_id);
  const [comment, setComment] = useState("");

  const [addComment, { loading }] = useMutation(ADD_COMMENT, {
    refetchQueries: ["GetPosts"],
  });

  const handleComment = async () => {
    try {
      const result = await addComment({
        variables: {
          content: comment,
          id: _id,
        },
      });

      setComment("");
      Keyboard.dismiss();

      navigation.goBack();

      console.log(result);
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
      <TextInput
        style={styles.input}
        placeholder="Post your reply"
        placeholderTextColor="#aaa"
        multiline
        numberOfLines={4}
        value={comment}
        onChangeText={setComment}
      />

      <TouchableOpacity style={styles.button} onPress={handleComment}>
        <Text style={styles.buttonText}>Post</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "black",
  },
  input: {
    backgroundColor: "#333",
    color: "white",
    borderRadius: 5,
    marginBottom: 15,
    padding: 10,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#1DA1F2",
    borderRadius: 5,
    padding: 15,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
  },
});
