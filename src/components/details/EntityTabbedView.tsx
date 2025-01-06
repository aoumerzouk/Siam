import React from 'react';
import TabView from '../common/TabView';
import EntityDetails from './EntityDetails';
import DocumentList from '../DocumentList';
import type { MemberIdentifier, AccountIdentifier } from '../../types/creditUnion';

interface EntityTabbedViewProps {
  selectedEntity: MemberIdentifier | AccountIdentifier | null;
}

export default function EntityTabbedView({ selectedEntity }: EntityTabbedViewProps) {
  if (!selectedEntity) {
    return (
      <div className="flex-1 p-6 flex items-center justify-center text-gray-500">
        Select a member or account to view details
      </div>
    );
  }

  const isMember = 'memberNumber' in selectedEntity;
  const tabs = [
    {
      id: 'info',
      label: isMember ? 'Member Info' : 'Account Info',
      content: <EntityDetails selectedEntity={selectedEntity} />
    },
    {
      id: 'documents',
      label: isMember ? 'Member Documents' : 'Account Documents',
      content: <DocumentList selectedEntity={selectedEntity} />
    }
  ];

  return <TabView tabs={tabs} />;
}