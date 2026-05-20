import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

interface FilterBarProps {
  onStatusChange: (status: string) => void;
  onSourceChange: (source: string) => void;
}

export const FilterBar = ({ onStatusChange, onSourceChange }: FilterBarProps) => {
  return (
    <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
      <Select onValueChange={(val: string | null) => onStatusChange(val === 'all' || !val ? '' : val)}>
        <SelectTrigger className="!h-11 rounded-full bg-white/50 dark:bg-slate-900/40 border-slate-200/50 dark:border-slate-800/10 focus:ring-2 focus:ring-blue-500 shadow-sm text-sm font-medium text-slate-700 dark:text-slate-300 w-full sm:w-[180px] transition-all px-5">
          <SelectValue placeholder="Filter by Status" />
        </SelectTrigger>
        <SelectContent className="bg-white/95 dark:bg-slate-950/95 border-slate-200/50 dark:border-slate-800/10 rounded-2xl shadow-xl backdrop-blur-md">
          <SelectItem value="all">All Statuses</SelectItem>
          <SelectItem value="New">New</SelectItem>
          <SelectItem value="Contacted">Contacted</SelectItem>
          <SelectItem value="Qualified">Qualified</SelectItem>
          <SelectItem value="Lost">Lost</SelectItem>
        </SelectContent>
      </Select>

      <Select onValueChange={(val: string | null) => onSourceChange(val === 'all' || !val ? '' : val)}>
        <SelectTrigger className="!h-11 rounded-full bg-white/50 dark:bg-slate-900/40 border-slate-200/50 dark:border-slate-800/10 focus:ring-2 focus:ring-blue-500 shadow-sm text-sm font-medium text-slate-700 dark:text-slate-300 w-full sm:w-[180px] transition-all px-5">
          <SelectValue placeholder="Filter by Source" />
        </SelectTrigger>
        <SelectContent className="bg-white/95 dark:bg-slate-950/95 border-slate-200/50 dark:border-slate-800/10 rounded-2xl shadow-xl backdrop-blur-md">
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