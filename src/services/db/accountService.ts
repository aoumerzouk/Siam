import { 
  collection, 
  doc, 
  getDocs, 
  addDoc, 
  query, 
  orderBy,
  Timestamp 
} from 'firebase/firestore';
import { firestore } from '../../lib/firebase/firestore';
import type { Account } from '../../types/account';

const COLLECTION = 'accounts';

export async function getAccounts(): Promise<Account[]> {
  const accountsRef = collection(firestore, COLLECTION);
  const q = query(accountsRef, orderBy('dateOpened', 'desc'));
  const snapshot = await getDocs(q);
  
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    dateOpened: (doc.data().dateOpened as Timestamp).toDate()
  } as Account));
}

export async function createAccount(
  accountData: Omit<Account, 'id' | 'dateOpened'>,
  memberId: string
): Promise<Account> {
  const accountsRef = collection(firestore, COLLECTION);
  
  const account = {
    ...accountData,
    dateOpened: Timestamp.now(),
    memberIds: [memberId]
  };
  
  const docRef = await addDoc(accountsRef, account);
  
  return {
    id: docRef.id,
    ...account,
    dateOpened: account.dateOpened.toDate()
  };
}