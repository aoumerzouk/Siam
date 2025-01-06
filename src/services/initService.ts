import { ref, set, get } from 'firebase/database';
import { db } from '../lib/firebase';
import { DEFAULT_ROLES } from '../config/permissions';
import { seedDatabase } from './seedService';

let initialized = false;

export async function initializeDatabase() {
  if (initialized) return;
  
  try {
    // Test database connection
    const testRef = ref(db, '.info/connected');
    const connectedSnapshot = await get(testRef);
    
    if (!connectedSnapshot.exists()) {
      throw new Error('Could not connect to Firebase Realtime Database');
    }
    
    // Check if database is empty
    const rootRef = ref(db, '/');
    const rootSnapshot = await get(rootRef);
    
    if (!rootSnapshot.exists()) {
      // Database is empty, seed it with initial data
      await seedDatabase();
    }
    
    initialized = true;
  } catch (error) {
    console.error('Failed to initialize database:', error);
    throw error;
  }
}

export async function assignDefaultRole(userId: string) {
  try {
    const userRolesRef = ref(db, `userRoles/${userId}`);
    const userRolesSnapshot = await get(userRolesRef);
    
    if (!userRolesSnapshot.exists()) {
      await set(userRolesRef, {
        [DEFAULT_ROLES.DOCUMENT_MANAGER.id]: {
          userId,
          roleId: DEFAULT_ROLES.DOCUMENT_MANAGER.id,
          assignedAt: new Date().toISOString()
        }
      });
    }
  } catch (error) {
    console.error('Failed to assign default role:', error);
    throw error;
  }
}