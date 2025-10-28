import { z } from 'zod';

const createProjectSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(100, 'Title cannot exceed 100 characters'),
  description: z.string().max(500, 'Description cannot exceed 500 characters').optional(),
  members: z.array(z.string().email('Invalid email format')).optional()
});

const updateProjectSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(100, 'Title cannot exceed 100 characters').optional(),
  description: z.string().max(500, 'Description cannot exceed 500 characters').optional(),
  members: z.array(z.string().email('Invalid email format')).optional()
});

const addMemberSchema = z.object({
  email: z.string().email('Invalid email format')
});

const validateCreateProject = (data) => {
  return createProjectSchema.parse(data);
};

const validateUpdateProject = (data) => {
  return updateProjectSchema.parse(data);
};

const validateAddMember = (data) => {
  return addMemberSchema.parse(data);
};

export { validateCreateProject, validateUpdateProject, validateAddMember };
