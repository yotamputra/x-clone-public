import { useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { gql, useQuery, useMutation } from "@apollo/client";

const GET_PROFILE = gql`
  query GetUserById($getUserByIdId: String) {
    getUserById(id: $getUserByIdId) {
      _id
      email
      name
      username
      follower {
        _id
      }
      following {
        _id
      }
    }
  }
`;

const FOLLOW = gql`
  mutation AddFollow($followerId: String) {
    addFollow(followerId: $followerId)
  }
`;

export default function ProfileUser({ route }) {
  const { _id } = route.params;

  const navigation = useNavigation();
  const [isFollowing, setIsFollowing] = useState(false);

  const { loading, error, data } = useQuery(GET_PROFILE, {
    fetchPolicy: "network-only",
    variables: { getUserByIdId: _id },
  });

  const [follow] = useMutation(FOLLOW, {
    refetchQueries: [
      {
        query: GET_PROFILE,
        variables: { getUserByIdId: _id },
      },
      "GetUserById",
    ],
    awaitRefetchQueries: true,
  });

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

  const profile = data.getUserById;

  async function handleFollow() {
    // console.log(profile._id);
    try {
      const result = await follow({
        variables: {
          followerId: profile._id,
        },
      });

      // console.log(result.data.addFollow);

      if (result.data.addFollow === "follow") {
        setIsFollowing(true);
      } else {
        setIsFollowing(false);
      }
    } catch (err) {
      console.log(err);
      Alert.alert("Error", err.message);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons
          name="chevron-back"
          size={24}
          color="white"
          onPress={() => navigation.goBack()}
        />
      </View>

      <View style={styles.avatarContainer}>
        <Image
          source={{
            uri: `https://avatar.iran.liara.run/public/?username=${profile.username}`,
          }}
          style={styles.avatar}
        />
        <View style={styles.textContainer}>
          <Text style={styles.name}>{profile.name}</Text>
          <Text style={styles.username}>@{profile.username}</Text>
        </View>

        <TouchableOpacity
          style={[styles.followButton, isFollowing && styles.followingButton]}
          onPress={handleFollow}
        >
          <Text style={styles.followButtonText}>
            {isFollowing ? "Followed" : "Follow"}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.stats}>
        <Text style={styles.statsText}>
          Followers: {profile.follower?.length}
        </Text>
        <Text style={styles.statsText}>
          Following: {profile.following?.length}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    padding: 20,
    paddingTop: 60,
  },
  header: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginBottom: 25,
  },
  avatarContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    justifyContent: "space-between",
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-start",
  },
  name: {
    color: "white",
    fontSize: 22,
    fontWeight: "bold",
  },
  username: {
    color: "#1DA1F2",
    fontSize: 18,
  },
  followButton: {
    paddingVertical: 8,
    paddingHorizontal: 30,
    backgroundColor: "white",
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    height: 40,
  },
  followingButton: {
    backgroundColor: "#4CAF50",
  },
  followButtonText: {
    color: "black",
    fontSize: 16,
  },
  stats: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 15,
  },
  statsText: {
    color: "white",
    fontSize: 16,
  },
});
