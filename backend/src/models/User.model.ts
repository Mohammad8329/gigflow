import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

// 1. Define the TypeScript Interface for autocomplete and strict typing
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'sales';
  createdAt: Date;
  updatedAt: Date;
}

// 2. Define the Mongoose Schema for database validation
const UserSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please add a valid email address',
      ],
    },
    password: {
      type: String,
      required: [true, 'Please add a password'],
      minlength: 6,
      select: false, // Security: By default, don't return the password in database queries
    },
    role: {
      type: String,
      enum: ['admin', 'sales'],
      default: 'sales',
    },
  },
  {
    timestamps: true, // Automatically creates and updates 'createdAt' and 'updatedAt' fields
  }
);

// 3. The Security Hook: Encrypt password using bcrypt BEFORE saving to the database
UserSchema.pre('save', async function (this: IUser) {
  // If the user is just updating their name/email, don't re-hash the password
  if (!this.isModified('password')) {
    return;
  }

  // Generate a 'salt' (extra random data to make the hash stronger)
  const salt = await bcrypt.genSalt(10);
  // Replace the plain text password with the hashed version
  this.password = await bcrypt.hash(this.password, salt);
});

// 4. Create a helper method to check if a typed password matches the hashed password
UserSchema.methods.matchPassword = async function (enteredPassword: string) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// 5. Export the model to use across our application
export default mongoose.model<IUser>('User', UserSchema);