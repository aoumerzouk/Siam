import { FolderTemplate } from '../types/folder';

export const memberFolderTemplates: FolderTemplate[] = [
  {
    id: 'member-identification',
    name: 'Identification Documents',
    isOptional: false,
    entityType: 'member',
    subfolders: [
      { id: 'member-id-primary', name: 'Primary ID', isOptional: false, entityType: 'member', subfolders: [] },
      { id: 'member-id-secondary', name: 'Secondary ID', isOptional: true, entityType: 'member', subfolders: [] }
    ]
  },
  {
    id: 'member-tax',
    name: 'Tax Documents',
    isOptional: false,
    entityType: 'member',
    subfolders: []
  },
  {
    id: 'member-correspondence',
    name: 'Correspondence',
    isOptional: true,
    entityType: 'member',
    subfolders: []
  }
];

export const accountFolderTemplates: FolderTemplate[] = [
  {
    id: 'account-opening',
    name: 'Account Opening Documents',
    isOptional: false,
    entityType: 'account',
    subfolders: []
  },
  {
    id: 'account-statements',
    name: 'Statements',
    isOptional: false,
    entityType: 'account',
    subfolders: []
  },
  {
    id: 'account-transfers',
    name: 'Transfers',
    isOptional: true,
    entityType: 'account',
    subfolders: []
  },
  {
    id: 'account-loans',
    name: 'Loan Documents',
    isOptional: true,
    entityType: 'account',
    subfolders: [
      { id: 'loan-application', name: 'Applications', isOptional: true, entityType: 'account', subfolders: [] },
      { id: 'loan-collateral', name: 'Collateral', isOptional: true, entityType: 'account', subfolders: [] },
      { id: 'loan-payments', name: 'Payment History', isOptional: true, entityType: 'account', subfolders: [] }
    ]
  }
];