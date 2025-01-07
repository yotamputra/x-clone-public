const { ObjectId } = require("mongodb");
const { database } = require("../config/mongodb");

class PostModel {
  static collection() {
    return database.collection("posts");
  }

  static async getAll() {
    const agg = [
      {
        $lookup: {
          from: "users",
          localField: "authorId",
          foreignField: "_id",
          as: "authorDetail",
        },
      },
      {
        $unwind: {
          path: "$authorDetail",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          "authorDetail.password": false,
        },
      },
    ];

    const posts = await this.collection().aggregate(agg).toArray();

    // console.log(posts)
    return posts;
  }

  static async findById(id) {
    const agg = [
      {
        $match: {
          _id: new ObjectId(String(id)),
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "authorId",
          foreignField: "_id",
          as: "authorDetail",
        },
      },
      {
        $unwind: {
          path: "$authorDetail",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          "authorDetail.password": false,
        },
      },
    ];

    const post = await this.collection().aggregate(agg).next();
    // console.log(post)

    if (!post) {
      throw new Error("Post not found");
    }

    return post;
  }

  static async create(newPost, id) {
    const { content, imgUrl, tags } = newPost;
    if (!content) {
      throw new Error("Content is required");
    }

    newPost.createdAt = newPost.updatedAt = new Date();
    newPost.authorId = new ObjectId(String(id));

    const result = await this.collection().insertOne(newPost);
    return result;
  }

  static async addComment(newComment, username) {
    const { content, _id } = newComment;

    if (!content) {
      throw new Error("Content is required");
    }
    if (!username) {
      throw new Error("Username is required");
    }

    const result = await this.collection().updateOne(
      {
        _id: new ObjectId(String(_id)),
      },
      {
        $push: {
          comments: {
            content: content,
            username: username,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        },
      }
    );
    return result;
  }

  static async addLike(newLike, username) {
    const { _id } = newLike;

    if (!username) {
      throw new Error("Username is required");
    }

    const post = await this.collection().findOne({
      _id: new ObjectId(String(_id)),
    });
    if (!post) {
      throw new Error("Post not found");
    }

    const userHasLiked = post.likes?.some((like) => like.username === username);

    if (userHasLiked) {
      const result = await this.collection().updateOne(
        { _id: new ObjectId(String(_id)) },
        { $pull: { likes: { username: username } } }
      );
      return "remove";
    } else {
      const result = await this.collection().updateOne(
        { _id: new ObjectId(String(_id)) },
        {
          $push: {
            likes: {
              username: username,
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          },
        }
      );
      return "add";
    }
  }
}

module.exports = PostModel;
