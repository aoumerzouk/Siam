import React from 'react';
import { Shield, Key, Trash2, Edit2 } from 'lucide-react';
import type { Role } from '../../../types/permissions';
import LoadingSpinner from '../../LoadingSpinner';

interface RoleListProps {
  roles: Role[];
  loading: boolean;
  error: Error | null;
  onUpdate: (id: string, role: Partial<Role>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export default function RoleList({ 
  roles, 
  loading, 
  error,
  onUpdate,
  onDelete 
}: RoleListProps) {
  const [editingId, setEditingId] = React.useState<string | null>(null);

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="text-red-500">Error: {error.message}</div>;

  return (
    <div className="space-y-4">
      {roles.map((role) => (
        <div 
          key={role.id} 
          className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
        >
          <div className="px-4 py-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="bg-purple-100 p-2 rounded-full">
                  <Shield className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{role.name}</h3>
                  <p className="text-sm text-gray-500">{role.description}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setEditingId(editingId === role.id ? null : role.id)}
                  className="p-1 text-gray-400 hover:text-gray-500"
                  title="Edit role"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                {!role.isSystem && (
                  <button
                    onClick={() => onDelete(role.id)}
                    className="p-1 text-red-400 hover:text-red-500"
                    title="Delete role"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-sm font-medium text-gray-500">Permissions</h4>
              <div className="flex flex-wrap gap-2">
                {role.permissions.map((permission) => (
                  <div 
                    key={permission}
                    className="inline-flex items-center space-x-1 bg-purple-50 text-purple-700 px-2 py-1 rounded-md text-sm"
                  >
                    <Key className="w-3 h-3" />
                    <span>{permission}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}

      {roles.length === 0 && (
        <div className="text-center py-6 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <Shield className="w-12 h-12 text-gray-400 mx-auto mb-2" />
          <h3 className="text-sm font-medium text-gray-900">No roles defined</h3>
          <p className="text-sm text-gray-500">
            Create a new role to get started
          </p>
        </div>
      )}
    </div>
  );
}