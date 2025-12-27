import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface NavigationProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  userRole?: 'admin' | 'manager' | 'technician' | 'portal';
}

const allTabs = [
  { id: 'admin', label: 'Admin', path: '/admin', roles: ['admin'] },
  { id: 'dashboard', label: 'Dashboard', path: '/', roles: ['admin', 'manager', 'technician', 'portal'] },
  { id: 'calendar', label: 'Maintenance Calendar', path: '/calendar', roles: ['admin', 'manager', 'technician'] },
  { id: 'equipment', label: 'Equipment', path: '/equipment', roles: ['admin', 'manager', 'technician'] },
  { id: 'reporting', label: 'Reports', path: '/reports', roles: ['admin', 'manager', 'technician'] },
  { id: 'teams', label: 'Teams', path: '/teams', roles: ['admin', 'manager', 'technician'] },
];

export default function Navigation({ activeTab = 'dashboard', onTabChange, userRole = 'portal' }: NavigationProps) {
  const router = useRouter();
  const [currentTab, setCurrentTab] = useState(activeTab);

  // Filter tabs based on user role
  const tabs = allTabs.filter(tab => tab.roles.includes(userRole));

  const handleTabClick = (tabId: string, path: string) => {
    setCurrentTab(tabId);
    if (onTabChange) {
      onTabChange(tabId);
    }
    // Navigate to the tab's path
    if (path) {
      router.push(path);
    }
  };

  return (
    <div className="dashboard-navigation">
      <div className="nav-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`nav-tab ${currentTab === tab.id ? 'nav-tab-active' : ''}`}
            onClick={() => handleTabClick(tab.id, tab.path)}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}


