// Update the clone handler
const handleClone = async (policyData: Omit<RetentionPolicy, 'id' | 'createdAt' | 'updatedAt'>) => {
  try {
    await createPolicy(policyData);
  } catch (error) {
    console.error('Error creating policy:', error);
    throw error;
  }
};