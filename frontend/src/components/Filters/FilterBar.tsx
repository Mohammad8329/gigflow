import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

interface FilterBarProps {
  onStatusChange: (status: string) => void;
  onSourceChange: (source: string) => void;
}

export const FilterBar = ({ onStatusChange, onSourceChange }: FilterBarProps) => {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <Select onValueChange={(val: string | null) => onStatusChange(val === 'all' || !val ? '' : val)}>
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder="Filter by Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Statuses</SelectItem>
          <SelectItem value="New">New</SelectItem>
          <SelectItem value="Contacted">Contacted</SelectItem>
          <SelectItem value="Qualified">Qualified</SelectItem>
          <SelectItem value="Lost">Lost</SelectItem>
        </SelectContent>
      </Select>

      <Select onValueChange={(val: string | null) => onSourceChange(val === 'all' || !val ? '' : val)}>
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder="Filter by Source" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Sources</SelectItem>
          <SelectItem value="Website">Website</SelectItem>
          <SelectItem value="Referral">Referral</SelectItem>
          <SelectItem value="Cold Call">Cold Call</SelectItem>
          <SelectItem value="LinkedIn">LinkedIn</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};