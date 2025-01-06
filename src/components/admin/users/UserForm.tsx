import React from 'react';
import type { CreateUserData } from '../../../types/user';
import type { Role } from '../../../types/permissions';
import { useRoles } from '../../../hooks/useRoles';

interface UserFormProps {
  onSubmit: (data: CreateUserData) => Promise<void>;
  onCancel: () => void;
}

export default function UserForm({ onSubmit, onCancel }: UserFormProps) {
  const { roles } = useRoles();
  const [formData, setFormData] = React.useState<CreateUserData>({
    email: '',
    password: '',
    roleIds: []
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
    onCancel();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          required
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Password</label>
        <input
          type="password"
          required
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Roles</label>
        <select
          multiple
          value={formData.roleIds}
          onChange={(e) => {
            const selectedRoles = Array.from(e.target.selectedOptions, option => option.value);
            setFormData({ ...formData, roleIds: selectedRoles });
          }}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        >
          {roles.map((role) => (
            <option key={role.id} value={role.id}>
              {role.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
        >
          Create User
        </button>
      </div>
    </form>
  );
}