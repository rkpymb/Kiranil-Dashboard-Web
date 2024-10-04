'use client';
import { useEffect, useState, useRef, useContext } from 'react';
import CheckloginContext from '@/app/context/auth/CheckloginContext';
import axios from 'axios';

import PageContainer from '@/components/layout/page-container';
import { useRouter } from 'next/navigation';

import BookingListItem from '../Comp/BookingListItem';

import { RocketIcon } from '@radix-ui/react-icons';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

import { Skeleton } from '@/components/ui/skeleton';

export default function Page({ searchParams }) {
  const router = useRouter();
  const Contextdata = useContext(CheckloginContext);
  const [Bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [AllData, setAllData] = useState(0);

  // Use useRef to persist page number across re-renders
  const page = useRef(1);
  const limit = 6;

  const fetchBookings = async (pageNumber = page.current) => {
    setLoading(true);
    try {
      const token = Contextdata.JwtToken;

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/mechanic/awaiting-service-bookings-orders`,
        {
          page: pageNumber,
          limit: limit
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data.operation) {
        if (response.data.AllData) {
          setAllData(response.data.AllData);
        }

        setBookings((prevBookings) => [
          ...prevBookings,
          ...response.data.ListData
        ]);

        page.current += 1;

        if (response.data.ListData.length < limit) {
          setHasMore(false);
        }
      }
    } catch (error) {
      console.error('Error fetching Booking list:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (Contextdata.JwtToken) {
      fetchBookings();
    }
  }, [router.query, Contextdata.JwtToken]);

  if (loading && Bookings.length === 0) {
    return (
      <PageContainer>
        <div className="space-y-2">
          <Skeleton className="h-4 w-full md:w-1/2" />
          <Skeleton className="h-4 w-[90%] md:w-2/5" />
        </div>
      </PageContainer>
    );
  }

  const loadMoreData = () => {
    if (hasMore) {
      fetchBookings();
    }
  };

  return (
    <>
      {Bookings.length > 0 ? (
        <div className="mt-2">
          <BookingListItem
            data={Bookings}
            loadMoreData={loadMoreData}
            hasMore={hasMore}
            loading={loading}
          />
        </div>
      ) : (
        <div className="mt-5">
          <Alert>
            <RocketIcon className="h-4 w-4" />
            <AlertTitle className="text-red-400">
              No Awaiting orders{' '}
            </AlertTitle>
            <AlertDescription>
              Orders not available,Stay tuned for new Booking Orders
            </AlertDescription>
          </Alert>
        </div>
      )}
    </>
  );
}
