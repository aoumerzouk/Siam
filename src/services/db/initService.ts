import { doc, getDoc, setDoc, writeBatch, Timestamp } from 'firebase/firestore';
import { firestore } from '../../lib/firebase';
import { DEFAULT_ROLES } from '../../config/permissions';

let initializationPromise: Promise<boolean> | null = null;

export async function initializeDatabase() {
  // If initialization is already in progress, return the existing promise
  if (initializationPromise) {
    return initializationPromise;
  }

  // Create a new initialization promise
  initializationPromise = (async () => {
    try {
      console.log('Starting database initialization...');
      
      // Check if roles collection exists and has data
      const adminRoleRef = doc(firestore, 'roles', 'admin');
      const adminRoleDoc = await getDoc(adminRoleRef);

      if (!adminRoleDoc.exists()) {
        console.log('Roles collection not found. Creating roles...');
        const batch = writeBatch(firestore);

        // Create each role in the roles collection
        for (const [id, role] of Object.entries(DEFAULT_ROLES)) {
          console.log(`Creating role: ${id}`);
          const roleRef = doc(firestore, 'roles', id);
          batch.set(roleRef, {
            id,
            name: role.name,
            description: role.description,
            permissions: role.permissions,
            createdAt: Timestamp.now()
          });
        }

        // Commit the batch
        await batch.commit();
        console.log('Roles created successfully');
      } else {
        console.log('Roles collection already exists');
      }

      // Ensure admin user has admin role
      await assignAdminRole();
      
      console.log('Database initialization complete');
      return true;
    } catch (error) {
      console.error('Error initializing database:', error);
      throw error;
    }
  })();

  return initializationPromise;
}

export async function assignAdminRole() {
  const ADMIN_USER_ID = 'l5y1rCDFumdgqX0Feb4sGAeUWWJ2';
  const ADMIN_EMAIL = 'aoumerzouk@hotmail.com';
  
  try {
    console.log('Checking admin user and role...');
    
    // Create or update user document
    const userRef = doc(firestore, 'users', ADMIN_USER_ID);
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) {
      console.log('Creating admin user document...');
      await setDoc(userRef, {
        email: ADMIN_EMAIL,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });
    }

    // Create admin role assignment
    const userRoleRef = doc(firestore, 'userRoles', `${ADMIN_USER_ID}_admin`);
    const userRoleDoc = await getDoc(userRoleRef);

    if (!userRoleDoc.exists()) {
      console.log('Assigning admin role...');
      await setDoc(userRoleRef, {
        userId: ADMIN_USER_ID,
        roleId: 'admin',
        assignedAt: Timestamp.now()
      });
      console.log('Admin role assigned successfully');
    } else {
      console.log('Admin role already assigned');
    }
  } catch (error) {
    console.error('Error assigning admin role:', error);
    throw error;
  }
}