import { useState } from 'react';
import { Check, Clock, Circle, Pencil, Trash2, User, Calendar, X, Save } from 'lucide-react';
import { Task, Status, Priority } from '@/types/task';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface TaskCardProps {
  task: Task;
  onUpdate: (id: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: Status) => void;
}

const statusConfig: Record<Status, { label: string; icon: typeof Check; className: string }> = {
  'todo': { label: 'To Do', icon: Circle, className: 'status-todo' },
  'in-progress': { label: 'In Progress', icon: Clock, className: 'status-progress' },
  'complete': { label: 'Complete', icon: Check, className: 'status-complete' },
};

const priorityConfig: Record<Priority, { label: string; className: string }> = {
  'high': { label: 'High', className: 'priority-high' },
  'medium': { label: 'Medium', className: 'priority-medium' },
  'low': { label: 'Low', className: 'priority-low' },
};

export function TaskCard({ task, onUpdate, onDelete, onStatusChange }: TaskCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDescription, setEditDescription] = useState(task.description);
  const [editPriority, setEditPriority] = useState<Priority>(task.priority);
  const [editAssignee, setEditAssignee] = useState(task.assignee);
  const [editDeadline, setEditDeadline] = useState(task.deadline);

  const status = statusConfig[task.status];
  const StatusIcon = status.icon;
  const priority = priorityConfig[task.priority];

  const handleSave = () => {
    onUpdate(task.id, {
      title: editTitle,
      description: editDescription,
      priority: editPriority,
      assignee: editAssignee,
      deadline: editDeadline,
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditTitle(task.title);
    setEditDescription(task.description);
    setEditPriority(task.priority);
    setEditAssignee(task.assignee);
    setEditDeadline(task.deadline);
    setIsEditing(false);
  };

  const cycleStatus = () => {
    const statusOrder: Status[] = ['todo', 'in-progress', 'complete'];
    const currentIndex = statusOrder.indexOf(task.status);
    const nextStatus = statusOrder[(currentIndex + 1) % statusOrder.length];
    onStatusChange(task.id, nextStatus);
  };

  if (isEditing) {
    return (
      <div className={`task-card ${priority.className} animate-scale-in`}>
        <div className="space-y-3">
          <Input
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            placeholder="Task title"
            className="font-medium"
          />
          
          <Textarea
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            placeholder="Task description"
            className="min-h-[80px] resize-none"
          />
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Select value={editPriority} onValueChange={(v) => setEditPriority(v as Priority)}>
              <SelectTrigger>
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="high">High Priority</SelectItem>
                <SelectItem value="medium">Medium Priority</SelectItem>
                <SelectItem value="low">Low Priority</SelectItem>
              </SelectContent>
            </Select>
            
            <Input
              value={editAssignee}
              onChange={(e) => setEditAssignee(e.target.value)}
              placeholder="Assignee"
            />
            
            <Input
              value={editDeadline}
              onChange={(e) => setEditDeadline(e.target.value)}
              placeholder="Deadline"
            />
          </div>
          
          <div className="flex gap-2 justify-end">
            <Button variant="outline" size="sm" onClick={handleCancel}>
              <X className="w-4 h-4 mr-1" />
              Cancel
            </Button>
            <Button size="sm" onClick={handleSave}>
              <Save className="w-4 h-4 mr-1" />
              Save
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`task-card ${priority.className} animate-slide-up group`}>
      <div className="flex items-start gap-3">
        <button
          onClick={cycleStatus}
          className={`mt-0.5 p-1.5 rounded-full transition-all hover:scale-110 ${status.className}`}
          title={`Status: ${status.label}. Click to change.`}
        >
          <StatusIcon className="w-4 h-4" />
        </button>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className={`font-medium text-foreground leading-tight ${task.status === 'complete' ? 'line-through text-muted-foreground' : ''}`}>
              {task.title}
            </h3>
            
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setIsEditing(true)}
              >
                <Pencil className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-destructive hover:text-destructive"
                onClick={() => onDelete(task.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          <p className={`text-sm text-muted-foreground mt-1 line-clamp-2 ${task.status === 'complete' ? 'line-through' : ''}`}>
            {task.description}
          </p>
          
          <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-muted-foreground">
            <span className={`status-badge ${status.className}`}>
              <StatusIcon className="w-3 h-3" />
              {status.label}
            </span>
            
            <span className="inline-flex items-center gap-1">
              <User className="w-3 h-3" />
              {task.assignee}
            </span>
            
            <span className="inline-flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {task.deadline}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
