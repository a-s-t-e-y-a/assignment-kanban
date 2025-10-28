import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a project title'],
    trim: true,
    minlength: [3, 'Title must be at least 3 characters'],
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters'],
    default: ''
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Project must have an owner'],
    index: true
  },
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  completionPercentage: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  }
}, {
  timestamps: true
});

const Project = mongoose.model('Project', projectSchema);

export default Project;
