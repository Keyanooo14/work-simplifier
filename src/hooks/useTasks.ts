import { useState, useEffect, useCallback } from 'react';
import { Task, Status, Priority } from '@/types/task';

const STORAGE_KEY = 'complex-work-handler-tasks';

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load tasks from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setTasks(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Failed to load tasks from localStorage:', error);
    }
    setIsLoaded(true);
  }, []);

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
      } catch (error) {
        console.error('Failed to save tasks to localStorage:', error);
      }
    }
  }, [tasks, isLoaded]);

  const addTask = useCallback((task: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...task,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    setTasks(prev => [newTask, ...prev]);
    return newTask;
  }, []);

  const updateTask = useCallback((id: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>) => {
    setTasks(prev => prev.map(task => 
      task.id === id ? { ...task, ...updates } : task
    ));
  }, []);

  const deleteTask = useCallback((id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  }, []);

  const updateStatus = useCallback((id: string, status: Status) => {
    updateTask(id, { status });
  }, [updateTask]);

  const getFilteredTasks = useCallback((
    filter: {
      status?: Status | 'all';
      priority?: Priority | 'all';
      search?: string;
      assignee?: string;
    }
  ) => {
    return tasks.filter(task => {
      if (filter.status && filter.status !== 'all' && task.status !== filter.status) {
        return false;
      }
      if (filter.priority && filter.priority !== 'all' && task.priority !== filter.priority) {
        return false;
      }
      if (filter.assignee && task.assignee.toLowerCase() !== filter.assignee.toLowerCase()) {
        return false;
      }
      if (filter.search) {
        const searchLower = filter.search.toLowerCase();
        return (
          task.title.toLowerCase().includes(searchLower) ||
          task.description.toLowerCase().includes(searchLower) ||
          task.assignee.toLowerCase().includes(searchLower)
        );
      }
      return true;
    });
  }, [tasks]);

  return {
    tasks,
    isLoaded,
    addTask,
    updateTask,
    deleteTask,
    updateStatus,
    getFilteredTasks,
  };
}
