import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IActivity extends Document {
  leadId: Types.ObjectId;
  userId: Types.ObjectId;
  userName: string; 
  action: 'created' | 'updated' | 'deleted' | 'status_changed' | 'note_added';
  field?: string;
  oldValue?: string;
  newValue?: string;
  note?: string;
  createdAt: Date;
}

const ActivitySchema: Schema = new Schema(
  {
    leadId: {
      type: Schema.Types.ObjectId,
      ref: 'Lead',
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    // We save the userName directly here (Denormalization) so we don't have to 
    // query the User table every single time we load the activity timeline. It makes the app much faster!
    userName: {
      type: String,
      required: true,
    },
    action: {
      type: String,
      enum: ['created', 'updated', 'deleted', 'status_changed', 'note_added'],
      required: true,
    },
    field: {
      type: String, // e.g., 'status'
    },
    oldValue: {
      type: String, // e.g., 'New'
    },
    newValue: {
      type: String, // e.g., 'Contacted'
    },
    note: {
      type: String,
    },
  },
  {
    // We only need createdAt for a timeline, so we disable updatedAt
    timestamps: { createdAt: true, updatedAt: false },
  }
);

export default mongoose.model<IActivity>('Activity', ActivitySchema);