import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../api/axios';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { ArrowLeft, Mail, Globe, Clock } from 'lucide-react';
import { ActivityTimeline } from '../components/ActivityTimeline/ActivityTimeline';

export const LeadDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

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

  if (leadLoading || activityLoading) return <div className="p-8 text-center animate-pulse">Loading lead details...</div>;
  if (!leadData) return <div className="p-8 text-center text-red-500">Lead not found.</div>;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Top Navigation */}
        <Button variant="ghost" onClick={() => navigate(-1)} className="-ml-4 text-gray-600">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column: Lead Info Card */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white dark:bg-gray-950 p-6 rounded-lg border shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">{leadData.name}</h2>
              <Badge className="mb-6">{leadData.status}</Badge>
              
              <div className="space-y-4">
                <div className="flex items-center text-gray-600 dark:text-gray-300">
                  <Mail className="h-4 w-4 mr-3 text-gray-400" />
                  <a href={`mailto:${leadData.email}`} className="hover:underline">{leadData.email}</a>
                </div>
                <div className="flex items-center text-gray-600 dark:text-gray-300">
                  <Globe className="h-4 w-4 mr-3 text-gray-400" />
                  <span>Source: {leadData.source}</span>
                </div>
                <div className="flex items-center text-gray-600 dark:text-gray-300">
                  <Clock className="h-4 w-4 mr-3 text-gray-400" />
                  <span>Created: {new Date(leadData.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Activity Timeline */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-950 p-6 rounded-lg border shadow-sm">
              <h3 className="text-lg font-bold mb-6 text-gray-900 dark:text-gray-100">Activity History</h3>
              <ActivityTimeline activities={activityData} />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};