import { useState, useCallback, KeyboardEvent } from 'react';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface TaskInputProps {
  onSubmit: (text: string) => void;
}

export function TaskInput({ onSubmit }: TaskInputProps) {
  const [text, setText] = useState('');

  const handleSubmit = useCallback(() => {
    if (text.trim()) {
      onSubmit(text.trim());
      setText('');
    }
  }, [text, onSubmit]);

  const handleKeyDown = useCallback((e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleSubmit();
    }
  }, [handleSubmit]);

  return (
    <div className="bg-card border border-border rounded-lg p-4 shadow-card animate-fade-in">
      <div className="mb-3">
        <h2 className="text-lg font-semibold text-foreground">Add New Task</h2>
        <p className="text-sm text-muted-foreground">
          Paste meeting notes, work instructions, or task details
        </p>
      </div>
      
      <Textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Example: Review the Q4 KPI report by EOD. @Sarah will handle the UX improvements for the dashboard. This is urgent - we need to optimize the onboarding flow before the stakeholder meeting tomorrow."
        className="min-h-[120px] resize-none bg-background border-input focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
      />
      
      <div className="mt-3 flex items-center justify-between">
        <span className="text-xs text-muted-foreground">
          Press <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs font-mono">Ctrl</kbd> + <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs font-mono">Enter</kbd> to submit
        </span>
        
        <Button 
          onClick={handleSubmit}
          disabled={!text.trim()}
          className="gap-2"
        >
          <Send className="w-4 h-4" />
          Submit Task
        </Button>
      </div>
    </div>
  );
}
