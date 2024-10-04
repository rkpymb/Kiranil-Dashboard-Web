'use client';
import React, {
  useState,
  useEffect,
  useContext,
  useRef,
  Suspense
} from 'react';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { LuChevronRight, LuUserCheck2, LuAlertTriangle } from 'react-icons/lu';
import { Button } from '@/components/ui/button';
const CardItem = ({ item, badgeVariant, statusText }) => {
  useEffect(() => {
    console.log(item);
  }, []);
  return (
    <div className="h-full cursor-pointer rounded-md border p-4 shadow-md ">
      <Link href={`/mechanic/service-booking/manage/${item.OrderID}`}>
        <div className="flex h-full w-full flex-col justify-between">
          <div>
            <div className="mb-2 flex justify-between space-x-2">
              <div>
                <strong className="text-xs text-gray-500">
                  ORDER ID : {item.OrderID}
                </strong>
              </div>

              <div>
                <Badge className="uppercase" variant={badgeVariant}>
                  {statusText}
                </Badge>
              </div>
            </div>
            <div className="mb-2">
              <strong className="text-sm">{item.ServiceData.title}</strong>
            </div>

            <div className="mb-2 flex flex-col gap-1 text-xs">
              <div>
                Shaduled at: {item.OrderData.bookingDate},{' '}
                {item.OrderData.bookingTime}
              </div>
              <div>Address: {item.OrderData.address}</div>
              <div>Contact Number: {item.OrderData.contactNumber}</div>
            </div>
            <div className="mb-2 mt-2 flex flex-col gap-1 text-xs">
              {item.OrderStatus !== 0 && (
                <div>
                  Payment Status:{' '}
                  {item.PaymentData.PaymentStatus ? (
                    <span className=" text-green-500">Paid</span>
                  ) : (
                    <span className=" text-red-500">Pending</span>
                  )}
                </div>
              )}

              <div>
                Total : {item.PaymentData.Total}{' '}
                <span className="text-gray-500">
                  ({item.PaymentData.PriceText})
                </span>
              </div>
            </div>

            <div className="mb-2 text-xs  text-gray-500">
              <div>
                Created : {item.TimeStamp.date} {item.TimeStamp.time} by{' '}
                {item.UserData.UserName}
              </div>
            </div>
          </div>

          <div className="mt-5 flex flex-row items-center justify-between gap-2 uppercase">
            <div className="text-xs uppercase">
              {!item.Assigned ? (
                <div className="flex h-full flex-row items-center gap-1 rounded border p-2 capitalize">
                  <LuAlertTriangle className="h-4 w-4 text-red-600" />
                  <div className="text-red-600">
                    {' '}
                    Machanic Not Assigned Yet !
                  </div>
                </div>
              ) : (
                <div className="flex h-full flex-row items-center gap-1 rounded border p-2 capitalize">
                  <LuUserCheck2 className="h-4 w-4 text-green-600" />
                  <div className="text-green-600">
                    {' '}
                    {item.Assigned.name} Assigned
                  </div>
                </div>
              )}
            </div>
            <div>
              <Button variant="outline" size="sm" className="uppercase">
                View <LuChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default CardItem;
