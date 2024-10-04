'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import UsersServicesBookingList from '../Comp/UsersServicesBookingList';
import UsersProductEnqList from '../Comp/UsersProductEnqList';
import UserProfileSettings from '../Comp/UserProfileSettings';

const UserTab = ({ Pdata }) => {
  const UserName = Pdata.UserName;
  const [activeTab, setActiveTab] = useState('tab1');

  const tabs = [
    {
      id: 'tab1',
      label: 'Service Bookings',
      content: <UsersServicesBookingList UserName={UserName} />
    },
    {
      id: 'tab2',
      label: 'Product Enquiry',
      content: <UsersProductEnqList UserName={UserName} />
    },
    {
      id: 'tab3',
      label: 'Profile Settings',
      content: <UserProfileSettings Pdata={Pdata} />
    }
  ];

  return (
    <div className="mt-5">
      <div className="scrollbar-hide flex space-x-2 overflow-x-auto">
        {tabs.map((tab) => (
          <Button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            variant={activeTab === tab.id ? 'outline' : 'secondary'}
            className="min-w-fit px-4 py-2" // Make button fit content
          >
            {tab.label}
          </Button>
        ))}
      </div>
      <div className="mt-4">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className={`tab-content ${
              activeTab === tab.id ? 'block' : 'hidden'
            }`}
          >
            {tab.content} {/* Render the component here */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserTab;
