import mongoose from "mongoose";

/* -------------------------- create a user schema -------------------------- */
const userSchema = new mongoose.Schema(
  {
    UserName: {
      type: String,
      trim: true,
      required: [true, "Please provide your username..!"],
    },
    RoleId: {
      type: mongoose.Types.ObjectId,
      ref: "Role",
      required: [true, "Please provide your role Id..!"],
    },
    Password: {
      type: String,
      trim: true,
      required: [true, `Please provide your password..!`],
    },
    Token: {
      type: String,
      trim: true,
    },
    TokenDateTime: {
      type: Date,
    },
    IsActive: {
      type: Boolean,
      default: true,
    },
    IsDelete: {
      type: Boolean,
      default: false,
    },
    CreatedBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    ModifiedBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const User = mongoose.model("User", userSchema);
