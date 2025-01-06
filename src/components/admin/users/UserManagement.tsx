import React from 'react';
import { Users } from 'lucide-react';
import UserList from './UserList';
import UserForm from './UserForm';
import { useUsers } from '../../../hooks/useUsers';

export default function UserManagement() {
  const [isAddingUser, setIsAddingUser] = React.useState(false);
  const { users, loading, error, createUser, updateUserRoles } = useUsers();

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            User Management
          </h3>
          <button
            onClick={() => setIsAddingUser(true)}
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            <Users className="w-4 h-4 mr-2" />
            Add User
          </button>
        </div>
      </div>
      <div className="px-4 py-5 sm:p-6">
        {isAddingUser ? (
          <UserForm 
            onSubmit={createUser}
            onCancel={() => setIsAddingUser(false)}
          />
        ) : (
          <UserList 
            users={users}
            loading={loading}
            error={error}
            onUpdateRoles={updateUserRoles}
          />
        )}
      </div>
    </div>
  );
}