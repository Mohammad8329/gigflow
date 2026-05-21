import Activity from '../models/Activity.model';

interface LogActivityParams {
  leadId: any;
  userId: any;
  userName: string;
  // 👇 Added 'source_changed' and 'email_changed' to the allowed list
  action: 'created' | 'updated' | 'deleted' | 'status_changed' | 'source_changed' | 'email_changed' | 'note_added';
  field?: string;
  oldValue?: string;
  newValue?: string;
  note?: string;
}

export const logActivity = async (params: LogActivityParams): Promise<void> => {
  try {
    // Fire and forget: We create the log without forcing the main request to wait
    await Activity.create(params);
  } catch (error) {
    console.error('Activity Logging Error:', error);
  }
};