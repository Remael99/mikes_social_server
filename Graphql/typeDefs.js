import { gql } from "apollo-server";

export const typeDefs = gql`
  type Post {
    id: ID!
    body: String!
    username: String!
    createdAt: String!
    comments: [comment]!
    likes: [like]!
    likeCount: Int!
    commentCount: Int!
  }
  type comment {
    id: ID!
    body: String!
    username: String!
    createdAt: String!
  }
  type like {
    id: ID!
    username: String!
    createdAt: String!
  }
  type User {
    id: ID!
    email: String!
    username: String!
    token: String!
    createdAt: String!
  }
  input RegisterInput {
    username: String!
    password: String!
    email: String!
    confirmPassword: String!
  }

  type Query {
    getPosts: [Post]
    getPost(postId: ID!): Post
  }

  type Mutation {
    register(registerInput: RegisterInput): User!
    login(username: String!, password: String!): User!
    createPost(body: String!): Post!
    deletePost(postId: ID!): String!
    editPost(postId: ID!, body: String!): Post!
    updatePost(postId: ID!, body: String!): Post!
    createComment(postId: ID!, body: String!): Post!
    deleteComment(postId: ID!, commentId: ID!): Post!
    likePost(postId: ID!): Post!
  }
`;
//mutation adding something to database
//input for user inputs
