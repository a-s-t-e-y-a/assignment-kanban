import { isOwner } from '../project/projectService.js';
import { isProjectMember } from '../task/taskService.js';

const checkOwner = async (projectId, userId) => {
  if (!(await isOwner(projectId, userId))) {
    const error = new Error('You are not the owner of this project');
    error.statusCode = 403;
    throw error;
  }
};

const checkProjectMember = async (projectId, userId) => {
  if (!(await isProjectMember(projectId, userId))) {
    const error = new Error('Not authorized');
    error.statusCode = 403;
    throw error;
  }
};

export { checkOwner, checkProjectMember };
