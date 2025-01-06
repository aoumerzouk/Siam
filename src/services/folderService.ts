import { ref, set, get, push, query, orderByChild } from 'firebase/database';
import { db } from '../lib/firebase';
import type { Folder } from '../types/folder';

export async function getFolders(entityType: 'member' | 'account', entityId: string): Promise<Folder[]> {
  const foldersRef = ref(db, `folders/${entityType}/${entityId}`);
  const snapshot = await get(query(foldersRef, orderByChild('createdAt')));
  
  if (!snapshot.exists()) return [];
  
  return Object.entries(snapshot.val()).map(([id, data]) => ({
    id,
    ...(data as Omit<Folder, 'id'>)
  }));
}

export async function createFolder(
  folderData: Omit<Folder, 'id' | 'createdAt' | 'updatedAt'>
): Promise<Folder> {
  const foldersRef = ref(db, `folders/${folderData.entityType}/${folderData.entityId}`);
  const newFolderRef = push(foldersRef);
  
  const now = new Date().toISOString();
  const folder = {
    ...folderData,
    createdAt: now,
    updatedAt: now
  };
  
  await set(newFolderRef, folder);
  
  return {
    id: newFolderRef.key!,
    ...folder
  };
}