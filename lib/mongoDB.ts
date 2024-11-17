import mongoose from "mongoose";

let isConnected: boolean = false;

export const connectToDB = async (): Promise<void> => {
  mongoose.set("strictQuery", true)

  if (isConnected) {
    console.log("MongoDB is already connected");
    return;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URL || "mongodb+srv://shariqdashing76:Shariq12@crud.ucrl5.mongodb.net/ecommercemarketplace?retryWrites=true&w=majority&appName=CRUD", {
      dbName: "ecommersemarketplace_Store"
    })

    isConnected = true;
    console.log("MongoDB is connected");
  } catch (err) {
    console.log(err)
  }
}
