import { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { useLeads } from '../hooks/useLeads';
import api from '../api/axios';
import { Button } from '../components/ui/button';
import { 
  Plus, 
  Download, 
  LogOut, 
  Users 
} from 'lucide-react';

// Components
import { SearchInput } from '../components/Filters/SearchInput';
import { FilterBar } from '../components/Filters/FilterBar';
import { LeadTable } from '../components/LeadTable/LeadTable';
import { LeadTableSkeleton } from '../components/LeadTable/LeadTableSkeleton';
import { EmptyState } from '../components/LeadTable/EmptyState';
import { Pagination } from '../components/LeadTable/Pagination';
import { LeadFormModal } from '../components/LeadForm/LeadFormModal';
import { ThemeToggle } from '../components/ThemeToggle';

export const DashboardPage = () => {
  const { user, logout } = useAuthStore();
  
  // State for filters and pagination
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [source, setSource] = useState('');
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch data using our React Query hook
  const { data, isLoading } = useLeads({ page, limit: 10, search, status, source });

  // Handle CSV Export
  const handleExportCSV = async () => {
    try {
      const response = await api.get('/leads/export/csv', {
        params: { status, source, search },
        responseType: 'blob', // Crucial for downloading files!
      });
      
      // Create a temporary link to trigger the browser download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `leads_export_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Failed to export CSV', error);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0c0d0e] text-slate-800 dark:text-slate-100 transition-colors duration-300 font-sans p-4 sm:p-6 md:p-8 overflow-x-hidden">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-2 border-b border-slate-200/50 dark:border-slate-800/10">
          <div>
            <h1 className="font-heading text-4xl md:text-5xl font-normal text-slate-900 dark:text-white tracking-tight">
              Leads Dashboard
            </h1>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-2 font-medium">
              Welcome back, <span className="font-bold text-slate-700 dark:text-slate-350">{user?.name}</span>
            </p>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            {/* Dark Mode Toggle */}
            <ThemeToggle />

            {/* CSV Export (Admin only) */}
            {user?.role === 'admin' && (
              <Button variant="outline" className="h-10 rounded-full border-slate-200/50 dark:border-slate-800/10 px-5 shadow-sm text-xs font-semibold" onClick={handleExportCSV}>
                <Download className="mr-2 h-4 w-4" /> Export CSV
              </Button>
            )}
            
            {/* Add Lead button */}
            <Button onClick={() => setIsModalOpen(true)} className="h-10 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold text-xs shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all px-5">
              <Plus className="mr-1.5 h-4 w-4" /> Add Lead
            </Button>

            {/* Logout Button */}
            <Button 
              variant="ghost" 
              size="icon"
              className="h-10 w-10 rounded-full text-red-500 hover:text-red-650 hover:bg-red-500/5 dark:hover:bg-red-500/10 shadow-sm" 
              onClick={logout}
              title="Logout"
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Real Dynamic KPI Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Real Dynamic Card: Total Active Leads */}
          <div className="p-6 bg-white/70 dark:bg-slate-950/20 border border-slate-200/50 dark:border-slate-800/10 rounded-3xl shadow-sm dark:shadow-[0_4px_24px_rgba(0,0,0,0.4)] flex justify-between items-center relative overflow-hidden group">
            <div className="space-y-1.5">
              <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Total Active Leads</span>
              <p className="text-4xl font-heading font-medium text-slate-900 dark:text-white">
                {isLoading ? '...' : (data?.pagination?.total ?? 0)}
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400">
              <Users className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Filters Section - Elegant Glass Row with Guard Rails */}
      <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 p-4 bg-white/60 dark:bg-slate-950/30 backdrop-blur-xl rounded-2xl border border-slate-200/50 dark:border-slate-800/10 shadow-sm">
        
        <SearchInput 
          onSearch={(term) => { 
            // 🛑 Guard Rail: Only reset page if the search term has actually altered
            if (term !== search) {
              setSearch(term); 
              setPage(1); 
            }
          }} 
        />

        <FilterBar 
          onStatusChange={(val) => { 
            // 🛑 Guard Rail: Only reset page if the status value is a genuine change
            if (val !== status) {
              setStatus(val); 
              setPage(1); 
            }
          }} 
          onSourceChange={(val) => { 
            // 🛑 Guard Rail: Only reset page if the source value is a genuine change
            if (val !== source) {
              setSource(val); 
              setPage(1); 
            }
          }} 
        />

      </div>

      {/* Table/List Card Stack Section */}
      <div className="space-y-4">
        {isLoading ? (
          <LeadTableSkeleton />
        ) : data?.data?.length > 0 ? (
          <div className="space-y-4">
            {/* 1. Pass the list down */}
            <LeadTable leads={data.data} />
            
            {/* 2. Render pagination with state hooks */}
            <div className="flex justify-center pt-2">
              <Pagination 
                currentPage={data.pagination.page} 
                totalPages={data.pagination.totalPages} 
                onPageChange={setPage} 
              />
            </div>
          </div>
        ) : (
          <div className="bg-white/60 dark:bg-slate-950/30 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/10 rounded-3xl p-12 shadow-sm">
            <EmptyState />
          </div>
        )}
      </div>

      </div>

      {/* Hidden Modal */}
      <LeadFormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};