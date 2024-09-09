import mongoose from "mongoose";

const UserCustomizationSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
    },
    customization: {
      type: Object,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.UserCustomization ||
  mongoose.model("UserCustomization", UserCustomizationSchema);
