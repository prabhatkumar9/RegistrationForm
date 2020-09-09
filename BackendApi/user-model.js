var mongoose = require("mongoose");
var UserSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  mobile: {
    type: Number,
    required: true,
  },
  secreteToken: {
    type: String,
  },
  active: {
    type: Boolean,
    required: true,
  },
});
var User = mongoose.model("userinfo", UserSchema);
module.exports = User;
