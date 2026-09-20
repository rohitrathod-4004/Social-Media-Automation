import { useState, useEffect } from 'react';
import { Share2Icon, ClockIcon, SendIcon, ActivityIcon, SparklesIcon, Edit3Icon } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { Button } from '../components/ui/Button';
import { PLATFORMS } from '../assets/assets';
import { StatusBadge } from '../components/ui/StatusBadge';

const Dashboard = () => {
  const [stats, setStats] = useState({ scheduled: 0, published: 0, drafts: 0, connectedAccounts: 0 });
  const [activities, setActivities] = useState<any[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [postsRes, accountsRes, activityRes] = await Promise.all([
          api.get("/api/posts"), 
          api.get("/api/accounts"), 
          api.get("/api/activity")
        ]);
        
        const posts = postsRes.data;
        setStats({
          scheduled: posts.filter((p: any) => p.status === 'scheduled').length,
          published: posts.filter((p: any) => p.status === 'published').length,
          drafts: posts.filter((p: any) => p.status === 'draft').length,
          connectedAccounts: accountsRes.data.filter((a: any) => a.status === 'connected').length
        });

        setActivities(activityRes.data);
      } catch (error: any) {
        console.error("Error fetching dashboard data", error);
      }
    };
    fetchDashboardData();
  }, []);

  const statCards = [
    {
      label: "Scheduled Posts",
      value: stats.scheduled,
      icon: ClockIcon,
    },
    {
      label: "Published Posts",
      value: stats.published,
      icon: SendIcon,
    },
    {
      label: "Drafts",
      value: stats.drafts,
      icon: Edit3Icon,
    },
    {
      label: "Connected Accounts",
      value: stats.connectedAccounts,
      icon: Share2Icon,
    },
  ];

  // Helper to map activity actionType to status badge type
  const getStatusFromActionType = (actionType: string) => {
    switch (actionType) {
      case "POST_PUBLISHED": return "published";
      case "POST_SCHEDULED": return "scheduled";
      case "POST_FAILED": return "failed";
      default: return "draft";
    }
  };

  // Helper to extract platform info from description
  const getPlatformFromDescription = (description: string) => {
    const lowerDesc = description.toLowerCase();
    return PLATFORMS.find(p => lowerDesc.includes(p.id) || lowerDesc.includes(p.name.toLowerCase()));
  };

  return (
    <div className="space-y-8 pb-12 max-w-7xl mx-auto">

      {/* Header & Quick Action */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mt-4">
        <div>
          <h1 className="text-3xl font-sans font-semibold tracking-tight text-slate-900">Command Center</h1>
          <p className="text-sm text-slate-500 mt-1">Here's what's happening with your social accounts today.</p>
        </div>
        <Link to="/aicomposer" className="shrink-0">
          <Button variant="primary" className="w-full sm:w-auto shadow-md rounded-xl flex items-center justify-center gap-2">
            <SparklesIcon className="size-4" />
            Create Post
          </Button>
        </Link>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {statCards.map((card) => (
          <div key={card.label} className="bg-white hover:bg-primary-soft group border border-slate-200 rounded-2xl p-5 hover:border-primary-border transition-colors">
            <div className="flex items-start justify-between mb-3">
              <div className="p-2 bg-slate-50 group-hover:bg-white rounded-lg transition-colors border border-slate-100">
                <card.icon className="size-5 text-slate-400 group-hover:text-primary transition-colors" />
              </div>
            </div>
            <div className="text-3xl font-semibold text-slate-800 tabular-nums tracking-tight leading-none mb-1">
              {card.value}
            </div>
            <p className="text-xs sm:text-sm font-medium text-slate-500">{card.label}</p>
          </div>
        ))}
      </div>

      {/* Activity feed */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-slate-50/50">
          <h2 className="font-semibold text-slate-800 text-lg tracking-tight">Recent Activity</h2>
          <span className="text-xs font-medium text-slate-500 bg-slate-200/50 px-2.5 py-1 rounded-full">{activities.length} events</span>
        </div>

        {activities.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 px-6 text-center">
            <div className="size-16 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center mb-4">
              <ActivityIcon className="size-8 text-slate-300" />
            </div>
            <h3 className="text-slate-800 font-semibold mb-1">No activity yet</h3>
            <p className="text-slate-500 text-sm max-w-sm mb-6">Connect your social accounts and schedule your first AI-generated post to see events here.</p>
            <Link to="/aicomposer">
              <Button variant="ghost" className="border-slate-200 rounded-xl hover:bg-slate-50 text-slate-600">
                Go to AI Composer
              </Button>
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-slate-50">
            {activities.map((activity) => {
              const platformMeta = getPlatformFromDescription(activity.description);
              const PlatformIcon = platformMeta ? platformMeta.icon : SendIcon;
              const mappedStatus = getStatusFromActionType(activity.actionType);

              return (
                <div key={activity._id} className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 px-6 py-5 hover:bg-slate-50/50 transition-colors">
                  
                  {/* Platform Icon */}
                  <div className={`size-10 sm:size-12 rounded-xl flex items-center justify-center shrink-0 border ${platformMeta ? 'bg-white border-slate-100 text-slate-600 shadow-sm' : 'bg-slate-50 border-transparent text-slate-400'}`}>
                    <PlatformIcon className="size-5" />
                  </div>
                  
                  {/* Main Content */}
                  <div className="flex-1 min-w-0 flex flex-col gap-1">
                    <p className="text-sm font-medium text-slate-700 truncate">{activity.description}</p>
                    <span className="text-xs text-slate-400">
                        {activity.createdAt && !Number.isNaN(new Date(activity.createdAt).getTime())
                          ? new Date(activity.createdAt).toLocaleString(undefined, {
                              month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit'
                            })
                          : "Date unavailable"}
                    </span>
                  </div>

                  {/* Status Badge */}
                  <div className="shrink-0 self-start sm:self-auto mt-2 sm:mt-0">
                     <StatusBadge status={mappedStatus as any} />
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  )
}

export default Dashboard;