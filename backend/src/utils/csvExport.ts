import { ILead } from '../models/Lead.model';

export const generateCSV = (leads: ILead[]): string => {
  // 1. Define the headers
  const headers = ['Name', 'Email', 'Status', 'Source', 'Created At'];
  
  // 2. Map the data rows, wrapping strings in quotes to prevent commas from breaking columns
  const rows = leads.map((lead) => [
    `"${lead.name}"`,
    `"${lead.email}"`,
    `"${lead.status}"`,
    `"${lead.source}"`,
    `"${new Date(lead.createdAt).toLocaleDateString()}"`
  ]);

  // 3. Join it all together with newline characters
  return [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
};