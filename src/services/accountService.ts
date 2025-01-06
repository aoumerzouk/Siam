import { ref, set, get, push, query, orderByChild } from 'firebase/database';
import { db } from '../lib/firebase';
import type { Account } from '../types/account';

export async function getAccounts(): Promise<Account[]> {
  const accountsRef = ref(db, 'accounts');
  const snapshot = await get(query(accountsRef, orderByChild('dateOpened')));
  
  if (!snapshot.exists()) return [];
  
  return Object.entries(snapshot.val()).map(([id, data]) => ({
    id,
    ...(data as Omit<Account, 'id'>)
  }));
}

export async function createAccount(
  accountData: Omit<Account, 'id' | 'dateOpened'>,
  memberId: string
): Promise<Account> {
  const accountsRef = ref(db, 'accounts');
  const newAccountRef = push(accountsRef);
  
  const account = {
    ...accountData,
    dateOpened: new Date().toISOString(),
    memberIds: [memberId]
  };
  
  await set(newAccountRef, account);
  
  // Create member-account relationship
  const memberAccountRef = ref(db, `memberAccounts/${memberId}/${newAccountRef.key}`);
  await set(memberAccountRef, true);
  
  return {
    id: newAccountRef.key!,
    ...account
  };
}