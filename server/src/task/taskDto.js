import { z } from 'zod';

const createTaskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title cannot exceed 200 characters'),
  description: z.string().max(1000, 'Description cannot exceed 1000 characters').optional(),
  assignedTo: z.string().email('Invalid email format'),
  dueDate: z.string().optional().refine(val => !val || !isNaN(Date.parse(val)), 'Invalid date')
});

const updateTaskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title cannot exceed 200 characters').optional(),
  description: z.string().max(1000, 'Description cannot exceed 1000 characters').optional(),
  assignedTo: z.string().email('Invalid email format').optional(),
  status: z.enum(['To Do', 'In Progress', 'Completed']).optional(),
  dueDate: z.string().optional().refine(val => !val || !isNaN(Date.parse(val)), 'Invalid date')
});

const validateCreateTask = (data) => {
  return createTaskSchema.parse(data);
};

const validateUpdateTask = (data) => {
  return updateTaskSchema.parse(data);
};

export { validateCreateTask, validateUpdateTask };
