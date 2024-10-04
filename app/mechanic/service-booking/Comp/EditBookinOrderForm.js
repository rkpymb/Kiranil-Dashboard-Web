'use client';
import React, { useContext } from 'react';
import CheckloginContext from '@/app/context/auth/CheckloginContext';
import { useRouter } from 'next/navigation';

import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

const EditProductForm = ({ Pdata, ReloadBooking }) => {
  const Contextdata = useContext(CheckloginContext);
  const router = useRouter();

  // Extracting the last status update
  const lastStatusUpdate = Pdata.OrderUpdates[Pdata.OrderUpdates.length - 1];

  const badgeVariants = {
    awaiting: 'outline',
    assigned: 'secondary',
    Completed: 'default',
    Cancelled: 'destructive'
  };
  const StatusText = lastStatusUpdate.StatusText;
  const badgeVariant = badgeVariants[StatusText];
  return (
    <div>
      <div className="flex flex-col gap-2 lg:flex-row lg:gap-4">
        {/* Left Section */}
        <div className="w-full rounded border p-5 shadow-md ">
          {/* Service Title */}
          <div className="mb-4 flex w-full flex-row items-center justify-between gap-2">
            <div className="flex items-center space-x-4">
              <div>
                <p className="text-xs">Service Title :</p>
                <h2 className="mt-1 text-lg font-bold">
                  {Pdata.ServiceData.title}
                </h2>
              </div>
            </div>

            {StatusText && (
              <div className="mb-4">
                <Badge className="uppercase" variant={badgeVariant}>
                  {StatusText}
                </Badge>
              </div>
            )}
          </div>

          <div className="mb-4">
            <div className="flex items-center space-x-4">
              <div>
                <p className="text-xs font-semibold">Booking Schedule at :</p>
                <p className="mt-1 text-sm">
                  {Pdata.OrderData.bookingDate}, {Pdata.OrderData.bookingTime}
                </p>
              </div>
            </div>
          </div>
          {/* Address */}
          <div className="mb-4">
            <p className="text-xs font-semibold">Service Address:</p>
            <p className="mt-1 text-sm">{Pdata.OrderData.address}</p>
          </div>

          {/* User Data */}
          <div className="mb-4">
            <p className="text-xs font-semibold">Booking By :</p>
            <p className="mt-1 cursor-pointer text-sm">
              {Pdata.UserData.UserName}
            </p>
          </div>

          {!Pdata.PaymentData.PaymentStatus &&
            Pdata.OrderStatus !== 3 &&
            Pdata.OrderStatus !== 0 && (
              <div className="mb-4">
                <div className="flex items-center space-x-4">
                  {Pdata.Assigned ? (
                    <div>
                      <p className="text-xs">Assigned Mechanic :</p>
                      <p className="cursor-pointer text-sm">
                        {Pdata.Assigned.name}
                      </p>
                    </div>
                  ) : null}
                </div>
              </div>
            )}
        </div>

        <div className="w-full rounded border p-5 shadow-md">
          {/* Order Updates */}
          <div className="mb-4">
            <div className="flex flex-row items-center justify-between">
              <div>
                <p className="text-xs">Order Status Updates:</p>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-1 lg:grid-cols-1">
              {Pdata.OrderUpdates.map((update, index) => (
                <div key={index}>
                  <p className="text-xs uppercase text-blue-500">
                    {update.StatusText}
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    Date: {update.UpdateTime.date} | Time:{' '}
                    {update.UpdateTime.time}
                  </p>
                  <p className="text-xs text-gray-500">
                    Updated by: {update.by ? update.by : 'Admin'}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="flex w-full flex-col rounded border p-5 shadow-md">
          <div className="flex flex-row items-center justify-between">
            <div>
              <p className="text-xs">Payment Details :</p>
            </div>
            <Badge className="uppercase" variant={badgeVariant}>
              {Pdata.PaymentData.PaymentStatus ? 'Paid' : 'Not Paid'}
            </Badge>
          </div>

          <div className="mb-5 mt-10 flex w-full flex-row justify-between  px-2">
            <div className="text-xs">
              <span>Price</span>
            </div>

            <div className="text-xs font-semibold">
              <span>₹ {Pdata.PaymentData.Price}</span>
            </div>
          </div>

          <div className="mb-5 flex w-full flex-row justify-between  px-2">
            <div className="text-xs">
              <span>Discount</span>
            </div>
            <div className="text-xs font-semibold">
              <span>₹ {Pdata.PaymentData.Discount}</span>
            </div>
          </div>

          <Separator />
          <div className="mt-5 flex w-full flex-row justify-between px-2">
            <div className="text-xs">
              <span>Total</span>
            </div>
            <div>
              <div className="text-lg font-bold">
                ₹ {Pdata.PaymentData.Total}{' '}
              </div>
              <div className="mt-1 text-xs">{Pdata.PaymentData.PriceText}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProductForm;
