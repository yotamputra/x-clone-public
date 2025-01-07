import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import { gql, useMutation, useQuery } from "@apollo/client";
import { useState } from "react";

const GET_POST = gql`
  query GetPostById($getPostByIdId: String) {
    getPostById(id: $getPostByIdId) {
      _id
      authorId
      comments {
        content
        updatedAt
        username
      }
      content
      createdAt
      imgUrl
      likes {
        username
        updatedAt
      }
      tags
      updatedAt
      authorDetail {
        _id
        email
        name
        username
      }
    }
  }
`;

const LIKE = gql`
  mutation AddLike($id: ID) {
    addLike(_id: $id)
  }
`;

export default function DetailedScreen({ route }) {
  const { _id, likesCounts, likeds } = route.params;

  const { loading, error, data } = useQuery(GET_POST, {
    variables: { getPostByIdId: _id },
  });

  const post = data?.getPostById;

  const navigation = useNavigation();

  const [liked, setIsLiked] = useState(likeds);
  const [likesCount, setLikesCount] = useState(likesCounts || 0);

  const [like] = useMutation(LIKE);

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

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="white" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.profileHeader}>
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
        <View style={styles.profileInfo}>
          <Text style={styles.username}>{post?.authorDetail?.name}</Text>
          <Text style={styles.handle}>@{post?.authorDetail?.username}</Text>
        </View>
      </View>

      <View style={styles.card}>
        <View style={styles.contentContainer}>
          <Text style={styles.content}>{post.content}</Text>

          {post.imgUrl && (
            <Image source={{ uri: post.imgUrl }} style={styles.postImage} />
          )}

          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() =>
                navigation.navigate("AddComment", {
                  _id: post._id,
                })
              }
            >
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
      </View>

      <Text style={styles.repliesText}>Replies</Text>

      <View style={styles.commentsContainer}>
        {post.comments?.map((comment, index) => (
          <View key={index} style={styles.commentCard}>
            <View style={styles.commentHeader}>
              <View>
                <Image
                  source={{
                    uri: `https://avatar.iran.liara.run/public/?username=${comment.username}`,
                  }}
                  style={styles.commentAvatar}
                />
              </View>
              <Text style={styles.commentUsername}>{comment.username}</Text>
            </View>
            <Text style={styles.commentContent}>{comment.content}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    padding: 15,
  },
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 30,
    marginRight: 15,
  },
  profileInfo: {
    justifyContent: "center",
  },
  card: {
    flexDirection: "column",
    borderBottomColor: "#333",
    backgroundColor: "black",
    borderBottomWidth: 1,
  },
  contentContainer: {
    flex: 1,
  },
  username: {
    color: "white",
    fontWeight: "400",
    fontSize: 20,
  },
  handle: {
    color: "#aaa",
    fontSize: 16,
    fontWeight: "300",
  },
  content: {
    color: "white",
    fontSize: 25,
    marginBottom: 5,
  },
  postImage: {
    width: "100%",
    height: 250,
    marginTop: 10,
    marginBottom: 8,
    objectFit: "contain",
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
    marginBottom: 10,
  },
  repliesText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 22,
    marginTop: 20,
    marginBottom: 10,
  },
  commentsContainer: {
    marginTop: 10,
  },
  commentCard: {
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
    paddingBottom: 10,
  },
  commentHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  commentAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10,
  },
  commentUsername: {
    color: "white",
    fontWeight: 500,
    fontSize: 16,
  },
  commentContent: {
    color: "#aaa",
    fontSize: 16,
    marginLeft: 40,
  },
});
