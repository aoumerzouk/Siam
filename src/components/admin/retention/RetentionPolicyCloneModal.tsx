import React, { useState } from 'react';
import { AlertCircle } from 'lucide-react';
import Modal from '../../modals/Modal';
import type { RetentionPolicy } from '../../../types/retention';
import { formatRetentionPeriod } from '../../../utils/retentionUtils';

interface RetentionPolicyCloneModalProps {
  policy: RetentionPolicy;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (policyData: Omit<RetentionPolicy, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
}

export default function RetentionPolicyCloneModal({ 
  policy, 
  isOpen, 
  onClose,
  onSubmit
}: RetentionPolicyCloneModalProps) {
  const [formData, setFormData] = useState<Omit<RetentionPolicy, 'id' | 'createdAt' | 'updatedAt'>>({
    name: `${policy.name} (Copy)`,
    description: policy.description,
    retentionYears: policy.retentionYears,
    action: policy.action,
    notifyBeforeAction: policy.notifyBeforeAction,
    notifyDaysBefore: policy.notifyDaysBefore
  });
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await onSubmit(formData);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save policy');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Rest of the component remains the same until the buttons...

  <div className="flex justify-end space-x-3">
    <button
      type="button"
      onClick={onClose}
      className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-500"
      disabled={isSubmitting}
    >
      Cancel
    </button>
    <button
      type="submit"
      className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
      disabled={isSubmitting}
    >
      {isSubmitting ? 'Saving...' : 'Save Policy'}
    </button>
  </div>