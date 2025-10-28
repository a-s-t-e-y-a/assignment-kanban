import Task from '../schema/task.js';
import Project from '../schema/project.js';

const createTask = async (title, description, assignedTo, dueDate, projectId) => {
  const task = new Task({ title, description, assignedTo, dueDate, project: projectId });
  await task.save();
  await updateProjectCompletion(projectId);
  return await Task.findById(task._id).populate('assignedTo', 'name email').populate('project', 'title');
};

const updateTask = async (id, updates) => {
  const task = await Task.findByIdAndUpdate(id, updates, { new: true }).populate('assignedTo', 'name email').populate('project', 'title');
  if (task && updates.status) {
    await updateProjectCompletion(task.project._id);
  }
  return task;
};

const deleteTask = async (id) => {
  const task = await Task.findByIdAndDelete(id);
  if (task) {
    await updateProjectCompletion(task.project);
  }
  return task;
};

const getTasksByProject = async (projectId) => {
  return await Task.find({ project: projectId }).populate('assignedTo', 'name email');
};

const getTaskById = async (id) => {
  return await Task.findById(id).populate('assignedTo', 'name email').populate('project', 'title');
};

const isProjectMember = async (projectId, userId) => {
  const project = await Project.findById(projectId);
  return project && (project.owner.toString() === userId.toString() || project.members.some(member => member.toString() === userId.toString()));
};

const updateProjectCompletion = async (projectId) => {
  const tasks = await Task.find({ project: projectId });
  if (tasks.length === 0) {
    await Project.findByIdAndUpdate(projectId, { completionPercentage: 0 });
    return;
  }
  const completedTasks = tasks.filter(task => task.status === 'Completed').length;
  const percentage = Math.round((completedTasks / tasks.length) * 100);
  await Project.findByIdAndUpdate(projectId, { completionPercentage: percentage });
};

export { createTask, updateTask, deleteTask, getTasksByProject, getTaskById, isProjectMember };
