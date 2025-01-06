import { 
  collection, 
  doc, 
  getDocs, 
  addDoc, 
  query, 
  where,
  orderBy,
  Timestamp 
} from 'firebase/firestore';
import { firestore } from '../../lib/firebase/firestore';
import type { Document } from '../../types/document';

const COLLECTION = 'documents';

export async function getDocuments(folderId: string): Promise<Document[]> {
  const documentsRef = collection(firestore, COLLECTION);
  const q = query(
    documentsRef,
    where('folderId', '==', folderId),
    orderBy('createdAt', 'desc')
  );
  const snapshot = await getDocs(q);
  
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    lastModified: (doc.data().lastModified as Timestamp).toDate()
  } as Document));
}

export async function createDocument(
  documentData: Omit<Document, 'id' | 'createdAt' | 'updatedAt'>
): Promise<Document> {
  const documentsRef = collection(firestore, COLLECTION);
  
  const now = Timestamp.now();
  const document = {
    ...documentData,
    createdAt: now,
    updatedAt: now
  };
  
  const docRef = await addDoc(documentsRef, document);
  
  return {
    id: docRef.id,
    ...document,
    createdAt: document.createdAt.toDate(),
    updatedAt: document.updatedAt.toDate()
  };
}