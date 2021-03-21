import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  username: String,
  userImage: String,
  password: String,
  email: String,
  createdAt: String,
});

const User = mongoose.model("User", userSchema);

export default User;
