import { useMemo, useState } from 'react';
import { ClipboardList } from 'lucide-react';
import { Task, Status, Priority } from '@/types/task';
import { TaskCard } from './TaskCard';
import { TaskFilters } from './TaskFilters';

interface TaskListProps {
  tasks: Task[];
  onUpdate: (id: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: Status) => void;
}

export function TaskList({ tasks, onUpdate, onDelete, onStatusChange }: TaskListProps) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<Status | 'all'>('all');
  const [priorityFilter, setPriorityFilter] = useState<Priority | 'all'>('all');

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      if (statusFilter !== 'all' && task.status !== statusFilter) return false;
      if (priorityFilter !== 'all' && task.priority !== priorityFilter) return false;
      if (search) {
        const searchLower = search.toLowerCase();
        return (
          task.title.toLowerCase().includes(searchLower) ||
          task.description.toLowerCase().includes(searchLower) ||
          task.assignee.toLowerCase().includes(searchLower)
        );
      }
      return true;
    });
  }, [tasks, search, statusFilter, priorityFilter]);

  const stats = useMemo(() => ({
    total: tasks.length,
    todo: tasks.filter(t => t.status === 'todo').length,
    inProgress: tasks.filter(t => t.status === 'in-progress').length,
    complete: tasks.filter(t => t.status === 'complete').length,
  }), [tasks]);

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 animate-fade-in">
        <div className="bg-card border border-border rounded-lg p-3 text-center">
          <p className="text-2xl font-semibold text-foreground">{stats.total}</p>
          <p className="text-xs text-muted-foreground">Total Tasks</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-3 text-center">
          <p className="text-2xl font-semibold text-status-todo">{stats.todo}</p>
          <p className="text-xs text-muted-foreground">To Do</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-3 text-center">
          <p className="text-2xl font-semibold text-status-progress">{stats.inProgress}</p>
          <p className="text-xs text-muted-foreground">In Progress</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-3 text-center">
          <p className="text-2xl font-semibold text-status-complete">{stats.complete}</p>
          <p className="text-xs text-muted-foreground">Complete</p>
        </div>
      </div>

      {/* Filters */}
      <TaskFilters
        search={search}
        onSearchChange={setSearch}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        priorityFilter={priorityFilter}
        onPriorityFilterChange={setPriorityFilter}
      />

      {/* Task List */}
      {filteredTasks.length === 0 ? (
        <div className="text-center py-12 animate-fade-in">
          <ClipboardList className="w-12 h-12 mx-auto text-muted-foreground/50 mb-3" />
          <h3 className="text-lg font-medium text-foreground mb-1">
            {tasks.length === 0 ? 'No tasks yet' : 'No matching tasks'}
          </h3>
          <p className="text-sm text-muted-foreground">
            {tasks.length === 0
              ? 'Add a task above to get started'
              : 'Try adjusting your filters'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredTasks.map((task, index) => (
            <div
              key={task.id}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <TaskCard
                task={task}
                onUpdate={onUpdate}
                onDelete={onDelete}
                onStatusChange={onStatusChange}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
