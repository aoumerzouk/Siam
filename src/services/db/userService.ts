import { 
  createUserWithEmailAndPassword,
  deleteUser as deleteFirebaseUser
} from 'firebase/auth';
import { 
  collection, 
  doc,
  getDocs,
  setDoc,
  deleteDoc,
  query,
  where,
  Timestamp
} from 'firebase/firestore';
import { auth, firestore } from '../../lib/firebase';
import type { AppUser, CreateUserData } from '../../types/user';
import * as roleService from './roleService';

export async function getUsers(): Promise<AppUser[]> {
  const usersRef = collection(firestore, 'users');
  const snapshot = await getDocs(usersRef);
  
  const users = await Promise.all(
    snapshot.docs.map(async (doc) => {
      const roles = await roleService.getUserRoles(doc.id);
      return {
        id: doc.id,
        email: doc.data().email,
        roles,
        createdAt: doc.data().createdAt?.toDate() || new Date()
      };
    })
  );
  
  return users;
}

export async function createUser(userData: CreateUserData): Promise<AppUser> {
  try {
    // Create Firebase Auth user
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      userData.email,
      userData.password
    );
    
    // Store user in Firestore
    const userRef = doc(firestore, 'users', userCredential.user.uid);
    await setDoc(userRef, {
      email: userData.email,
      createdAt: Timestamp.now()
    });
    
    // Assign roles
    for (const roleId of userData.roleIds) {
      await roleService.assignRole(userCredential.user.uid, roleId);
    }
    
    const roles = await roleService.getUserRoles(userCredential.user.uid);
    
    return {
      id: userCredential.user.uid,
      email: userData.email,
      roles,
      createdAt: new Date()
    };
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
}

export async function updateUserRoles(userId: string, roleIds: string[]): Promise<void> {
  try {
    // Remove all existing role assignments
    const userRolesRef = collection(firestore, 'userRoles');
    const q = query(userRolesRef, where('userId', '==', userId));
    const snapshot = await getDocs(q);
    
    const removePromises = snapshot.docs.map(doc => deleteDoc(doc.ref));
    await Promise.all(removePromises);
    
    // Assign new roles
    const assignPromises = roleIds.map(roleId => 
      roleService.assignRole(userId, roleId)
    );
    await Promise.all(assignPromises);
  } catch (error) {
    console.error('Error updating user roles:', error);
    throw error;
  }
}

export async function deleteUser(userId: string): Promise<void> {
  try {
    // Delete from Firestore first
    const userRef = doc(firestore, 'users', userId);
    await deleteDoc(userRef);
    
    // Delete role assignments
    await updateUserRoles(userId, []);
    
    // Delete from Firebase Auth
    const user = auth.currentUser;
    if (user && user.uid === userId) {
      await deleteFirebaseUser(user);
    }
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
}