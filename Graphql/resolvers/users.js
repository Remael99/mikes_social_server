import User from "../../models/userModels.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { SECRET } from "../../config.js";
import { UserInputError } from "apollo-server-errors";
import {
  validateLoginInput,
  validateRegisterInput,
} from "../../utils/validators.js";

const generateUserToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      username: user.username,
      email: user.email,
    },
    SECRET,
    { expiresIn: "1h" }
  );
};

export default {
  Mutation: {
    async login(_, { username, password }) {
      const { valid, errors } = validateLoginInput(username, password);
      if (!valid) {
        throw new UserInputError("Errors", { errors });
      }
      const user = await User.findOne({ username });
      if (!user) {
        errors.general = "user not found";
        throw new UserInputError("user not found", { errors });
      }

      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        errors.general = "Check your username or password";
        throw new UserInputError("Wrong credentials", { errors });
      }

      const token = generateUserToken(user);

      return {
        ...user._doc,
        id: user._id,
        token,
      };
    },

    async register(
      _,
      { registerInput: { username, password, email, confirmPassword } }
    ) {
      //validate user input

      const { valid, errors } = validateRegisterInput(
        username,
        email,
        password,
        confirmPassword
      );
      if (!valid) {
        throw new UserInputError("Errors", { errors });
      }

      const user = await User.findOne({ username });

      if (user) {
        throw new UserInputError("username is taken", {
          errors: {
            username: "this name is taken", // help in front end to display errors
          },
        });
      }

      password = await bcrypt.hash(password, 12);

      const newUser = User({
        email,
        username,
        password,
        createdAt: new Date().toISOString(),
      });

      const res = await newUser.save();

      const token = generateUserToken(res);

      return {
        ...res._doc,
        id: res._id,
        token,
      };
    },
  },
};
