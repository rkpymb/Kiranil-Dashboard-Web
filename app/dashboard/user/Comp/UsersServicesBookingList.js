'use client';

import React, {
  useState,
  useEffect,
  useContext,
  useRef,
  Suspense
} from 'react';
import CheckloginContext from '@/app/context/auth/CheckloginContext';
import CardItem from '@/app/dashboard/service-booking/Comp/CardItem';

import { Button } from '@/components/ui/button';

import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/use-toast';
import axios from 'axios';
import { Skeleton } from '@/components/ui/skeleton';

function MainDataServicesBookingList({ UserName }) {
  const { toast } = useToast();
  const router = useRouter();
  const Contextdata = useContext(CheckloginContext);

  const [MainData, setMainData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [AllData, setAllData] = useState(0);
  const page = useRef(1);
  const limit = 6;

  const fetchMainData = async (pageNumber = page.current) => {
    setLoading(true);
    try {
      const token = Contextdata.JwtToken;

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/user-service-bookings-order`,
        {
          page: pageNumber,
          limit: limit,
          UserName: UserName
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data.operation) {
        console.log(response.data.ListData);
        if (response.data.AllData) {
          setAllData(response.data.AllData);
        }

        setMainData((prevMainData) => {
          const existingOrderIDs = new Set(
            prevMainData.map((item) => item.OrderID)
          );
          const newItems = response.data.ListData.filter(
            (item) => !existingOrderIDs.has(item.OrderID)
          );
          return [...prevMainData, ...newItems];
        });

        page.current += 1;

        if (response.data.ListData.length < limit) {
          setHasMore(false);
        }
      }
    } catch (error) {
      console.error('Error fetching service list:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (Contextdata.JwtToken) {
      fetchMainData();
    }
  }, [router.query, Contextdata.JwtToken]);

  if (loading && MainData.length === 0) {
    return (
      <div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-full md:w-1/2" />
          <Skeleton className="h-4 w-[90%] md:w-2/5" />
        </div>
      </div>
    );
  }

  const loadMoreData = () => {
    if (hasMore) {
      fetchMainData();
    }
  };

  return (
    <div>
      <div className="m-2 text-sm  text-gray-500">
        <span>Bookings ({AllData})</span>
      </div>
      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {MainData.map((item, index) => {
          const latestUpdate = item.OrderUpdates[item.OrderUpdates.length - 1];
          const statusText = latestUpdate
            ? latestUpdate.StatusText
            : 'No updates';

          const badgeVariants = {
            awaiting: 'outline',
            accepted: 'secondary',
            completed: 'default',
            canceled: 'destructive'
          };

          const badgeVariant = badgeVariants[statusText] || 'neutral';

          return (
            <div key={index}>
              <CardItem
                item={item}
                badgeVariant={badgeVariant}
                statusText={statusText}
              />
            </div>
          );
        })}
      </div>
      {hasMore && (
        <div className="mt-4 flex justify-center">
          <Button onClick={loadMoreData} disabled={loading} variant={'outline'}>
            {loading ? 'Loading...' : 'Load More'}
          </Button>
        </div>
      )}
      <ScrollBar orientation="horizontal" />
    </div>
  );
}

export default function EmployeeTable(props) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MainDataServicesBookingList {...props} />
    </Suspense>
  );
}
