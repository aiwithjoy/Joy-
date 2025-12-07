import React from 'react';
import { LayoutDashboard, Bookmark, Settings, LogOut, FileText, Calendar, Users, HelpCircle } from 'lucide-react';

interface SidebarProps {
  activeTab: 'feed' | 'saved';
  onTabChange: (tab: 'feed' | 'saved') => void;
  savedCount: number;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange, savedCount }) => {
  const navItems = [
    { id: 'feed', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'saved', label: 'Saved Items', icon: Bookmark, badge: savedCount },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'analytics', label: 'Analytics', icon: FileText },
    { id: 'team', label: 'Team', icon: Users },
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-100 h-screen sticky top-0 flex flex-col hidden md:flex">
      <div className="p-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white font-bold text-lg">
            D
          </div>
          <span className="text-xl font-bold text-gray-900 tracking-tight">Donezo</span>
        </div>
      </div>

      <div className="flex-1 px-4 space-y-1">
        <div className="mb-6 px-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
          Menu
        </div>
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => (item.id === 'feed' || item.id === 'saved') ? onTabChange(item.id as any) : null}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all group ${
              activeTab === item.id && (item.id === 'feed' || item.id === 'saved')
                ? 'bg-brand-50 text-brand-700'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <div className="flex items-center gap-3">
              <item.icon className={`w-5 h-5 ${
                 activeTab === item.id && (item.id === 'feed' || item.id === 'saved') ? 'text-brand-600' : 'text-gray-400 group-hover:text-gray-500'
              }`} />
              {item.label}
            </div>
            {item.badge ? (
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                 activeTab === item.id 
                 ? 'bg-brand-200 text-brand-800' 
                 : 'bg-gray-100 text-gray-600'
              }`}>
                {item.badge}
              </span>
            ) : null}
          </button>
        ))}

        <div className="mt-8 mb-6 px-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
          General
        </div>
        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors">
          <Settings className="w-5 h-5 text-gray-400" />
          Settings
        </button>
        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors">
          <HelpCircle className="w-5 h-5 text-gray-400" />
          Help
        </button>
        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors">
          <LogOut className="w-5 h-5 text-gray-400" />
          Logout
        </button>
      </div>

      <div className="p-4 border-t border-gray-100">
        <div className="bg-gray-900 rounded-xl p-4 text-white relative overflow-hidden group cursor-pointer">
           <div className="absolute top-0 right-0 w-20 h-20 bg-brand-500 rounded-full blur-2xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
           <p className="font-semibold text-sm mb-1 relative z-10">Get Mobile App</p>
           <p className="text-gray-400 text-xs mb-3 relative z-10">Manage leads on the go</p>
           <button className="w-full py-1.5 bg-brand-600 hover:bg-brand-500 rounded text-xs font-medium transition-colors relative z-10">
             Download
           </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;