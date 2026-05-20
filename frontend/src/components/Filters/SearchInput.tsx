import { useState, useEffect, useRef } from 'react';
import { useDebounce } from '../../hooks/useDebounce';
import { Search } from 'lucide-react';

interface SearchInputProps {
  onSearch: (value: string) => void;
}

export const SearchInput = ({ onSearch }: SearchInputProps) => {
  const [value, setValue] = useState('');
  const debouncedValue = useDebounce(value, 300);

  // Use a mutable ref to track if this is the component's initial mount cycle
  const isInitialMount = useRef(true);

  useEffect(() => {
    // If it's the first time the component renders, flip the flag and STOP execution
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return; // 🛑 Blocks the empty trigger on mount that was causing your page loop!
    }

    onSearch(debouncedValue);
  }, [debouncedValue, onSearch]);

  return (
    <div className="relative flex-1 max-w-md">
      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
      <input
        className="pl-10 h-10 w-full rounded-full border border-slate-200/60 dark:border-slate-800/20 bg-slate-50/50 dark:bg-slate-900/30 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/55 px-4"
        placeholder="Search by name or email..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </div>
  );
};