'use client';
import { useEffect, useState, useContext } from 'react';
import {
  FiUsers,
  FiTool,
  FiCalendar,
  FiBox,
  FiClipboard,
  FiCheckCircle,
  FiXCircle
} from 'react-icons/fi';
import Link from 'next/link'; // Importing Link from Next.js
import CheckloginContext from '@/app/context/auth/CheckloginContext';
import axios from 'axios';
import { Skeleton } from '@/components/ui/skeleton';

const DbCounter = () => {
  const [CounterData, setCounterData] = useState(null);
  const Contextdata = useContext(CheckloginContext);

  const fetchData = async () => {
    try {
      const token = Contextdata.JwtToken;
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/mechanic/db-counter`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data.operation === true) {
        const {
          AssignedOrders,
          AllowedServices,
          CompletedOrders,
          CancelledOrder
        } = response.data.DbData;

        const transformedData = [
          {
            title: 'Assigned Orders',
            Count: AssignedOrders,
            Icon: FiCalendar,
            href: '/dashboard/assigned-orders'
          },
          {
            title: 'Allowed Services',
            Count: AllowedServices,
            Icon: FiTool,
            href: '/dashboard/allowed-services'
          },
          {
            title: 'Completed Orders',
            Count: CompletedOrders,
            Icon: FiCheckCircle,
            href: '/dashboard/completed-orders'
          },
          {
            title: 'Cancelled Orders',
            Count: CancelledOrder,
            Icon: FiXCircle,
            href: '/dashboard/cancelled-orders'
          }
        ];

        setCounterData(transformedData);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    if (Contextdata.JwtToken) {
      fetchData();
    }
  }, [Contextdata.JwtToken]);

  if (!CounterData) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-4 w-full md:w-1/2" />
        <Skeleton className="h-4 w-[90%] md:w-2/5" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4">
      {CounterData.map((item, index) => (
        <Link href={`${item.href}`} key={index}>
          <div className="flex transform items-center space-x-4 rounded-lg border p-6 shadow-md transition-transform hover:scale-105">
            <div className="text-4xl text-blue-500">
              <item.Icon />
            </div>
            <div>
              <h3 className="text-sm font-semibold">{item.title}</h3>
              <p className="text-2xl font-bold">{item.Count}</p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default DbCounter;
