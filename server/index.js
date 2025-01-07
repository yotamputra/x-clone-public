require("dotenv").config();

const { ApolloServer } = require("@apollo/server");
const { startStandaloneServer } = require("@apollo/server/standalone");

const { userResolvers, userTypeDefs } = require("./schemas/user");
const { postTypeDefs, postResolvers } = require("./schemas/post");
const { verifyToken } = require("./helpers/jwt");
const UserModel = require("./models/UserModel");
const { followTypeDefs, followResolvers } = require("./schemas/follow");

const server = new ApolloServer({
  typeDefs: [userTypeDefs, postTypeDefs, followTypeDefs],
  resolvers: [userResolvers, postResolvers, followResolvers],
  introspection: true,
});

startStandaloneServer(server, {
  listen: { port: process.env.PORT || 4000 },
  context: ({ req, res }) => {
    return {
      message: "test",
      auth: async () => {
        const authorization = req.headers.authorization;
        if (!authorization) {
          throw new Error("Please login first");
        }

        const [type, token] = authorization.split(" ");
        if (type !== "Bearer") {
          throw new Error("Invalid token");
        }

        const decoded = verifyToken(token);

        // console.log(decoded)
        const user = await UserModel.findById(decoded._id);
        if (!user) {
          throw new Error("Invalid token");
        }

        return user;
      },
    };
  },
}).then(({ url }) => {
  console.log(`🚀  Server ready at: ${url}`);
});
