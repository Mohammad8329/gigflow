import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import api from '../api/axios';
import { Button } from '../components/ui/button';
import { useAuthStore } from '../store/authStore';
import { ArrowLeft, Mail, Globe, Clock, Edit2, Trash2 } from 'lucide-react';
import { ActivityTimeline } from '../components/ActivityTimeline/ActivityTimeline';
import { LeadFormModal } from '../components/LeadForm/LeadFormModal';

export const LeadDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  
  // State for Edit Modal
  const [isEditOpen, setIsEditOpen] = useState(false);

  // Fetch the single lead
  const { data: leadData, isLoading: leadLoading } = useQuery({
    queryKey: ['lead', id],
    queryFn: async () => {
      const response = await api.get(`/leads/${id}`);
      return response.data.data;
    }
  });

  // Fetch the lead's activities
  const { data: activityData, isLoading: activityLoading } = useQuery({
    queryKey: ['activities', id],
    queryFn: async () => {
      const response = await api.get(`/leads/${id}/activity`);
      return response.data.data;
    }
  });

  // Delete Lead Mutation (Restricted to Admins)
  const deleteLeadMutation = useMutation({
    mutationFn: async () => {
      await api.delete(`/leads/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      navigate('/');
    },
    onError: (error: any) => {
      console.error('❌ Lead deletion failed:', error.response?.data?.message || error.message);
    }
  });

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

  if (leadLoading || activityLoading) return <div className="p-8 text-center animate-pulse text-slate-400">Loading lead details...</div>;
  if (!leadData) return <div className="p-8 text-center text-red-500">Lead not found.</div>;

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0c0d0e] text-slate-800 dark:text-slate-100 p-6 transition-colors duration-300 font-sans">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Top Navigation */}
        <div className="flex justify-between items-center">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)} 
            className="rounded-full hover:bg-slate-150 dark:hover:bg-slate-900/60 text-slate-500 dark:text-slate-400 text-xs font-semibold px-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
          </Button>

          <div className="flex items-center gap-2.5">
            {/* Edit Lead Button */}
            <Button 
              variant="outline" 
              className="h-10 rounded-full border-slate-200/50 dark:border-slate-800/10 px-5 shadow-sm text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-900/40"
              onClick={() => setIsEditOpen(true)}
            >
              <Edit2 className="mr-2 h-4 w-4 text-blue-600" /> Edit Lead
            </Button>

            {/* Delete Lead Button (VIP Admin only) */}
            {user?.role === 'admin' && (
              <Button 
                variant="outline" 
                className="h-10 rounded-full border-red-200/50 dark:border-red-950/20 px-5 shadow-sm text-xs font-bold bg-red-500/5 hover:bg-red-500/10 text-red-600 dark:text-red-400 hover:text-red-700"
                onClick={() => {
                  if (confirm('Are you sure you want to permanently delete this lead?')) {
                    deleteLeadMutation.mutate();
                  }
                }}
                disabled={deleteLeadMutation.isPending}
              >
                <Trash2 className="mr-2 h-4 w-4" /> Delete Lead
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Lead Info Card */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white/70 dark:bg-slate-950/20 backdrop-blur-md p-6 rounded-[2rem] border border-slate-200/50 dark:border-slate-800/10 shadow-sm">
              <h2 className="font-heading text-3xl font-normal text-slate-900 dark:text-white mb-3">
                {leadData.name}
              </h2>
              
              <div className="mb-8">
                <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full tracking-wide shadow-sm ${getStatusColor(leadData.status)}`}>
                  {leadData.status}
                </span>
              </div>
              
              <div className="space-y-4 pt-6 border-t border-slate-200/50 dark:border-slate-800/10">
                <div className="flex items-center text-slate-600 dark:text-slate-350 text-sm">
                  <Mail className="h-4 w-4 mr-3 text-slate-400" />
                  <a href={`mailto:${leadData.email}`} className="hover:underline font-medium">{leadData.email}</a>
                </div>
                <div className="flex items-center text-slate-600 dark:text-slate-350 text-sm">
                  <Globe className="h-4 w-4 mr-3 text-slate-400" />
                  <span className="font-medium">Source: {leadData.source}</span>
                </div>
                <div className="flex items-center text-slate-600 dark:text-slate-355 text-sm">
                  <Clock className="h-4 w-4 mr-3 text-slate-400" />
                  <span className="font-medium">Created: {new Date(leadData.createdAt).toLocaleDateString(undefined, {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                  })}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Activity Timeline */}
          <div className="lg:col-span-2">
            <div className="bg-white/70 dark:bg-slate-950/20 backdrop-blur-md p-8 rounded-[2rem] border border-slate-200/50 dark:border-slate-800/10 shadow-sm space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-slate-200/50 dark:border-slate-800/10">
                <h3 className="font-heading text-2xl font-normal text-slate-900 dark:text-white">
                  Activity History
                </h3>
              </div>
              
              <ActivityTimeline activities={activityData} />
            </div>
          </div>

        </div>
      </div>

      {/* Reusable Edit Modal */}
      <LeadFormModal 
        isOpen={isEditOpen} 
        onClose={() => setIsEditOpen(false)} 
        lead={leadData} 
      />
    </div>
  );
};