import { useNavigation } from "@react-navigation/native";
import { useContext } from "react";
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { AuthContext } from "../context/AuthContext";
import * as SecureStore from "expo-secure-store";
import { gql, useQuery } from "@apollo/client";

const GET_PROFILE = gql`
  query GetUserById($getUserByIdId: String) {
    getUserById(id: $getUserByIdId) {
      _id
      email
      name
      username
      follower {
        _id
        email
        name
        username
      }
      following {
        username
        name
        _id
        email
      }
    }
  }
`;

export default function ProfileScreen() {
  const navigation = useNavigation();
  const { setIsSignedIn } = useContext(AuthContext);

  const { loading, error, data } = useQuery(GET_PROFILE, {
    fetchPolicy: "network-only",
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

  // console.log(profile);

  function detailedProfile(id) {
    navigation.navigate("ProfileUser", {
      _id: id,
    });
  }

  const handleLogout = async () => {
    // console.log("User logged out");
    setIsSignedIn(false);
    await SecureStore.deleteItemAsync("accessToken");
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image
          source={{
            uri: `https://avatar.iran.liara.run/public/?username=${profile.username}`,
          }}
          style={styles.avatar}
        />
        <Text style={styles.name}>{profile.name}</Text>
        <Text style={styles.username}>@{profile.username}</Text>
        <Text style={styles.email}>email: {profile.email}</Text>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>

      <View style={styles.stats}>
        <Text style={styles.statsText}>
          Followers: {profile.follower?.length}
        </Text>
        <Text style={styles.statsText}>
          Following: {profile.following?.length}
        </Text>
      </View>

      <View style={styles.followSection}>
        <Text style={styles.followTitle}>Followers</Text>
        <FlatList
          data={profile.follower}
          scrollEnabled={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => detailedProfile(item._id)}
              style={styles.followerItem}
            >
              <Image
                source={{
                  uri: `https://avatar.iran.liara.run/public/?username=${item.username}`,
                }}
                style={styles.followerAvatar}
              />
              <Text style={styles.followerName}>@{item.username}</Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item._id}
        />
      </View>

      <View style={styles.followSection}>
        <Text style={styles.followTitle}>Following</Text>
        <FlatList
          scrollEnabled={false}
          style={{ marginBottom: 80 }}
          data={profile.following}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => detailedProfile(item._id)}
              style={styles.followerItem}
            >
              <Image
                source={{
                  uri: `https://avatar.iran.liara.run/public/?username=${item.username}`,
                }}
                style={styles.followerAvatar}
              />
              <Text style={styles.followerName}>@{item.username}</Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item._id}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "black",
    flex: 1,
    padding: 15,
    paddingTop: 65,
  },
  header: {
    alignItems: "center",
    marginBottom: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  name: {
    color: "white",
    fontSize: 22,
    fontWeight: "bold",
  },
  username: {
    color: "#1DA1F2",
    fontSize: 18,
    marginBottom: 5,
  },
  email: {
    color: "white",
    fontSize: 16,
  },
  followSection: {
    marginTop: 20,
  },
  followTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  followerItem: {
    backgroundColor: "#1C1C1C",
    marginBottom: 10,
    padding: 10,
    borderRadius: 5,
    flexDirection: "row",
    alignItems: "center",
  },
  followerAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10,
  },
  followerName: {
    color: "white",
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
  logoutButton: {
    backgroundColor: "#FF3B30",
    paddingVertical: 8,
    marginHorizontal: 38,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20,
  },
  logoutText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
