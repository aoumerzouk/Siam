import { 
  collection, 
  doc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  Timestamp,
  getDoc,
  setDoc
} from 'firebase/firestore';
import { firestore } from '../../lib/firebase';
import type { Role } from '../../types/permissions';
import { DEFAULT_ROLES } from '../../config/permissions';

const COLLECTION = 'roles';

export async function getRoles(): Promise<Role[]> {
  try {
    const rolesRef = collection(firestore, COLLECTION);
    const snapshot = await getDocs(rolesRef);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Role));
  } catch (error) {
    console.error('Error getting roles:', error);
    throw new Error('Failed to load roles');
  }
}

export async function getUserRoles(userId: string): Promise<Role[]> {
  try {
    // Get user's role assignments
    const userRolesRef = collection(firestore, 'userRoles');
    const q = query(userRolesRef, where('userId', '==', userId));
    const userRolesSnapshot = await getDocs(q);

    if (userRolesSnapshot.empty) {
      // If no roles assigned, assign default role
      const defaultRole = DEFAULT_ROLES.document_manager;
      await assignRole(userId, defaultRole.id);
      return [defaultRole];
    }

    const rolePromises = userRolesSnapshot.docs.map(async (userRole) => {
      const roleId = userRole.data().roleId;
      const roleRef = doc(firestore, 'roles', roleId);
      const roleDoc = await getDoc(roleRef);
      
      if (roleDoc.exists()) {
        return {
          id: roleDoc.id,
          ...roleDoc.data()
        } as Role;
      }
      return null;
    });

    const roles = await Promise.all(rolePromises);
    return roles.filter((role): role is Role => role !== null);
  } catch (error) {
    console.error('Error getting user roles:', error);
    throw new Error('Failed to load user roles');
  }
}

export async function createRole(roleData: Omit<Role, 'id'>): Promise<Role> {
  try {
    const rolesRef = collection(firestore, COLLECTION);
    const docRef = await addDoc(rolesRef, {
      ...roleData,
      createdAt: Timestamp.now()
    });
    
    return {
      id: docRef.id,
      ...roleData
    };
  } catch (error) {
    console.error('Error creating role:', error);
    throw new Error('Failed to create role');
  }
}

export async function updateRole(
  id: string,
  roleData: Partial<Role>
): Promise<void> {
  try {
    const roleRef = doc(firestore, COLLECTION, id);
    await updateDoc(roleRef, {
      ...roleData,
      updatedAt: Timestamp.now()
    });
  } catch (error) {
    console.error('Error updating role:', error);
    throw new Error('Failed to update role');
  }
}

export async function deleteRole(id: string): Promise<void> {
  try {
    // First check if any users have this role
    const userRolesRef = collection(firestore, 'userRoles');
    const q = query(userRolesRef, where('roleId', '==', id));
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      throw new Error('Cannot delete role that is assigned to users');
    }

    const roleRef = doc(firestore, COLLECTION, id);
    await deleteDoc(roleRef);
  } catch (error) {
    console.error('Error deleting role:', error);
    throw error;
  }
}

export async function assignRole(userId: string, roleId: string): Promise<void> {
  try {
    const userRoleRef = doc(firestore, 'userRoles', `${userId}_${roleId}`);
    await setDoc(userRoleRef, {
      userId,
      roleId,
      assignedAt: Timestamp.now()
    });
  } catch (error) {
    console.error('Error assigning role:', error);
    throw new Error('Failed to assign role');
  }
}