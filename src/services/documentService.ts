import { ref, set, get, push, query, orderByChild } from 'firebase/database';
import { db } from '../lib/firebase';
import type { Document } from '../types/document';

export async function getDocuments(folderId: string): Promise<Document[]> {
  const documentsRef = ref(db, `documents/${folderId}`);
  const snapshot = await get(query(documentsRef, orderByChild('createdAt')));
  
  if (!snapshot.exists()) return [];
  
  return Object.entries(snapshot.val()).map(([id, data]) => ({
    id,
    ...(data as Omit<Document, 'id'>)
  }));
}

export async function createDocument(
  documentData: Omit<Document, 'id' | 'createdAt' | 'updatedAt'>
): Promise<Document> {
  const documentsRef = ref(db, `documents/${documentData.folderId}`);
  const newDocRef = push(documentsRef);
  
  const now = new Date().toISOString();
  const document = {
    ...documentData,
    createdAt: now,
    updatedAt: now
  };
  
  await set(newDocRef, document);
  
  return {
    id: newDocRef.key!,
    ...document
  };
}