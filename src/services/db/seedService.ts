import { doc, setDoc, collection, getDocs, writeBatch } from 'firebase/firestore';
import { firestore } from '../../lib/firebase/firestore';
import { DEFAULT_ROLES } from '../../config/permissions';
import { Timestamp } from 'firebase/firestore';

export async function seedDatabase() {
  try {
    // Check if database is already seeded
    const membersRef = collection(firestore, 'members');
    const membersSnapshot = await getDocs(membersRef);
    
    if (!membersSnapshot.empty) {
      console.log('Database already seeded');
      return;
    }

    const batch = writeBatch(firestore);

    // Initialize roles
    for (const [id, role] of Object.entries(DEFAULT_ROLES)) {
      const roleRef = doc(firestore, 'roles', id);
      batch.set(roleRef, role);
    }

    // Create admin user role
    const adminRoleRef = doc(firestore, 'userRoles', 'admin_admin');
    batch.set(adminRoleRef, {
      userId: 'admin',
      roleId: 'admin',
      assignedAt: Timestamp.now()
    });

    // Create sample member
    const memberRef = doc(firestore, 'members', 'member1');
    batch.set(memberRef, {
      firstName: 'John',
      lastName: 'Doe',
      memberNumber: '100001',
      email: ['john.doe@example.com'],
      phone: {
        primary: '555-0100',
        secondary: ''
      },
      address: {
        street: '123 Main St',
        city: 'Springfield',
        state: 'IL',
        zipCode: '62701'
      },
      dateJoined: Timestamp.now(),
      status: 'active'
    });

    // Create sample account
    const accountRef = doc(firestore, 'accounts', 'account1');
    batch.set(accountRef, {
      accountNumber: {
        base: '1000001',
        typeCode: '001',
        suffix: '000'
      },
      type: 'share',
      status: 'active',
      dateOpened: Timestamp.now(),
      memberIds: ['member1'],
      balance: 1000.00
    });

    // Commit the batch
    await batch.commit();
    console.log('Database seeded successfully');
    return true;
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
}