import React, { useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { gql, useQuery } from "@apollo/client";

const GET_USERS = gql`
  query GetUsers {
    getUsers {
      email
      name
      username
      _id
    }
  }
`;

export default function SearchScreen() {
  const [search, setSearch] = useState("");
  const navigation = useNavigation();

  const { loading, error, data } = useQuery(GET_USERS);

  const users = data?.getUsers;
  console.log(users);

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

  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(search.toLowerCase()) ||
      user.name.toLowerCase().includes(search.toLowerCase())
  );

  function handleUserPress(id) {
    // console.log("masuk", id);
    navigation.navigate("ProfileUser", {
      _id: id,
    });
  }

  const UserItem = ({ user }) => {
    return (
      <TouchableOpacity
        onPress={() => handleUserPress(user._id)}
        style={styles.userItem}
      >
        <Image
          source={{
            uri: `https://avatar.iran.liara.run/public/?username=${user.username}`,
          }}
          style={styles.avatar}
        />
        <View style={styles.userInfo}>
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.username}>@{user.username}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Ionicons
          name="search"
          size={20}
          color="#666"
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search users"
          placeholderTextColor="#666"
          value={search}
          onChangeText={setSearch}
          clearButtonMode="while-editing"
        />
      </View>

      <FlatList
        data={filteredUsers}
        keyExtractor={(item) => item.email}
        renderItem={({ item }) => <UserItem user={item} />}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {search ? "No users found" : "Start searching for users"}
            </Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "black",
    flex: 1,
    paddingTop: 50,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1C1C1C",
    borderRadius: 20,
    margin: 15,
    paddingHorizontal: 15,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    color: "white",
    height: 50,
  },
  userItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  userInfo: {
    flex: 1,
  },
  name: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  username: {
    color: "#666",
    fontSize: 14,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
  },
  emptyText: {
    color: "#666",
    fontSize: 16,
  },
});
