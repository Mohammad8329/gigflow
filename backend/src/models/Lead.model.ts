import mongoose, { Schema, Document, Types } from 'mongoose';

// 1. Define the TypeScript Interface
export interface ILead extends Document {
  name: string;
  email: string;
  status: 'New' | 'Contacted' | 'Qualified' | 'Lost';
  source: 'Website' | 'Instagram' | 'Referral';
  createdBy: Types.ObjectId; // Strictly typing this as a MongoDB ObjectId
  updatedBy: Types.ObjectId; 
  createdAt: Date;
  updatedAt: Date;
}

// 2. Define the Mongoose Schema
const LeadSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a lead name'],
      trim: true, // Removes accidental whitespace
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
    status: {
      type: String,
      enum: ['New', 'Contacted', 'Qualified', 'Lost'],
      default: 'New',
    },
    source: {
      type: String,
      enum: ['Website', 'Instagram', 'Referral'],
      required: [true, 'Please specify the lead source'],
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User', // This allows us to use .populate('createdBy') later to get the User's name
      required: true,
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true, 
  }
);

export default mongoose.model<ILead>('Lead', LeadSchema);