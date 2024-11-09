import { Schema, model, models } from "mongoose";

// Define the post schema
const postSchema = new Schema({
  title: { type: String, required: true },
  message: { type: String, required: true },
  author: { type: Schema.Types.ObjectId, ref: "User", required: true },  // Reference to the User model
  createdAt: { type: Date, default: Date.now },
  authorName: { type: String, required: true },  // authorName as a String
});

// Create and export the Post model
export default models.Post || model("Post", postSchema);
