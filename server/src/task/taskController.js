import { createTask, updateTask, deleteTask, getTasksByProject, getTaskById, isProjectMember } from './taskService.js';
import { validateCreateTask, validateUpdateTask } from './taskDto.js';
import { checkProjectMember } from '../utils/authorization.js';
import User from '../schema/auth.js';
import Project from '../schema/project.js';
import { formatError } from '../utils/errorUtils.js';
import socketManager from '../websocket/socket.js';
import { TASK_CREATED, TASK_UPDATED, TASK_DELETED } from '../websocket/socketEvents.js';

const create = async (req, res) => {
  try {
    const projectId = req.params.projectId;
    await checkProjectMember(projectId, req.user._id);
    const validatedData = validateCreateTask(req.body);
    const { title, description, assignedTo, dueDate } = validatedData;
    const assignedUser = await User.findOne({ email: assignedTo });
    if (!assignedUser) {
      return res.status(400).json({ message: 'Assigned user not found' });
    }
    if (!(await isProjectMember(projectId, assignedUser._id))) {
      return res.status(400).json({ message: 'Assigned user is not a project member' });
    }
    const task = await createTask(title, description || '', assignedUser._id, dueDate ? new Date(dueDate) : null, projectId);
    socketManager.getIO().to(projectId).emit(TASK_CREATED, task);
    res.status(201).json(task);
  } catch (error) {
    const statusCode = error.statusCode || 400;
    res.status(statusCode).json({ error: formatError(error) });
  }
};

const update = async (req, res) => {
  try {
    const taskId = req.params.id;
    const task = await getTaskById(taskId);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    const project = await Project.findById(task.project._id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    if (project.owner.toString() !== req.user._id.toString() && task.assignedTo._id.toString() !== req.user._id.toString()) {
      const error = new Error('Not authorized');
      error.statusCode = 403;
      throw error;
    }
    const validatedData = validateUpdateTask(req.body);
    let assignedUserId = task.assignedTo._id; 
    if (validatedData.assignedTo) {
      const assignedUser = await User.findOne({ email: validatedData.assignedTo });
      if (!assignedUser) {
        return res.status(400).json({ message: 'Assigned user not found' });
      }
      if (!(await isProjectMember(task.project._id, assignedUser._id))) {
        return res.status(400).json({ message: 'Assigned user is not a project member' });
      }
      assignedUserId = assignedUser._id;
    }
    const updateData = { ...validatedData };
    if (validatedData.assignedTo) {
      updateData.assignedTo = assignedUserId;
    }
    const updatedTask = await updateTask(taskId, updateData);
    socketManager.getIO().to(task.project._id.toString()).emit(TASK_UPDATED, updatedTask);
    res.json(updatedTask);
  } catch (error) {
    const statusCode = error.statusCode || 400;
    res.status(statusCode).json({ error: error.message });
  }
};

const remove = async (req, res) => {
  try {
    const taskId = req.params.id;
    const task = await getTaskById(taskId);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    await checkProjectMember(task.project._id, req.user._id);
    await deleteTask(taskId);
    socketManager.getIO().to(task.project._id.toString()).emit(TASK_DELETED, { id: taskId });
    res.json({ message: 'Task deleted' });
  } catch (error) {
    const statusCode = error.statusCode || 400;
    res.status(statusCode).json({ error: error.message });
  }
};

const getByProject = async (req, res) => {
  try {
    const projectId = req.params.projectId;
    await checkProjectMember(projectId, req.user._id);
    const tasks = await getTasksByProject(projectId);
    res.json({
      tasks,
      hasNoTasks: tasks.length === 0
    });
  } catch (error) {
    const statusCode = error.statusCode || 400;
    res.status(statusCode).json({ error: error.message });
  }
};

export { create, update, remove, getByProject };
