import Project from '../schema/project.js';
import User from '../schema/auth.js';
import Task from '../schema/task.js';

const createProject = async (title, description, owner, memberEmails = []) => {
  const memberIds = [];
  for (const email of memberEmails) {
    const user = await User.findOne({ email });
    if (user) {
      memberIds.push(user._id);
    }
  }
  const project = new Project({ title, description, owner, members: memberIds });
  return await project.save();
};

const getProjectsByUser = async (userId) => {
  return await Project.find({ $or: [{ owner: userId }, { members: userId }] }).populate('owner', 'name email').populate('members', 'name email');
};

const getProjectById = async (id) => {
  return await Project.findById(id).populate('owner', 'name email').populate('members', 'name email');
};

const updateProject = async (id, updates) => {
  if (updates.members) {
    const memberIds = [];
    for (const email of updates.members) {
      const user = await User.findOne({ email });
      if (user) {
        memberIds.push(user._id);
      }
    }
    const currentProject = await Project.findById(id);
    const currentMemberIds = currentProject.members.map(m => m.toString());
    const newMemberIds = memberIds.map(m => m.toString());
    const removedIds = currentMemberIds.filter(cid => !newMemberIds.includes(cid));
    for (const removedId of removedIds) {
      const taskCount = await Task.countDocuments({ project: id, assignedTo: removedId });
      if (taskCount > 0) {
        throw new Error('Cannot remove member with assigned tasks');
      }
    }
    updates.members = memberIds;
  }
  return await Project.findByIdAndUpdate(id, updates, { new: true }).populate('owner', 'name email').populate('members', 'name email');
};

const deleteProject = async (id) => {
  return await Project.findByIdAndDelete(id);
};

const isOwner = async (projectId, userId) => {
  const project = await Project.findById(projectId);
  return project && project.owner.toString() === userId.toString();
};

const addMember = async (projectId, email) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('User not found');
  }
  return await Project.findByIdAndUpdate(projectId, { $addToSet: { members: user._id } }, { new: true }).populate('owner', 'name email').populate('members', 'name email');
};

export { createProject, getProjectsByUser, getProjectById, updateProject, deleteProject, isOwner, addMember };
