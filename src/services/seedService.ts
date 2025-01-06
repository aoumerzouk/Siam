import { ref, set } from 'firebase/database';
import { db } from '../lib/firebase';
import { DEFAULT_ROLES } from '../config/permissions';

export async function seedDatabase() {
  try {
    // Initialize roles
    await set(ref(db, 'roles'), DEFAULT_ROLES);

    // Create a sample admin user role
    await set(ref(db, 'userRoles/admin'), {
      roleId: 'admin',
      assignedAt: new Date().toISOString()
    });

    // Create sample member
    const sampleMember = {
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
      dateJoined: new Date().toISOString(),
      status: 'active'
    };
    await set(ref(db, 'members/member1'), sampleMember);

    // Create sample account
    const sampleAccount = {
      accountNumber: {
        base: '1000001',
        typeCode: '001',
        suffix: '000'
      },
      type: 'share',
      status: 'active',
      dateOpened: new Date().toISOString(),
      memberIds: ['member1'],
      balance: 1000.00
    };
    await set(ref(db, 'accounts/account1'), sampleAccount);

    // Create member-account relationship
    await set(ref(db, 'memberAccounts/member1/account1'), true);

    console.log('Database seeded successfully');
    return true;
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
}