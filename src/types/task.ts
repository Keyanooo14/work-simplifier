export type Priority = 'high' | 'medium' | 'low';
export type Status = 'todo' | 'in-progress' | 'complete';

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  status: Status;
  assignee: string;
  deadline: string;
  createdAt: string;
}
