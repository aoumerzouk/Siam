import React from 'react';
import { PlusCircle, Scan } from 'lucide-react';
import ScanProfileList from './ScanProfileList';
import ScanProfileForm from './ScanProfileForm';
import { useScanProfiles } from '../../../hooks/useScanProfiles';

export default function ScanProfiles() {
  const [isAddingProfile, setIsAddingProfile] = React.useState(false);
  const { profiles, loading, error, createProfile, updateProfile, deleteProfile } = useScanProfiles();

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-purple-100 p-2 rounded-full">
              <Scan className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                Scan Profiles
              </h3>
              <p className="text-sm text-gray-500">
                Manage scanning configurations for different document types
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsAddingProfile(true)}
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700"
          >
            <PlusCircle className="w-4 h-4 mr-2" />
            Add Profile
          </button>
        </div>
      </div>
      <div className="px-4 py-5 sm:p-6">
        {isAddingProfile ? (
          <ScanProfileForm 
            onSubmit={createProfile}
            onCancel={() => setIsAddingProfile(false)}
          />
        ) : (
          <ScanProfileList 
            profiles={profiles}
            loading={loading}
            error={error}
            onUpdate={updateProfile}
            onDelete={deleteProfile}
          />
        )}
      </div>
    </div>
  );
}