import { SearchX } from 'lucide-react';

interface EmptyStateProps {
  message?: string;
}

export const EmptyState = ({ message = "No leads found" }: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 border rounded-md border-dashed border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
      <SearchX className="h-10 w-10 text-gray-400 mb-4" />
      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">{message}</h3>
      <p className="text-sm text-gray-500 mt-1">Try adjusting your search or filters to find what you are looking for.</p>
    </div>
  );
};