import { useState, useEffect } from 'react';
import { Input } from '../ui/input';
import { useDebounce } from '../../hooks/useDebounce';
import { Search } from 'lucide-react';

interface SearchInputProps {
  onSearch: (searchTerm: string) => void;
}

export const SearchInput = ({ onSearch }: SearchInputProps) => {
  const [value, setValue] = useState('');
  
  // This triggers the 300ms delay we built earlier!
  const debouncedValue = useDebounce(value, 300);

  useEffect(() => {
    onSearch(debouncedValue);
  }, [debouncedValue, onSearch]);

  return (
    <div className="relative w-full max-w-sm">
      <Search className="absolute left-2.5 top-3 h-4 w-4 text-gray-500" />
      <Input
        type="text"
        placeholder="Search names or emails..."
        className="pl-9"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </div>
  );
};