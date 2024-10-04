'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import MServicesBookingList from '../Comp/MServicesBookingList';
import MServices from './MServices';
import MechanicProfileSettings from '../Comp/MechanicProfileSettings';

const UserTab = ({ Pdata }) => {
  const UserName = Pdata.UserName;
  const [activeTab, setActiveTab] = useState('tab1');

  const tabs = [
    {
      id: 'tab1',
      label: 'Service Bookings',
      content: <MServicesBookingList UserName={UserName} />
    },
    {
      id: 'tab2',
      label: 'Services Allowed',
      content: <MServices Pdata={Pdata} />
    },
    {
      id: 'tab3',
      label: 'Profile Settings',
      content: <MechanicProfileSettings Pdata={Pdata} />
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
