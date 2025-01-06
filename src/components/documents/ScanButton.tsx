import React, { useState } from 'react';
import { Scan } from 'lucide-react';
import ScanModal from './ScanModal';
import type { MemberIdentifier, AccountIdentifier } from '../../types/creditUnion';
import { usePermissions } from '../../contexts/PermissionContext';

interface ScanButtonProps {
  selectedEntity: MemberIdentifier | AccountIdentifier | null;
  onScan: (imageData: Blob, metadata: {
    title: string;
    tags: string[];
    retentionPolicyId?: string;
  }) => Promise<void>;
}

export default function ScanButton({ selectedEntity, onScan }: ScanButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { hasPermission } = usePermissions();

  if (!hasPermission('SCAN_DOCUMENTS')) {
    return null;
  }

  if (!selectedEntity) {
    return (
      <button 
        disabled
        className="bg-gray-400 text-white px-4 py-2 rounded-lg cursor-not-allowed flex items-center gap-2"
        title="Select a member or account to scan documents"
      >
        <Scan className="w-4 h-4" />
        <span>Scan</span>
      </button>
    );
  }

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 flex items-center gap-2"
      >
        <Scan className="w-4 h-4" />
        <span>Scan</span>
      </button>

      <ScanModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedEntity={selectedEntity}
        onScan={onScan}
      />
    </>
  );
}