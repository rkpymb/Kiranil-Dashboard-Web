'use client';
import React, {
  useState,
  useEffect,
  useContext,
  useRef,
  Suspense
} from 'react';
import PageContainer from '@/components/layout/page-container';
import EditBookinOrderForm from '../../Comp/EditBookinOrderForm';

import { Heading } from '@/components/ui/heading';
import { Skeleton } from '@/components/ui/skeleton';
import BookingOrderStatus from '../../Comp/BookingOrderStatus';

import CheckloginContext from '@/app/context/auth/CheckloginContext';

export default function Page({ params }) {
  const Contextdata = useContext(CheckloginContext);
  const slug = params.slug;
  const [Pdata, setPdata] = useState(null);

  const getBookingData = async ({ slug }) => {
    const token = Contextdata.JwtToken;
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/mechanic/service-bookings-order-data`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ OrderID: slug })
      }
    );
    const data = await res.json();

    if (data.operation == true) {
      setPdata(data.DataRes);
    }
  };

  useEffect(() => {
    if (Contextdata.JwtToken) {
      getBookingData({ slug });
    }
  }, [Contextdata.JwtToken]);

  const ReloadBooking = async () => {
    if (Contextdata.JwtToken) {
      getBookingData({ slug });
    }
  };

  return (
    <div>
      {Pdata ? (
        <PageContainer scrollable={true}>
          <div className="flex-1 space-y-4 p-2 md:p-8">
            <div className="flex flex-row items-start justify-between">
              <Heading
                title={`Booking Order`}
                description={`ORDER ID : ${Pdata.OrderID}`}
              />
              <div>
                {Pdata.OrderStatus !== 3 && Pdata.OrderStatus !== 0 && (
                  <div>
                    <BookingOrderStatus
                      Pdata={Pdata}
                      ReloadBooking={ReloadBooking}
                    />
                  </div>
                )}
              </div>
            </div>

            <EditBookinOrderForm Pdata={Pdata} ReloadBooking={ReloadBooking} />
          </div>
        </PageContainer>
      ) : (
        <PageContainer>
          <div className="space-y-2">
            <Skeleton className="h-4 w-full md:w-1/2" />
            <Skeleton className="h-4 w-[90%] md:w-2/5" />
          </div>
        </PageContainer>
      )}
    </div>
  );
}
