import { 
  collection, 
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  Timestamp 
} from 'firebase/firestore';
import { firestore } from '../../lib/firebase';
import type { RetentionPolicy } from '../../types/retention';

const POLICIES_COLLECTION = 'retentionPolicies';

export async function getRetentionPolicies(): Promise<RetentionPolicy[]> {
  try {
    const policiesRef = collection(firestore, POLICIES_COLLECTION);
    const snapshot = await getDocs(policiesRef);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate()
    } as RetentionPolicy));
  } catch (error) {
    console.error('Error getting retention policies:', error);
    throw new Error('Failed to load retention policies');
  }
}

export async function createRetentionPolicy(
  policyData: Omit<RetentionPolicy, 'id' | 'createdAt' | 'updatedAt'>
): Promise<RetentionPolicy> {
  try {
    const now = Timestamp.now();
    const policiesRef = collection(firestore, POLICIES_COLLECTION);
    
    const docRef = await addDoc(policiesRef, {
      ...policyData,
      createdAt: now,
      updatedAt: now
    });
    
    return {
      id: docRef.id,
      ...policyData,
      createdAt: now.toDate(),
      updatedAt: now.toDate()
    };
  } catch (error) {
    console.error('Error creating retention policy:', error);
    throw new Error('Failed to create retention policy');
  }
}

export async function updateRetentionPolicy(
  id: string,
  policyData: Partial<RetentionPolicy>
): Promise<void> {
  try {
    const policyRef = doc(firestore, POLICIES_COLLECTION, id);
    await updateDoc(policyRef, {
      ...policyData,
      updatedAt: Timestamp.now()
    });
  } catch (error) {
    console.error('Error updating retention policy:', error);
    throw new Error('Failed to update retention policy');
  }
}

export async function deleteRetentionPolicy(id: string): Promise<void> {
  try {
    const policyRef = doc(firestore, POLICIES_COLLECTION, id);
    await deleteDoc(policyRef);
  } catch (error) {
    console.error('Error deleting retention policy:', error);
    throw new Error('Failed to delete retention policy');
  }
}

export async function cloneRetentionPolicy(id: string, newName: string): Promise<RetentionPolicy> {
  try {
    const policyRef = doc(firestore, POLICIES_COLLECTION, id);
    const policyDoc = await getDoc(policyRef);
    
    if (!policyDoc.exists()) {
      throw new Error('Original policy not found');
    }

    const originalPolicy = policyDoc.data() as Omit<RetentionPolicy, 'id'>;
    
    // Create new policy with cloned data
    const now = Timestamp.now();
    const clonedData = {
      ...originalPolicy,
      name: newName,
      createdAt: now,
      updatedAt: now
    };
    
    const newPolicyRef = await addDoc(collection(firestore, POLICIES_COLLECTION), clonedData);
    
    return {
      id: newPolicyRef.id,
      ...clonedData,
      createdAt: now.toDate(),
      updatedAt: now.toDate()
    };
  } catch (error) {
    console.error('Error cloning retention policy:', error);
    throw new Error('Failed to clone retention policy');
  }
}