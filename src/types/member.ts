export interface Member {
  id: string;
  firstName: string;
  lastName: string;
  memberNumber: string;
  email: string[];
  phone: {
    primary?: string;
    secondary?: string;
  };
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  dateJoined: Date;
  status: 'active' | 'inactive' | 'suspended';
}