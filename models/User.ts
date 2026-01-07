import mongoose, { Schema, model, models } from 'mongoose';

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: 'user',
  },
});

const User = models.User || model('User', UserSchema);

export default User;
