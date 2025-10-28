import { createProject, getProjectsByUser, getProjectById, updateProject, deleteProject, addMember as addMemberToProject } from './projectService.js';
import { validateCreateProject, validateUpdateProject, validateAddMember } from './projectDto.js';
import { checkOwner } from '../utils/authorization.js';
import { formatError } from '../utils/errorUtils.js';

const create = async (req, res) => {
  try {
    const validatedData = validateCreateProject(req.body);
    const { title, description, members } = validatedData;
    const project = await createProject(title, description || '', req.user._id, members);
    res.status(201).json(project);
  } catch (error) {
    res.status(400).json({ error: formatError(error) });
  }
};

const getAll = async (req, res) => {
  try {
    const projects = await getProjectsByUser(req.user._id);
    const projectsWithDetails = projects.map(project => {
      const projectObj = project.toObject();

      if (projectObj.owner && projectObj.owner._id) {
        const { _id, ...ownerWithoutId } = projectObj.owner;
        projectObj.owner = ownerWithoutId;
      }
      if (projectObj.members && Array.isArray(projectObj.members)) {
        projectObj.members = projectObj.members.map(member => {
          if (member && member._id) {
            const { _id, ...memberWithoutId } = member;
            return memberWithoutId;
          }
          return member;
        });
      }
      return {
        ...projectObj,
        membersCount: project.members.length,
        completionRate: project.completionPercentage
      };
    });
    res.json(projectsWithDetails);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getById = async (req, res) => {
  try {
    const project = await getProjectById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    const projectObj = project.toObject();
    if (projectObj.owner && projectObj.owner._id) {
      const { _id, ...ownerWithoutId } = projectObj.owner;
      projectObj.owner = ownerWithoutId;
    }
    if (projectObj.members && Array.isArray(projectObj.members)) {
      projectObj.members = projectObj.members.map(member => {
        if (member && member._id) {
          const { _id, ...memberWithoutId } = member;
          return memberWithoutId;
        }
        return member;
      });
    }
    const projectWithDetails = {
      ...projectObj,
      membersCount: project.members.length,
      completionRate: project.completionPercentage
    };
    res.json(projectWithDetails);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const update = async (req, res) => {
  try {
    const projectId = req.params.id;
    await checkOwner(projectId, req.user._id);
    const validatedData = validateUpdateProject(req.body);
    const project = await updateProject(projectId, validatedData);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    const projectObj = project.toObject();
    if (projectObj.owner && projectObj.owner._id) {
      const { _id, ...ownerWithoutId } = projectObj.owner;
      projectObj.owner = ownerWithoutId;
    }
    if (projectObj.members && Array.isArray(projectObj.members)) {
      projectObj.members = projectObj.members.map(member => {
        if (member && member._id) {
          const { _id, ...memberWithoutId } = member;
          return memberWithoutId;
        }
        return member;
      });
    }
    const projectWithDetails = {
      ...projectObj,
      membersCount: project.members.length,
      completionRate: project.completionPercentage
    };
    res.json(projectWithDetails);
  } catch (error) {
    const statusCode = error.statusCode || 400;
    res.status(statusCode).json({ error: error.message });
  }
};

const remove = async (req, res) => {
  try {
    const projectId = req.params.id;
    await checkOwner(projectId, req.user._id);
    const project = await deleteProject(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.json({ message: 'Project deleted' });
  } catch (error) {
    const statusCode = error.statusCode || 400;
    res.status(statusCode).json({ error: error.message });
  }
};

const addMember = async (req, res) => {
  try {
    const projectId = req.params.id;
    const validatedData = validateAddMember(req.body);
    const { email } = validatedData;
    await checkOwner(projectId, req.user._id);
    const project = await addMemberToProject(projectId, email);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.json(project);
  } catch (error) {
    const statusCode = error.statusCode || 400;
    res.status(statusCode).json({ error: error.message });
  }
};

export { create, getAll, getById, update, remove, addMember };
