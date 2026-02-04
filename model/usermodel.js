const mongoose = require("mongoose");

const authschema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },isBlocked: {
  type: Boolean,
  default: false
},
      role: {
    type: String,
    enum: ["user", "admin"],
    default: "user", 
  },
   
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", authschema);
