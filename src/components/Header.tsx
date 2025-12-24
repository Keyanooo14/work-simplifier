import { Layers } from 'lucide-react';

export function Header() {
  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
      <div className="container max-w-4xl mx-auto px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary rounded-lg">
            <Layers className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-foreground tracking-tight">
              Complex Work Handler
            </h1>
            <p className="text-sm text-muted-foreground">
              Simplify tasks, manage work efficiently
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
