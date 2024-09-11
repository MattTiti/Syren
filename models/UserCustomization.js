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
    phoneNumber: {
      type: String,
      required: true,
    },
    deliveryTime: {
      type: String,
      required: true,
      default: "07:00",
    },
  },
  { timestamps: true }
);

export default mongoose.models.UserCustomization ||
  mongoose.model("UserCustomization", UserCustomizationSchema);
