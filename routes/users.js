const mongoose = require('mongoose');
const plm = require("passport-local-mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/pinterest");

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique:true,
  },

  profileImage:{
    type:String,
  },

  password: {
    type: String,
  },

  posts:[{
    type: mongoose.Types.ObjectId,
    ref:'post',
  }],

  db:{
    type:String,
  },
  email:{
    type:String,
    required:true,
    unique:true
},

  fullname: {
    type:String,
    required:true,
  },
});

userSchema.plugin(plm);

module.exports = mongoose.model("user", userSchema);