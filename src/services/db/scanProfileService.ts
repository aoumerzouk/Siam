import { 
  collection, 
  doc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  Timestamp 
} from 'firebase/firestore';
import { firestore } from '../../lib/firebase';
import type { ScanProfile } from '../../types/scan';

const COLLECTION = 'scanProfiles';

export async function getScanProfiles(): Promise<ScanProfile[]> {
  const profilesRef = collection(firestore, COLLECTION);
  const snapshot = await getDocs(profilesRef);
  
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as ScanProfile));
}

export async function createScanProfile(
  profileData: Omit<ScanProfile, 'id'>
): Promise<ScanProfile> {
  const profilesRef = collection(firestore, COLLECTION);
  const docRef = await addDoc(profilesRef, {
    ...profileData,
    createdAt: Timestamp.now()
  });
  
  return {
    id: docRef.id,
    ...profileData
  };
}

export async function updateScanProfile(
  id: string,
  profileData: Partial<ScanProfile>
): Promise<void> {
  const profileRef = doc(firestore, COLLECTION, id);
  await updateDoc(profileRef, {
    ...profileData,
    updatedAt: Timestamp.now()
  });
}

export async function deleteScanProfile(id: string): Promise<void> {
  const profileRef = doc(firestore, COLLECTION, id);
  await deleteDoc(profileRef);
}