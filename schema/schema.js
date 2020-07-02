const graphql = require('graphql');
const _ = require('lodash');

const User = require('../model/User');
const Hobby = require('../model/Hobby');
const Post = require('../model/Post');

const {
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
  GraphQLInt,
  GraphQLID,
  GraphQLList,
  GraphQLNonNull,
} = graphql;

//Create Types
const UserType = new GraphQLObjectType({
  name: 'User',
  description: 'Documentation for user...',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    lastName: { type: GraphQLString },
    age: { type: GraphQLInt },

    posts: {
      type: new GraphQLList(PostType),
      resolve(parent, args) {
        return Post.find({});
      },
    },

    hobbies: {
      type: new GraphQLList(HobbyType),
      resolve(parent, args) {
        return Hobby.find({});
      },
    },
  }),
});

const HobbyType = new GraphQLObjectType({
  name: 'Hobby',
  description: 'Hobby Description',
  fields: () => ({
    id: { type: GraphQLID },
    title: { type: GraphQLString },
    description: { type: GraphQLString },
    user: {
      type: UserType,
      resolve(parent, args) {
        return User.findById(parent.userId);
      },
    },
  }),
});

const PostType = new GraphQLObjectType({
  name: 'Post',
  description: 'Post description',
  fields: () => ({
    id: { type: GraphQLID },
    comment: { type: GraphQLString },
    user: {
      type: UserType,
      resolve(parent, args) {
        return User.findById(parent.userId);
      },
    },
  }),
});

//RootQuery
const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  description: 'Description',
  fields: {
    user: {
      type: UserType,
      args: { id: { type: GraphQLString } },

      resolve(parent, args) {
        return User.findById(args.id);
      },
    },
    users: {
      type: new GraphQLList(UserType),
      resolve(parent, args) {
        return User.find({});
      },
    },
    hobby: {
      type: HobbyType,
      args: { id: { type: GraphQLID } },

      resolve(parent, args) {
        //return data for our hobby
        return Hobby.findById(args.id);
      },
    },
    hobbies: {
      type: new GraphQLList(HobbyType),
      resolve(parent, args) {
        return Hobby.find({});
      },
    },
    post: {
      type: PostType,
      args: { id: { type: GraphQLID } },

      resolve(parent, args) {
        //return data for our post
        return Post.findById(args.id);
      },
    },
    posts: {
      type: new GraphQLList(PostType),
      resolve(parent, args) {
        return Post.find({});
      },
    },
  },
});

//Mutations

//CREATE USER
const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    CreateUser: {
      type: UserType,
      args: {
        // id: { type: GraphQLID },
        name: { type: new GraphQLNonNull(GraphQLString) },
        age: { type: new GraphQLNonNull(GraphQLInt) },
        lastName: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve(parent, args) {
        let user = new User({
          name: args.name,
          age: args.age,
          lastName: args.lastName,
        });
        //SAVE TO DB
        return user.save();
      },
    },

    //UPDATE USER
    UpdateUser: {
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
        name: { type: new GraphQLNonNull(GraphQLString) },
        age: { type: new GraphQLNonNull(GraphQLInt) },
        lastName: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve(parent, args) {
        return (updatedUser = User.findByIdAndUpdate(
          args.id,
          {
            $set: {
              name: args.name,
              lastName: args.lastName,
              age: args.age,
            },
          },
          { new: true } //send back the updated objectType
        ));
      },
    },

    //REMOVE USER
    RemoveUser: {
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve(parent, args) {
        let removedUser = User.findByIdAndRemove(args.id).exec();
        if (!removedUser) {
          throw new 'ERROR!'();
        }
        return removedUser;
      },
    },

    //CREATE POST
    CreatePost: {
      type: PostType,
      args: {
        comment: { type: new GraphQLNonNull(GraphQLString) },
        userId: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve(parent, args) {
        let post = new Post({
          comment: args.comment,
          userId: args.userId,
        });
        return post.save();
      },
    },

    //UPDATE Post
    UpdatePost: {
      type: PostType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
        comment: { type: new GraphQLNonNull(GraphQLString) },
        // userId: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve(parent, args) {
        return (updatedPost = Post.findByIdAndUpdate(
          args.id,
          {
            $set: {
              comment: args.comment,
            },
          },
          { new: true } //send back the updated objectType
        ));
      },
    },

    //REMOVE POST
    RemovePost: {
      type: PostType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve(parent, args) {
        let removedPost = Post.findByIdAndRemove(args.id).exec();
        if (!removedPost) {
          throw new 'ERROR!'();
        }
        return removedPost;
      },
    },

    //CREATE HOBBY
    CreateHobby: {
      type: HobbyType,
      args: {
        title: { type: new GraphQLNonNull(GraphQLString) },
        description: { type: new GraphQLNonNull(GraphQLString) },
        userId: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve(parent, args) {
        let hobby = new Hobby({
          title: args.title,
          description: args.description,
          userId: args.userId,
        });
        return hobby.save();
      },
    },

    //UPDATE Hobby
    UpdateHobby: {
      type: HobbyType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
        title: { type: new GraphQLNonNull(GraphQLString) },
        description: { type: new GraphQLNonNull(GraphQLString) },
        // userId: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve(parent, args) {
        return (updatedHobby = Hobby.findByIdAndUpdate(
          args.id,
          {
            $set: {
              title: args.title,
              description: args.description,
            },
          },
          { new: true } //send back the updated objectType
        ));
      },
    },

    //REMOVE HOBBY
    RemoveHobby: {
      type: HobbyType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve(parent, args) {
        let removedHobby = Hobby.findByIdAndRemove(args.id).exec();
        if (!removedHobby) {
          throw new 'ERROR!'();
        }
        return removedHobby;
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});
