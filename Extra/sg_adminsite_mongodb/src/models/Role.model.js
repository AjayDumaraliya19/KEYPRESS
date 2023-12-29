import mongoose from "mongoose";

/* --------------------------- create role schema --------------------------- */
const RoleSchema = new mongoose.Schema(
  {
    Name: {
      type: String,
      trim: true,
      required: [true, `Please Enter Name..!`],
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

export const Role = mongoose.model("Role", RoleSchema);
