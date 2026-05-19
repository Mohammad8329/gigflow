import Activity from '../models/Activity.model';

interface LogActivityParams {
  leadId: any;
  userId: any;
  userName: string;
  action: 'created' | 'updated' | 'deleted' | 'status_changed' | 'note_added';
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