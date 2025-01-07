const { ObjectId } = require('mongodb')
const { database } = require('../config/mongodb')
const { hashPass, comparePass } = require('../helpers/bcrypt')
const validateEmail = require('../helpers/isEmailFormat')
const {signToken} = require('../helpers/jwt')

class UserModel {
  static collection() {
    return database.collection('users')
  }

  static async findByEmail(email) {
    return this.collection().findOne({ email })
  }

  static async findById(id) {
    const agg = [
      {
        '$match': {
          '_id': new ObjectId(String(id))
        }
      },
      {
        '$lookup': {
          'from': 'follow', 
          'localField': '_id', 
          'foreignField': 'followingId', 
          'as': 'following'
        }
      }, {
        '$lookup': {
          'from': 'follow', 
          'localField': '_id', 
          'foreignField': 'followerId', 
          'as': 'follower'
        }
      }, {
        '$lookup': {
          'from': 'users', 
          'localField': 'following.followerId', 
          'foreignField': '_id', 
          'as': 'following'
        }
      }, {
        '$lookup': {
          'from': 'users', 
          'localField': 'follower.followingId', 
          'foreignField': '_id', 
          'as': 'follower'
        }
      }, {
        '$project': {
          'password': false, 
          'following.password': false, 
          'follower.password': false
        }
      }
    ];

    const user = await this.collection().aggregate(agg).next()

    if (!user) {
      throw new Error('User not found')
    }

    return user
  }

  static async getAll() {
    const users = await this.collection().find().toArray()
    return users
  }

  static async create(newUser) {
    if (!newUser.username) {
      throw new Error('Username is required')
    }
    if (!newUser.email) {
      throw new Error('Email is required')
    }
    if (!newUser.password) {
      throw new Error('Password is required')
    }
    if (newUser.password.length < 5) {
      throw new Error("Password must be at least 5 characters long");
    }

    if (!validateEmail(newUser.email)) {
      throw new Error('Invalid email format');
    }

    const existingUsername = await this.collection().findOne({ username: newUser.username });
    if (existingUsername) {
      throw new Error("Username is already taken");
    }
    const existingEmail = await this.collection().findOne({ email: newUser.email });
    if (existingEmail) {
      throw new Error("Email is already registered");
    }

    newUser.password = hashPass(newUser.password)

    const result = await this.collection().insertOne(newUser)
    return result
  }

  static async login(login) {
    const { email, password } = login
    
    if (!email) {
      throw new Error('Email is required')
    }
    if (!password) {
      throw new Error('Password is required')
    }

    const user = await this.collection().findOne({email})

    // console.log(password)
    // console.log(user.password)
    
    if (!user) {
      throw new Error('Invalid email or password')
    }
    
    const compared = comparePass(password, user.password)

    if (!compared) {
      throw new Error('Invalid email or password')
    }

    const loginResponse = {
      accessToken: signToken({ _id: user._id, email: user.email })
    }

    return loginResponse
  }

  static async getByUsername(username) {
    const user = await this.collection().findOne({
      username: {
        $regex: username,
        $options: 'i',
      },
    })

    return user
  }

  static async getByName(name) {
    const user = await this.collection().findOne({
      name: {
        $regex: name,
        $options: 'i',
      },
    })

    return user
  }
}

module.exports = UserModel