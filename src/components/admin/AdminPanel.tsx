import React from 'react';
import { Settings, Scan, Users, Shield, Clock } from 'lucide-react';
import TreeViewSettings from './treeview/TreeViewSettings';
import ScanProfiles from './scan/ScanProfiles';
import UserManagement from './users/UserManagement';
import RoleManagement from './roles/RoleManagement';
import RetentionPolicyManagement from './retention/RetentionPolicyManagement';

type TabType = 'treeview' | 'scan' | 'users' | 'roles' | 'retention';

export default function AdminPanel() {
  const [activeTab, setActiveTab] = React.useState<TabType>('treeview');

  return (
    <div className="flex-1 bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 px-6" aria-label="Tabs">
          <button
            onClick={() => setActiveTab('treeview')}
            className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2
              ${activeTab === 'treeview'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
          >
            <Settings className="w-4 h-4" />
            <span>TreeView Settings</span>
          </button>
          <button
            onClick={() => setActiveTab('scan')}
            className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2
              ${activeTab === 'scan'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
          >
            <Scan className="w-4 h-4" />
            <span>Scan Profiles</span>
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2
              ${activeTab === 'users'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
          >
            <Users className="w-4 h-4" />
            <span>User Management</span>
          </button>
          <button
            onClick={() => setActiveTab('roles')}
            className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2
              ${activeTab === 'roles'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
          >
            <Shield className="w-4 h-4" />
            <span>Role Management</span>
          </button>
          <button
            onClick={() => setActiveTab('retention')}
            className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2
              ${activeTab === 'retention'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
          >
            <Clock className="w-4 h-4" />
            <span>Retention Policies</span>
          </button>
        </nav>
      </div>
      <div className="p-6">
        {activeTab === 'treeview' && <TreeViewSettings />}
        {activeTab === 'scan' && <ScanProfiles />}
        {activeTab === 'users' && <UserManagement />}
        {activeTab === 'roles' && <RoleManagement />}
        {activeTab === 'retention' && <RetentionPolicyManagement />}
      </div>
    </div>
  );
}