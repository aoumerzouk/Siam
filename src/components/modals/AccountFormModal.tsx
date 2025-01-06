import React from 'react';
import Modal from './Modal';
import AccountForm from '../account/AccountForm';
import MemberSelector from '../member/MemberSelector';
import type { Account } from '../../types/account';
import type { Member } from '../../types/member';

interface AccountFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (account: Omit<Account, 'id' | 'dateOpened'>) => void;
  members: Member[];
}

export default function AccountFormModal({ isOpen, onClose, onSubmit, members }: AccountFormModalProps) {
  const [selectedMemberId, setSelectedMemberId] = React.useState<string>('');

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Account"
    >
      <div className="space-y-6">
        <MemberSelector
          members={members}
          selectedMemberId={selectedMemberId}
          onSelect={setSelectedMemberId}
        />
        {selectedMemberId && (
          <AccountForm
            memberId={selectedMemberId}
            onSubmit={onSubmit}
          />
        )}
      </div>
    </Modal>
  );
}