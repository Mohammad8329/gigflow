import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { LeadForm, type LeadFormData } from './LeadForm';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../api/axios';

interface LeadFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  lead?: {
    _id: string;
    name: string;
    email: string;
    status: string;
    source: string;
  };
}

export const LeadFormModal = ({ isOpen, onClose, lead }: LeadFormModalProps) => {
  const queryClient = useQueryClient();

  // React Query Mutation to handle POST (Create) or PUT (Update)
  const submitLeadMutation = useMutation({
    mutationFn: async (formData: LeadFormData) => {
      if (lead?._id) {
        const response = await api.put(`/leads/${lead._id}`, formData);
        return response.data;
      } else {
        const response = await api.post('/leads', formData);
        return response.data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      if (lead?._id) {
        queryClient.invalidateQueries({ queryKey: ['lead', lead._id] });
        queryClient.invalidateQueries({ queryKey: ['activities', lead._id] });
      }
      onClose();
    },
    onError: (error: any) => {
      console.error('❌ Lead Operation Failed:', error.response?.data?.message || error.message);
    }
  });

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px] bg-white/95 dark:bg-slate-950/95 border-slate-200/50 dark:border-slate-800/10 rounded-[2rem] shadow-xl backdrop-blur-md">
        <DialogHeader>
          <DialogTitle className="font-heading text-2xl font-normal text-slate-900 dark:text-white">
            {lead?._id ? 'Edit Lead Details' : 'Add New Lead'}
          </DialogTitle>
          <DialogDescription className="text-slate-400 dark:text-slate-500 text-xs">
            {lead?._id 
              ? 'Update the lead details below. Click save when you are finished.' 
              : 'Enter the details of your new lead here. Click save when you are done.'}
          </DialogDescription>
        </DialogHeader>
        
        <LeadForm 
          initialData={lead ? {
            name: lead.name,
            email: lead.email,
            status: lead.status,
            source: lead.source
          } : undefined}
          onSubmit={(data) => submitLeadMutation.mutate(data)} 
          isLoading={submitLeadMutation.isPending} 
        />
      </DialogContent>
    </Dialog>
  );
};