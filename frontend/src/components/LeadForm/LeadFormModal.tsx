import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { LeadForm, type LeadFormData } from './LeadForm';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../api/axios';

interface LeadFormModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LeadFormModal = ({ isOpen, onClose }: LeadFormModalProps) => {
  const queryClient = useQueryClient();

  // React Query Mutation to handle the POST request
  const createLeadMutation = useMutation({
    mutationFn: async (newLead: LeadFormData) => {
      const response = await api.post('/leads', newLead);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      onClose();
    },
    onError: (error: any) => {
      console.error('❌ Lead Creation Failed:', error.response?.data?.message || error.message);
    }
  });

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Lead</DialogTitle>
          <DialogDescription>
            Enter the details of your new lead here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        
        <LeadForm 
          onSubmit={(data) => createLeadMutation.mutate(data)} 
          isLoading={createLeadMutation.isPending} 
        />
      </DialogContent>
    </Dialog>
  );
};