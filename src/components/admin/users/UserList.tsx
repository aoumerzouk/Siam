import React from 'react';
import { User, Shield, Calendar, Mail, Key } from 'lucide-react';
import type { AppUser } from '../../../types/user';
import type { Role } from '../../../types/permissions';
import { useRoles } from '../../../hooks/useRoles';
import LoadingSpinner from '../../LoadingSpinner';

interface UserListProps {
  users: AppUser[];
  loading: boolean;
  error: Error | null;
  onUpdateRoles: (userId: string, roles: Role['id'][]) => Promise<void>;
}

export default function UserList({ users, loading, error, onUpdateRoles }: UserListProps) {
  const { roles } = useRoles();
  const [editingUserId, setEditingUserId] = React.useState<string | null>(null);

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="text-red-500">Error: {error.message}</div>;

  return (
    <div className="space-y-6">
      {users.map((user) => (
        <div 
          key={user.id} 
          className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
        >
          {/* Header */}
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-100 p-2 rounded-full">
                  <User className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    {user.email}
                  </h3>
                  <p className="text-sm text-gray-500">
                    User ID: {user.id}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setEditingUserId(editingUserId === user.id ? null : user.id)}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                {editingUserId === user.id ? 'Done' : 'Edit Roles'}
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-4">
            <div className="grid grid-cols-2 gap-4">
              {/* User Details */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-gray-500">User Details</h4>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span>{user.email}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span>Created: {user.createdAt.toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              {/* Roles */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-gray-500">Roles & Permissions</h4>
                {editingUserId === user.id ? (
                  <div className="space-y-2">
                    <select
                      multiple
                      value={user.roles.map(r => r.id)}
                      onChange={(e) => {
                        const selectedRoles = Array.from(
                          e.target.selectedOptions, 
                          option => option.value
                        );
                        onUpdateRoles(user.id, selectedRoles);
                      }}
                      className="block w-full rounded-md border-gray-300 shadow-sm 
                        focus:border-blue-500 focus:ring-blue-500 text-sm"
                      size={4}
                    >
                      {roles.map((role) => (
                        <option key={role.id} value={role.id}>
                          {role.name}
                        </option>
                      ))}
                    </select>
                    <p className="text-xs text-gray-500">
                      Hold Ctrl/Cmd to select multiple roles
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {user.roles.map((role) => (
                      <div 
                        key={role.id}
                        className="inline-flex items-center space-x-1 bg-blue-50 
                          text-blue-700 px-2 py-1 rounded-md text-sm mr-2"
                      >
                        <Shield className="w-3 h-3" />
                        <span>{role.name}</span>
                      </div>
                    ))}
                    {user.roles.length === 0 && (
                      <p className="text-sm text-gray-500">No roles assigned</p>
                    )}
                  </div>
                )}
              </div>

              {/* Permissions */}
              <div className="col-span-2 space-y-3">
                <h4 className="text-sm font-medium text-gray-500">Effective Permissions</h4>
                <div className="flex flex-wrap gap-2">
                  {Array.from(
                    new Set(user.roles.flatMap(role => role.permissions))
                  ).map((permission) => (
                    <div 
                      key={permission}
                      className="inline-flex items-center space-x-1 bg-green-50 
                        text-green-700 px-2 py-1 rounded-md text-sm"
                    >
                      <Key className="w-3 h-3" />
                      <span>{permission}</span>
                    </div>
                  ))}
                  {user.roles.length === 0 && (
                    <p className="text-sm text-gray-500">No permissions granted</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {users.length === 0 && (
        <div className="text-center py-6 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <User className="w-12 h-12 text-gray-400 mx-auto mb-2" />
          <h3 className="text-sm font-medium text-gray-900">No users found</h3>
          <p className="text-sm text-gray-500">
            Add a new user to get started
          </p>
        </div>
      )}
    </div>
  );
}