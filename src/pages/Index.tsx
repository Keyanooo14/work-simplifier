import { useCallback } from 'react';
import { toast } from 'sonner';
import { Header } from '@/components/Header';
import { TaskInput } from '@/components/TaskInput';
import { TaskList } from '@/components/TaskList';
import { useTasks } from '@/hooks/useTasks';
import { extractTaskInfo } from '@/lib/wordSimplifier';

const Index = () => {
  const { tasks, addTask, updateTask, deleteTask, updateStatus } = useTasks();

  const handleSubmit = useCallback((text: string) => {
    const taskInfo = extractTaskInfo(text);
    
    addTask({
      title: taskInfo.title,
      description: taskInfo.description,
      priority: taskInfo.priority,
      status: 'todo',
      assignee: taskInfo.assignee,
      deadline: taskInfo.deadline,
    });

    toast.success('Task added successfully', {
      description: 'Complex terms have been simplified',
    });
  }, [addTask]);

  const handleDelete = useCallback((id: string) => {
    deleteTask(id);
    toast.success('Task deleted');
  }, [deleteTask]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container max-w-4xl mx-auto px-4 py-8">
        <div className="space-y-8">
          <TaskInput onSubmit={handleSubmit} />
          <TaskList
            tasks={tasks}
            onUpdate={updateTask}
            onDelete={handleDelete}
            onStatusChange={updateStatus}
          />
        </div>
      </main>

      <footer className="border-t border-border mt-auto py-6">
        <div className="container max-w-4xl mx-auto px-4">
          <p className="text-sm text-center text-muted-foreground">
            Tasks are saved locally in your browser
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
