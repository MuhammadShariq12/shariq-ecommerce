import { Token } from "@clerk/nextjs/server";
import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
  clerkId: String,
  wishlist: {
    type: Array,
    default: []
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  Token:{
    sessionkey:{type:String},
    sessionExpiry:{type:String}
  }
});

const User = mongoose.models.User || mongoose.model("User", userSchema);


export default User;

