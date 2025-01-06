import { 
  collection, 
  doc, 
  getDocs, 
  getDoc,
  query, 
  where 
} from 'firebase/firestore';
import { firestore } from '../lib/firebase/firestore';
import type { Role, Permission } from '../types/permissions';

export async function getUserRoles(userId: string): Promise<Role[]> {
  try {
    // Get user's role assignments
    const userRolesRef = collection(firestore, 'userRoles');
    const q = query(userRolesRef, where('userId', '==', userId));
    const userRolesSnapshot = await getDocs(q);

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
    return [];
  }
}

export async function hasPermission(userId: string, permission: Permission): Promise<boolean> {
  const roles = await getUserRoles(userId);
  return roles.some(role => role.permissions.includes(permission));
}