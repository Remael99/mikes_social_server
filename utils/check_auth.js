import { AuthenticationError } from "apollo-server-errors";
import jwt from "jsonwebtoken";
import { SECRET } from "../config.js";

export default (context) => {
  const authHeader = context.req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split("Bearer ")[1];

    if (token) {
      try {
        const user = jwt.verify(token, SECRET);
        return user;
      } catch (err) {
        throw new AuthenticationError("invalid / expired token");
      }
    }
    throw new Error("Authentication token must be 'Bearer [token] ");
  }
  throw new Error("Authorization header must be provided");
};
