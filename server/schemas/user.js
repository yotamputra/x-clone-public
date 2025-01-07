const UserModel = require("../models/UserModel");

const typeDefs = `#graphql
  type User {
    _id: ID
    name: String
    username: String
    email: String
    follower: [follower]
    following: [following]
  }

  type follower {
    _id: ID
    name: String
    username: String
    email: String
  }

  type following {
    _id: ID
    name: String
    username: String
    email: String
  }

  type follower {
    _id: ID
    name: String
    username: String
    email: String
  }

  type LoginResponse {
    accessToken: String
  }

  type Query {
    getUsers: [User]
    getUserByUsername(username: String): User
    getUserByName(name: String): User
    getUserById(id: String): User
  }

  type Mutation {
    register(name: String, username: String, email: String, password: String): User
    login(email: String, password: String): LoginResponse
  }
`;

const resolvers = {
  Query: {
    getUsers: async () => {
      const users = await UserModel.getAll();

      return users;
    },
    getUserByUsername: async (_, args) => {
      const user = await UserModel.getByUsername(args.username);

      if (!user) {
        throw new Error("User not found");
      }

      return user;
    },
    getUserByName: async (_, args) => {
      const user = await UserModel.getByName(args.name);

      if (!user) {
        throw new Error("User not found");
      }

      return user;
    },
    getUserById: async (_, { id }, { auth }) => {
      const user = await auth();
      // console.log(user)
      let userId;
      if (!id) {
        userId = user._id;
      } else {
        userId = id;
      }
      // console.log(userId);

      const result = await UserModel.findById(userId);

      return result;
    },
  },
  Mutation: {
    register: async (_, args) => {
      const { name, username, email, password } = args;
      const newUser = { name, username, email, password };

      const result = await UserModel.create(newUser);

      return newUser;
    },
    login: async (_, args) => {
      const { email, password } = args;
      const login = { email, password };

      const result = await UserModel.login(login);
      // console.log(result)

      return result;
    },
  },
};

module.exports = {
  userTypeDefs: typeDefs,
  userResolvers: resolvers,
};
