import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { gql, useMutation } from "@apollo/client";
import { useState } from "react";

const LIKE = gql`
  mutation AddLike($id: ID) {
    addLike(_id: $id)
  }
`;

export default function Post({ post }) {
  const navigation = useNavigation();

  const [liked, setIsLiked] = useState("");
  const [likesCount, setLikesCount] = useState(post.likes?.length || 0);

  const [like, { loading }] = useMutation(LIKE);

  async function handleLike() {
    try {
      const result = await like({
        variables: {
          id: post._id,
        },
      });

      if (result.data.addLike === "add") {
        setIsLiked(true);
        setLikesCount(likesCount + 1);
      } else {
        setIsLiked(false);
        setLikesCount(likesCount - 1);
      }
    } catch (err) {
      console.log(err);
      Alert.alert("Error", err.message);
    }
  }

  function handleDetail() {
    navigation.navigate("Detailed", {
      _id: post._id,
      likesCounts: likesCount,
      likeds: liked,
    });
  }

  function handleComment() {
    navigation.navigate("AddComment", {
      _id: post._id,
    });
  }

  return (
    <TouchableOpacity onPress={handleDetail} style={styles.card}>
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("ProfileUser", {
            _id: post.authorId,
          })
        }
      >
        <Image
          source={{
            uri: `https://avatar.iran.liara.run/public/?username=${post.authorDetail.username}`,
          }}
          style={styles.avatar}
        />
      </TouchableOpacity>
      <View style={styles.contentContainer}>
        <View style={styles.header}>
          <Text style={styles.username}>{post.authorDetail.name}</Text>
          <Text style={styles.handle}>@{post.authorDetail.username}</Text>
        </View>

        <Text style={styles.content}>{post.content}</Text>

        {post?.imgUrl && (
          <Image source={{ uri: post?.imgUrl }} style={styles.postImage} />
        )}

        <View style={styles.actions}>
          <TouchableOpacity style={styles.actionButton} onPress={handleComment}>
            <Text style={styles.actionText}>
              <Ionicons name="chatbubble-outline" size={18} color="white" />{" "}
              {post.comments?.length}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={handleLike}>
            <Text style={styles.actionText}>
              <Ionicons
                name={liked ? "heart" : "heart-outline"}
                size={18}
                color="white"
              />{" "}
              {likesCount}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    padding: 15,
    backgroundColor: "black",
    borderBottomWidth: 1,
    borderBottomColor: "#333",
    paddingLeft: 8,
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 25,
    marginRight: 10,
    marginTop: 5,
  },
  contentContainer: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
    gap: 3,
  },
  username: {
    color: "white",
    fontWeight: "bold",
    marginRight: 5,
    fontSize: 16,
  },
  handle: {
    color: "#aaa",
    fontSize: 14,
  },
  content: {
    color: "white",
    fontSize: 16,
    marginBottom: 2,
  },
  postImage: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginTop: 8,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginTop: 12,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 15,
  },
  actionText: {
    color: "#aaa",
    fontSize: 14,
    marginLeft: 5,
  },
});
