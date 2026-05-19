import { formatDistanceToNow } from 'date-fns';

export interface Activity {
  _id: string;
  action: string;
  userName: string;
  field?: string;
  oldValue?: string;
  newValue?: string;
  createdAt: string;
}

interface ActivityItemProps {
  activity: Activity;
}

export const ActivityItem = ({ activity }: ActivityItemProps) => {
  const getActionText = () => {
    switch (activity.action) {
      case 'created': return 'created this lead';
      case 'updated': return 'updated the lead details';
      case 'status_changed': return `changed status from ${activity.oldValue} to ${activity.newValue}`;
      case 'deleted': return 'deleted the lead';
      default: return 'performed an action';
    }
  };

  return (
    <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
      {/* Timeline Dot */}
      <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
        <div className="w-2 h-2 bg-slate-500 rounded-full"></div>
      </div>
      
      {/* Activity Card */}
      <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white dark:bg-gray-800 p-4 rounded border shadow-sm">
        <div className="flex items-center justify-between mb-1">
          <span className="font-semibold text-sm text-gray-900 dark:text-gray-100">{activity.userName}</span>
          <span className="text-xs text-gray-500 font-medium">
            {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}
          </span>
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-300">
          {getActionText()}
        </div>
      </div>
    </div>
  );
};