import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';
import type { Member } from '../../types/member';

interface MemberDetailsProps {
  member: Member;
}

export default function MemberDetails({ member }: MemberDetailsProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="border-b pb-4 mb-4">
        <h2 className="text-2xl font-bold">{member.firstName} {member.lastName}</h2>
        <p className="text-gray-500">Member #{member.memberNumber}</p>
        <span className={`inline-block mt-2 px-2 py-1 text-sm rounded-full
          ${member.status === 'active' ? 'bg-green-100 text-green-800' : 
            member.status === 'inactive' ? 'bg-gray-100 text-gray-800' : 
            'bg-red-100 text-red-800'}`}>
          {member.status.charAt(0).toUpperCase() + member.status.slice(1)}
        </span>
      </div>

      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold mb-2">Contact Information</h3>
          <div className="space-y-2">
            {member.email.map((email, index) => (
              <div key={index} className="flex items-center gap-2 text-gray-600">
                <Mail className="w-4 h-4" />
                <span>{email}</span>
              </div>
            ))}
            {member.phone.primary && (
              <div className="flex items-center gap-2 text-gray-600">
                <Phone className="w-4 h-4" />
                <span>{member.phone.primary}</span>
                <span className="text-sm text-gray-400">(Primary)</span>
              </div>
            )}
            {member.phone.secondary && (
              <div className="flex items-center gap-2 text-gray-600">
                <Phone className="w-4 h-4" />
                <span>{member.phone.secondary}</span>
                <span className="text-sm text-gray-400">(Secondary)</span>
              </div>
            )}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Address</h3>
          <div className="flex items-start gap-2 text-gray-600">
            <MapPin className="w-4 h-4 mt-1" />
            <div>
              <div>{member.address.street}</div>
              <div>{member.address.city}, {member.address.state} {member.address.zipCode}</div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Membership Details</h3>
          <div className="text-gray-600">
            <div>Member since: {new Date(member.dateJoined).toLocaleDateString()}</div>
          </div>
        </div>
      </div>
    </div>
  );
}