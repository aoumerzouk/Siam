import { ref, set, get, push, query, orderByChild } from 'firebase/database';
import { db } from '../lib/firebase';
import type { Member } from '../types/member';
import { generateMemberNumber } from '../utils/memberUtils';

export async function getMembers(): Promise<Member[]> {
  const membersRef = ref(db, 'members');
  const snapshot = await get(query(membersRef, orderByChild('dateJoined')));
  
  if (!snapshot.exists()) return [];
  
  return Object.entries(snapshot.val()).map(([id, data]) => ({
    id,
    ...(data as Omit<Member, 'id'>)
  }));
}

export async function createMember(memberData: Omit<Member, 'id' | 'dateJoined'>): Promise<Member> {
  const membersRef = ref(db, 'members');
  const newMemberRef = push(membersRef);
  
  const member = {
    ...memberData,
    memberNumber: generateMemberNumber(),
    dateJoined: new Date().toISOString()
  };
  
  await set(newMemberRef, member);
  
  return {
    id: newMemberRef.key!,
    ...member
  };
}