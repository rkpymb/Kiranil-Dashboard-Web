import { NavItem } from '@/types';

export type User = {
  id: number;
  name: string;
  company: string;
  role: string;
  verified: boolean;
  status: string;
};
export const users: User[] = [
  {
    id: 1,
    name: 'Candice Schiner',
    company: 'Dell',
    role: 'Frontend Developer',
    verified: false,
    status: 'Active'
  },
  {
    id: 2,
    name: 'John Doe',
    company: 'TechCorp',
    role: 'Backend Developer',
    verified: true,
    status: 'Active'
  },
  {
    id: 3,
    name: 'Alice Johnson',
    company: 'WebTech',
    role: 'UI Designer',
    verified: true,
    status: 'Active'
  },
  {
    id: 4,
    name: 'David Smith',
    company: 'Innovate Inc.',
    role: 'Fullstack Developer',
    verified: false,
    status: 'Inactive'
  },
  {
    id: 5,
    name: 'Emma Wilson',
    company: 'TechGuru',
    role: 'Product Manager',
    verified: true,
    status: 'Active'
  },
  {
    id: 6,
    name: 'James Brown',
    company: 'CodeGenius',
    role: 'QA Engineer',
    verified: false,
    status: 'Active'
  },
  {
    id: 7,
    name: 'Laura White',
    company: 'SoftWorks',
    role: 'UX Designer',
    verified: true,
    status: 'Active'
  },
  {
    id: 8,
    name: 'Michael Lee',
    company: 'DevCraft',
    role: 'DevOps Engineer',
    verified: false,
    status: 'Active'
  },
  {
    id: 9,
    name: 'Olivia Green',
    company: 'WebSolutions',
    role: 'Frontend Developer',
    verified: true,
    status: 'Active'
  },
  {
    id: 10,
    name: 'Robert Taylor',
    company: 'DataTech',
    role: 'Data Analyst',
    verified: false,
    status: 'Active'
  }
];

export type Employee = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  gender: string;
  date_of_birth: string; // Consider using a proper date type if possible
  street: string;
  city: string;
  state: string;
  country: string;
  zipcode: string;
  longitude?: number; // Optional field
  latitude?: number; // Optional field
  job: string;
  profile_picture?: string | null; // Profile picture can be a string (URL) or null (if no picture)
};

export const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: 'dashboard',
    label: 'Dashboard',
    Role: 'Admin'
  },
  {
    title: 'Services Bookings',
    href: '/dashboard/service-booking',
    icon: 'ListTodo',
    label: 'Service Bookings',
    Role: 'Admin'
  },
  {
    title: 'Product Enquiry',
    href: '/dashboard/product-enquiry',
    icon: 'LayoutList',
    label: 'Product Enquiry',
    Role: 'Admin'
  },
  {
    title: 'Users',
    href: '/dashboard/user',
    icon: 'Users2',
    label: 'users',
    Role: 'Admin'
  },
  {
    title: 'Mechanics',
    href: '/dashboard/mechanic',
    icon: 'UserSquare2',
    label: 'Mechanics',
    Role: 'Admin'
  },
  {
    title: 'Services',
    href: '/dashboard/services',
    icon: 'kanban',
    label: 'Services',
    Role: 'Admin'
  },
  {
    title: 'Products',
    href: '/dashboard/products',
    icon: 'Package',
    label: 'Products',
    Role: 'Admin'
  },
  {
    title: 'App Home Sliders',
    href: '/dashboard/app-sliders',
    icon: 'media',
    label: 'App Home Sliders',
    Role: 'Admin'
  },

  {
    title: 'App Settings',
    href: '/dashboard/settings',
    icon: 'settings',
    label: 'App Settings',
    Role: 'Admin'
  },
  {
    title: 'Dashboard',
    href: '/mechanic',
    icon: 'dashboard',
    label: 'Dashboard',
    Role: 'Mechanic'
  },
  {
    title: 'Services Bookings',
    href: '/mechanic/service-booking',
    icon: 'ListTodo',
    label: 'Service Bookings',
    Role: 'Mechanic'
  }
];
