import checkAuth from "../../utils/check_auth.js";
import Post from "../../models/postModel.js";
import { AuthenticationError, UserInputError } from "apollo-server-errors";

export default {
  Mutation: {
    async createComment(_, { postId, body }, context) {
      const { username } = checkAuth(context);
      if (body.trim() === "") {
        throw new UserInputError("Empty comment", {
          errors: {
            body: "can not post empty comment",
          },
        });
      }
      const post = await Post.findById(postId);
      if (post) {
        post.comments.unshift({
          body,
          username,
          createdAt: new Date().toISOString(),
        });
        await post.save();
        return post;
      } else {
        throw new UserInputError("post not found");
      }
    },
    async deleteComment(_, { postId, commentId }, context) {
      const user = checkAuth(context);
      const post = await Post.findById(postId);
      if (post) {
        const commentIndex = post.comments.findIndex((c) => c.id === commentId);
        if (user.username === post.comments[commentIndex].username) {
          post.comments.splice(commentIndex, 1);
          await post.save();
          return post;
        } else {
          throw new AuthenticationError("action not allowed");
        }
      } else {
        throw new UserInputError("post not found");
      }
    },
  },
};
