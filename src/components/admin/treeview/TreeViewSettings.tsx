import React from 'react';
import { PlusCircle } from 'lucide-react';
import TreeViewEditor from './TreeViewEditor';
import { EntityType } from '../../../types/entity';

export default function TreeViewSettings() {
  const [selectedEntityType, setSelectedEntityType] = React.useState<EntityType>('member');

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Folder Structure Settings
          </h3>
          <div className="flex space-x-3">
            <select
              value={selectedEntityType}
              onChange={(e) => setSelectedEntityType(e.target.value as EntityType)}
              className="block rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="member">Member Templates</option>
              <option value="account">Account Templates</option>
            </select>
          </div>
        </div>
      </div>
      <div className="px-4 py-5 sm:p-6">
        <TreeViewEditor entityType={selectedEntityType} />
      </div>
    </div>
  );
}