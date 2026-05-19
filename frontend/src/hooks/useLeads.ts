import { useQuery } from '@tanstack/react-query';
import api from '../api/axios';

// Match this exactly to the filters we built in your backend controller
interface FetchLeadsParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  source?: string;
  sort?: string;
}

const fetchLeads = async (params: FetchLeadsParams) => {
  // Axios automatically converts the params object into a URL query string!
  // e.g. /leads?page=1&limit=10&status=New
  const { data } = await api.get('/leads', { params });
  return data; 
};

export const useLeads = (params: FetchLeadsParams) => {
  return useQuery({
    // The queryKey acts like a useEffect dependency array. 
    // If the user changes the page from 1 to 2, React Query automatically refetches!
    queryKey: ['leads', params], 
    queryFn: () => fetchLeads(params),
    // This keeps the current table data visible while fetching the next page, preventing ugly UI flickering
    placeholderData: (previousData) => previousData, 
  });
};