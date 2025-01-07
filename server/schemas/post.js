const redis = require("../config/redis");
const PostModel = require("../models/PostModel");

const typeDefs = `#graphql
  type Post {
    _id: ID
    content: String
    tags: [String]
    imgUrl: String
    authorId: String
    comments: [Comment]
    likes: [Like]
    createdAt: String
    updatedAt: String
    authorDetail: AuthorDetail
  }

  type AuthorDetail {
    _id: ID
    name: String
    username: String
    email: String
  }

  type Comment {
    content: String
    username: String
    createdAt: String
    updatedAt: String
  }

  type Like {
    username: String
    createdAt: String
    updatedAt: String
  }

  type Query {
    getPosts: [Post]
    getPostById(id: String): Post
  }

  type Mutation {
    addPost(content: String, imgUrl: String, tags: [String]): Post
    addComment(content: String, _id: ID): String
    addLike(_id: ID): String
  }
`;

const resolvers = {
  Query: {
    getPosts: async (_, args) => {
      const postsCache = await redis.get("post:all");
      if (postsCache) {
        // console.log('cache <<<<')
        return JSON.parse(postsCache);
      }

      // console.log('db <<<<')
      const posts = await PostModel.getAll();
      await redis.set("post:all", JSON.stringify(posts));

      return posts;
    },
    getPostById: async (_, args) => {
      const { id } = args;
      const post = await PostModel.findById(id);
      // console.log(post)

      return post;
    },
  },
  Mutation: {
    addPost: async (_, args, { auth }) => {
      const user = await auth();
      // console.log(user)

      const newPost = args;
      const id = user._id;

      const result = await PostModel.create(newPost, id);
      await redis.del("post:all");

      return newPost;
    },
    addComment: async (_, args, { auth }) => {
      const user = await auth();
      // console.log(user)

      const { username } = user;
      const newComment = args;
      const result = await PostModel.addComment(newComment, username);
      // console.log(newComment)
      await redis.del("post:all");

      return "Success add comment";
    },
    addLike: async (_, args, { auth }) => {
      const user = await auth();

      const { username } = user;
      const newLike = args;
      const result = await PostModel.addLike(newLike, username);
      await redis.del("post:all");

      return result;
    },
  },
};

module.exports = {
  postTypeDefs: typeDefs,
  postResolvers: resolvers,
};
