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
import type { Member } from '../../types/member';
import { generateMemberNumber } from '../../utils/memberUtils';

const COLLECTION = 'members';

export async function getMembers(): Promise<Member[]> {
  const membersRef = collection(firestore, COLLECTION);
  const q = query(membersRef, orderBy('dateJoined', 'desc'));
  const snapshot = await getDocs(q);
  
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    dateJoined: (doc.data().dateJoined as Timestamp).toDate()
  } as Member));
}

export async function createMember(memberData: Omit<Member, 'id' | 'dateJoined'>): Promise<Member> {
  const membersRef = collection(firestore, COLLECTION);
  
  const member = {
    ...memberData,
    memberNumber: generateMemberNumber(),
    dateJoined: Timestamp.now()
  };
  
  const docRef = await addDoc(membersRef, member);
  
  return {
    id: docRef.id,
    ...member,
    dateJoined: member.dateJoined.toDate()
  };
}