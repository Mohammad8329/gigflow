import { useNavigate } from 'react-router-dom';

// Matches the backend ILead interface
interface Lead {
  _id: string;
  name: string;
  email: string;
  status: string;
  source: string;
  createdAt: string;
}

interface LeadTableProps {
  leads: Lead[];
}

export const LeadTable = ({ leads }: LeadTableProps) => {
  const navigate = useNavigate();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'New': 
        return 'bg-cyan-50/60 dark:bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 dark:border-cyan-500/30';
      case 'Contacted': 
        return 'bg-amber-50/60 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 dark:border-amber-500/30';
      case 'Qualified': 
        return 'bg-emerald-50/60 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 dark:border-emerald-500/30';
      case 'Lost': 
        return 'bg-rose-50/60 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 dark:border-rose-500/30';
      default: 
        return 'bg-slate-50/60 dark:bg-slate-500/10 text-slate-600 dark:text-slate-400 border border-slate-500/20';
    }
  };

  return (
    <div className="space-y-4">
      {/* Header labels for desktops */}
      <div className="hidden md:grid grid-cols-12 px-8 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
        <div className="col-span-5">Name & Email</div>
        <div className="col-span-2 text-center">Status</div>
        <div className="col-span-3 text-center">Source</div>
        <div className="col-span-2 text-right">Created</div>
      </div>

      {/* Row stacks */}
      <div className="space-y-3.5">
        {leads.map((lead) => (
          <div 
            key={lead._id}
            className="group grid grid-cols-1 md:grid-cols-12 items-center gap-4 px-8 py-5 bg-white/70 dark:bg-slate-950/20 backdrop-blur-md border border-slate-200/50 dark:border-slate-800/10 rounded-2xl md:rounded-[1.5rem] shadow-sm hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700/50 hover:translate-y-[-1px] transition-all duration-300 cursor-pointer"
            onClick={() => navigate(`/leads/${lead._id}`)}
          >
            {/* Column 1: Name & Email */}
            <div className="col-span-1 md:col-span-5 space-y-0.5">
              <div className="font-sans font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {lead.name}
              </div>
              <div className="text-xs text-slate-400 dark:text-slate-500">
                {lead.email}
              </div>
            </div>

            {/* Column 2: Status */}
            <div className="col-span-1 md:col-span-2 flex flex-col md:items-center">
              <span className="md:hidden text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">
                Status
              </span>
              <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full tracking-wide shadow-sm ${getStatusColor(lead.status)}`}>
                {lead.status}
              </span>
            </div>

            {/* Column 3: Source */}
            <div className="col-span-1 md:col-span-3 flex flex-col md:items-center">
              <span className="md:hidden text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">
                Source
              </span>
              <span className="font-semibold text-slate-700 dark:text-slate-300 text-sm">
                {lead.source}
              </span>
            </div>

            {/* Column 4: Created */}
            <div className="col-span-1 md:col-span-2 flex flex-col md:items-end">
              <span className="md:hidden text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">
                Created
              </span>
              <span className="font-semibold text-slate-600 dark:text-slate-400 text-xs">
                {new Date(lead.createdAt).toLocaleDateString(undefined, {
                  month: 'numeric',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};