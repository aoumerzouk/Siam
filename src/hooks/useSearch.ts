import { useState, useMemo } from 'react';
import type { Member } from '../types/member';
import type { Account } from '../types/account';
import { generateAccountNumber } from '../utils/accountUtils';

interface SearchResult {
  type: 'member' | 'account';
  item: Member | Account;
  matchScore: number;
}

export function useSearch(members: Member[] = [], accounts: Account[] = []) {
  const [searchTerm, setSearchTerm] = useState('');

  const searchResults = useMemo(() => {
    if (!searchTerm.trim()) return [];

    const term = searchTerm.toLowerCase().trim();
    const results: SearchResult[] = [];

    // Search members
    members.forEach(member => {
      if (!member) return; // Skip if member is undefined
      
      const fullName = `${member.firstName} ${member.lastName}`.toLowerCase();
      const memberNumber = member.memberNumber?.toLowerCase() || '';
      
      if (fullName.includes(term) || memberNumber.includes(term)) {
        results.push({
          type: 'member',
          item: member,
          matchScore: fullName.startsWith(term) ? 2 : 1
        });
      }
    });

    // Search accounts
    accounts.forEach(account => {
      if (!account || !account.accountNumber) return; // Skip if account or accountNumber is undefined
      
      const accountNumber = generateAccountNumber(
        account.accountNumber.base,
        account.accountNumber.typeCode,
        account.accountNumber.suffix
      ).toLowerCase();
      
      if (accountNumber.includes(term)) {
        results.push({
          type: 'account',
          item: account,
          matchScore: accountNumber.startsWith(term) ? 2 : 1
        });
      }
    });

    return results.sort((a, b) => b.matchScore - a.matchScore);
  }, [searchTerm, members, accounts]);

  return {
    searchTerm,
    setSearchTerm,
    searchResults: searchResults.map(result => ({
      type: result.type,
      item: result.item
    }))
  };
}