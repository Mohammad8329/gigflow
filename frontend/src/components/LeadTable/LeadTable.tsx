import { useNavigate } from 'react-router-dom';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';

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
      case 'New': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'Contacted': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'Qualified': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'Lost': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="border rounded-md bg-white dark:bg-gray-950">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name & Email</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Source</TableHead>
            <TableHead>Created</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leads.map((lead) => (
            <TableRow 
              key={lead._id}
              className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
              onClick={() => navigate(`/leads/${lead._id}`)}
            >
              <TableCell>
                <div className="font-medium text-gray-900 dark:text-gray-100">{lead.name}</div>
                <div className="text-sm text-gray-500">{lead.email}</div>
              </TableCell>
              <TableCell>
                <Badge variant="outline" className={getStatusColor(lead.status)}>
                  {lead.status}
                </Badge>
              </TableCell>
              <TableCell className="text-gray-600 dark:text-gray-400">{lead.source}</TableCell>
              <TableCell className="text-gray-600 dark:text-gray-400">
                {new Date(lead.createdAt).toLocaleDateString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};