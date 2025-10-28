import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a task title'],
    trim: true,
    minlength: [1, 'Title is required'],
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters'],
    default: ''
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Task must be assigned to a user']
  },
  status: {
    type: String,
    enum: ['To Do', 'In Progress', 'Completed'],
    default: 'To Do'
  },
  dueDate: {
    type: Date,
    required: false
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: [true, 'Task must belong to a project'],
    index: true
  }
}, {
  timestamps: true
});

const Task = mongoose.model('Task', taskSchema);

export default Task;
