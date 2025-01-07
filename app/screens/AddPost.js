import { gql, useMutation } from "@apollo/client";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import {
  Text,
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Keyboard,
  Alert,
  ActivityIndicator,
} from "react-native";

const ADD_POST = gql`
  mutation AddPost($content: String, $imgUrl: String, $tags: [String]) {
    addPost(content: $content, imgUrl: $imgUrl, tags: $tags) {
      _id
      authorId
      content
      createdAt
      imgUrl
      updatedAt
      tags
      likes {
        updatedAt
        username
      }
      comments {
        content
        updatedAt
        username
      }
    }
  }
`;

export default function AddPost() {
  const navigation = useNavigation();

  const [content, setContent] = useState("");
  const [imgUrl, setImgUrl] = useState("");
  const [tags, setTags] = useState("");

  const [addPost, { loading }] = useMutation(ADD_POST, {
    refetchQueries: ["GetPosts"],
  });

  const handlePost = async () => {
    try {
      const result = await addPost({
        variables: {
          content: content,
          tags: [tags],
          imgUrl: imgUrl,
        },
      });

      setContent("");
      setTags("");
      setImgUrl("");
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
        placeholder="What's happening?"
        placeholderTextColor="#aaa"
        multiline
        numberOfLines={4}
        value={content}
        onChangeText={setContent}
      />

      <TextInput
        style={styles.input}
        placeholder="Tags"
        placeholderTextColor="#aaa"
        value={tags}
        onChangeText={setTags}
      />

      <TextInput
        style={styles.input}
        placeholder="Image URL (optional)"
        placeholderTextColor="#aaa"
        value={imgUrl}
        onChangeText={setImgUrl}
      />

      <TouchableOpacity style={styles.button} onPress={handlePost}>
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
  header: {
    color: "white",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
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
    marginTop: 20,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
  },
});
