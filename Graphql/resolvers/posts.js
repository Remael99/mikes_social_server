import { AuthenticationError, UserInputError } from "apollo-server-errors";
import Post from "../../models/postModel.js";
import checkAuth from "../../utils/check_auth.js";

export default {
  Query: {
    async getPosts() {
      try {
        const posts = await Post.find().sort({ createdAt: -1 });
        return posts;
      } catch (error) {
        throw new Error(err);
      }
    },
    async getPost(_, { postId }) {
      try {
        const post = await Post.findById(postId);
        if (post) {
          return post;
        } else {
          throw Error("post not found");
        }
      } catch (err) {
        throw new Error(err);
      }
    },
  },
  Mutation: {
    async createPost(_, { body }, context) {
      const user = checkAuth(context);

      if (body.trim() === "") {
        throw new UserInputError("cannot create empty post");
      }
      const newPost = new Post({
        body,
        user: user.id,
        username: user.username,
        createdAt: new Date().toISOString(),
      });

      const post = await newPost.save();

      return post;
    },
    async deletePost(_, { postId }, context) {
      const user = checkAuth(context);

      try {
        const post = await Post.findById(postId);
        if (user.username === post.username) {
          await post.delete();
          return "post was deleted succesfully";
        } else {
          throw new AuthenticationError("Action not allowed");
        }
      } catch (error) {
        throw new Error(error);
      }
    },
    async updatePost(_, { postId, body }, context) {
      const user = checkAuth(context);
      try {
        const post = await Post.findById(postId);
        if (user.username === post.username) {
          await post.update(
            { body, createdAt: new Date().toISOString() },
            { new: true }
          );
          await post.save();
          return post;
        } else {
          throw new AuthenticationError("action not allowed");
        }
      } catch (error) {
        throw new Error(error);
      }
    },
    async likePost(_, { postId, body }, context) {
      const user = checkAuth(context);
      const post = await Post.findById(postId);

      if (post) {
        if (post.likes.find((like) => like.username === user.username)) {
          post.likes = post.likes.filter((l) => l.username !== user.username);
        } else {
          post.likes.push({
            username: user.username,
            createdAt: new Date().toISOString(),
          });
        }

        await post.save();
        return post;
      } else throw new UserInputError("post not found");
    },
  },
};

// async updatePost(_, { postId, body }, context) {
//   const user = checkAuth(context);
//   const updatePost = await Post.findByIdAndUpdate(postId, { body });
// },
