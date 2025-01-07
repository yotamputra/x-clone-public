const { ObjectId } = require("mongodb");
const FollowModel = require("../models/FollowModel");

const typeDefs = `#graphql
  type Follow {
    _id: ID
    followingId: ID
    followerId: ID
    createdAt: String
    updatedAt: String
  }

  type Query {
    getFollowers: [Follow]
  }

  type Mutation {
    addFollow(followerId: String): String
  }
`;

const resolvers = {
  Query: {
    getFollowers: async (_, args) => {
      const followers = await FollowModel.getAll();
      return followers;
    },
  },
  Mutation: {
    addFollow: async (_, args, { auth }) => {
      const user = await auth();
      // console.log(user)

      const newFollow = args;
      const id = user._id;

      const checkId = id.toString();

      console.log(args.followerId);
      console.log(checkId);

      if (checkId === args.followerId) {
        throw new Error("You cannot follow yourself!");
      }

      const result = await FollowModel.create(newFollow, id);

      return result;
    },
  },
};

module.exports = {
  followTypeDefs: typeDefs,
  followResolvers: resolvers,
};
