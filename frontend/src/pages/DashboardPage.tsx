import { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { useLeads } from '../hooks/useLeads';
import api from '../api/axios';
import { Button } from '../components/ui/button';
import { Plus, Download, LogOut } from 'lucide-react';

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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Leads Dashboard</h1>
            <p className="text-gray-500 dark:text-gray-400">Welcome back, {user?.name}</p>
          </div>
          
          <div className="flex gap-3">
            {/* Admin Only CSV Export Button */}
            {user?.role === 'admin' && (
              <Button variant="outline" onClick={handleExportCSV}>
                <Download className="mr-2 h-4 w-4" /> Export CSV
              </Button>
            )}
            
            <Button onClick={() => setIsModalOpen(true)}>
              <Plus className="mr-2 h-4 w-4" /> Add Lead
            </Button>
            
            <Button variant="ghost" size="icon" onClick={logout} title="Logout">
              <LogOut className="h-5 w-5 text-gray-500" />
            </Button>

            {/* Dark Mode Toggle */}
              <ThemeToggle />
          </div>
        </div>

        {/* Filters Section */}
        <div className="flex flex-col md:flex-row justify-between gap-4 p-4 bg-white dark:bg-gray-950 rounded-lg shadow-sm border">
          <SearchInput onSearch={(term) => { setSearch(term); setPage(1); }} />
          <FilterBar 
            onStatusChange={(val) => { setStatus(val); setPage(1); }} 
            onSourceChange={(val) => { setSource(val); setPage(1); }} 
          />
        </div>

        {/* Table Section */}
        <div className="bg-white dark:bg-gray-950 rounded-lg shadow-sm">
          {isLoading ? (
            <LeadTableSkeleton />
          ) : data?.data?.length > 0 ? (
            <>
              <LeadTable leads={data.data} />
              <div className="p-4 border-t">
                <Pagination 
                  currentPage={data.pagination.page} 
                  totalPages={data.pagination.totalPages} 
                  onPageChange={setPage} 
                />
              </div>
            </>
          ) : (
            <EmptyState />
          )}
        </div>

      </div>

      {/* Hidden Modal */}
      <LeadFormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};