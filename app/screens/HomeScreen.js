import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Post from "../components/CardPost";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import { gql, useQuery } from "@apollo/client";

const GET_POSTS = gql`
  query GetPosts {
    getPosts {
      _id
      authorId
      content
      createdAt
      imgUrl
      updatedAt
      likes {
        username
        updatedAt
      }
      comments {
        content
        username
        updatedAt
      }
      tags
      authorDetail {
        _id
        email
        name
        username
      }
    }
  }
`;

export default function HomeScreen() {
  const navigation = useNavigation();

  const { loading, error, data } = useQuery(GET_POSTS);
  // console.log({ loading, error, data });
  // console.log(data?.getPosts);

  const handleAddPost = () => {
    navigation.navigate("AddPost");
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="white" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Ionicons name="alert-circle" size={50} color="red" />
        <Text style={{ color: "white", fontSize: 18, marginTop: 10 }}>
          Oops! Something went wrong.
        </Text>
        <Text style={{ color: "gray", fontSize: 14, marginTop: 5 }}>
          {error.message}
        </Text>
      </View>
    );
  }

  return (
    <View>
      <FlatList
        style={{ backgroundColor: "black" }}
        data={data?.getPosts}
        renderItem={({ item }) => <Post post={item} />}
        keyExtractor={(item, idx) => idx}
      />
      <TouchableOpacity style={styles.button} onPress={handleAddPost}>
        <Ionicons name="add" size={30} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    position: "absolute",
    right: 18,
    bottom: 18,
    backgroundColor: "#1E90FF",
    width: 55,
    height: 55,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
});
