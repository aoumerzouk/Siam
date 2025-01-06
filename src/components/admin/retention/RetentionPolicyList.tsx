// Update the onClone prop type and usage
interface RetentionPolicyListProps {
  // ... other props
  onClone: (policyData: Omit<RetentionPolicy, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
}

// In the component where RetentionPolicyCloneModal is used:
{selectedPolicy && (
  <RetentionPolicyCloneModal
    policy={selectedPolicy}
    isOpen={!!selectedPolicy}
    onClose={() => setSelectedPolicy(null)}
    onSubmit={onClone}
  />
)}