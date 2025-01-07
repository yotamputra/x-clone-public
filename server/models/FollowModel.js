const { ObjectId } = require("mongodb");
const { database } = require("../config/mongodb");

class FollowModel {
  static collection() {
    return database.collection("follow");
  }

  static async getAll() {
    const followers = await this.collection().find().toArray();
    return followers;
  }

  static async create(newFollow, id) {
    try {
      const followerId = new ObjectId(String(newFollow.followerId));
      const followingId = new ObjectId(String(id));

      const existingFollow = await this.collection().findOne({
        followerId: followerId,
        followingId: followingId,
      });

      if (existingFollow) {
        await this.collection().deleteOne({
          followerId: followerId,
          followingId: followingId,
        });
        return "unfollow";
      } else {
        const newFollowData = {
          followerId,
          followingId,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        await this.collection().insertOne(newFollowData);
        return "follow";
      }
    } catch (err) {
      console.log(err);
    }
  }
}

module.exports = FollowModel;
