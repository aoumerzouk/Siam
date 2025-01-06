import React from 'react';
import { Upload } from 'lucide-react';
import type { MemberIdentifier, AccountIdentifier } from '../../types/creditUnion';
import ScanButton from './ScanButton';
import CaptureButton from './CaptureButton';
import { usePermissions } from '../../contexts/PermissionContext';

interface DocumentActionsProps {
  selectedEntity: MemberIdentifier | AccountIdentifier | null;
  onUpload: (file: File, metadata: {
    title: string;
    tags: string[];
    retentionPolicyId?: string;
  }) => Promise<void>;
  onScan: (imageData: Blob, metadata: {
    title: string;
    tags: string[];
    retentionPolicyId?: string;
  }) => Promise<void>;
  onCapture: (imageData: Blob, metadata: {
    title: string;
    tags: string[];
    retentionPolicyId?: string;
  }) => Promise<void>;
}

export default function DocumentActions({ 
  selectedEntity, 
  onUpload,
  onScan,
  onCapture
}: DocumentActionsProps) {
  const { hasPermission } = usePermissions();

  if (!selectedEntity) {
    return (
      <div className="flex gap-2">
        <button 
          disabled
          className="bg-gray-400 text-white px-4 py-2 rounded-lg cursor-not-allowed flex items-center gap-2"
          title="Select a member or account to upload documents"
        >
          <Upload className="w-4 h-4" />
          <span>Upload</span>
        </button>
        <ScanButton selectedEntity={null} onScan={onScan} />
        <CaptureButton selectedEntity={null} onCapture={onCapture} />
      </div>
    );
  }

  return (
    <div className="flex gap-2">
      {hasPermission('CREATE_DOCUMENTS') && (
        <button
          onClick={() => {/* Implement upload dialog */}}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <Upload className="w-4 h-4" />
          <span>Upload</span>
        </button>
      )}
      <ScanButton selectedEntity={selectedEntity} onScan={onScan} />
      <CaptureButton selectedEntity={selectedEntity} onCapture={onCapture} />
    </div>
  );
}