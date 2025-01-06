import React from 'react';
import { CreditCard, Calendar, Users } from 'lucide-react';
import type { Account } from '../../types/account';
import { generateAccountNumber } from '../../utils/accountUtils';

interface AccountDetailsProps {
  account: Account;
}

export default function AccountDetails({ account }: AccountDetailsProps) {
  const fullAccountNumber = generateAccountNumber(
    account.accountNumber.base,
    account.accountNumber.typeCode,
    account.accountNumber.suffix
  );

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="border-b pb-4 mb-4">
        <h2 className="text-2xl font-bold">
          {account.type.charAt(0).toUpperCase() + account.type.slice(1)} Account
        </h2>
        <p className="text-gray-500">#{fullAccountNumber}</p>
        <span className={`inline-block mt-2 px-2 py-1 text-sm rounded-full
          ${account.status === 'active' ? 'bg-green-100 text-green-800' : 
            account.status === 'closed' ? 'bg-red-100 text-red-800' : 
            'bg-yellow-100 text-yellow-800'}`}>
          {account.status.charAt(0).toUpperCase() + account.status.slice(1)}
        </span>
      </div>

      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold mb-2">Account Information</h3>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-gray-600">
              <CreditCard className="w-4 h-4" />
              <span>Current Balance: ${account.balance.toFixed(2)}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Calendar className="w-4 h-4" />
              <span>Opened: {new Date(account.dateOpened).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Users className="w-4 h-4" />
              <span>Joint Account: {account.memberIds.length > 1 ? 'Yes' : 'No'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}