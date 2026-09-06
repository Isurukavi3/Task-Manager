import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 3 },
    description: { 
      type: String,
      trim: true,
      default: '' },
    priority: { 
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium' },
    status: { 
      type: String,
      enum: ['todo', 'doing', 'done'],
      default: 'todo' },
    assignee: { type: String, required: true },
    assigneeEmail: { 
      type: String,
      required: true,
      lowercase: true,
      trim: true },
    version: { type: Number, default: 0 }, 
  },
  { timestamps: true }
);
taskSchema.index({ assigneeEmail: 1, status: 1 });
taskSchema.index({ status: 1 });      
taskSchema.set('toJSON', {
  versionKey: false,
  transform(_doc, ret) {
    ret.id = ret._id.toString();
    delete ret._id;
    return ret;
  },
});

export const Task = mongoose.model('Task', taskSchema);



