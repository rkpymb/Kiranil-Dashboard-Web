'use client';
import React, { useState, useContext } from 'react';

import CheckloginContext from '@/app/context/auth/CheckloginContext';
import PageContainer from '@/components/layout/page-container';

import LatestBookings from './Comp/LatestBookings';
import DbCounter from './Comp/DbCounter';

import { Separator } from '@/components/ui/separator';

export default function page() {
  const Contextdata = useContext(CheckloginContext);

  return (
    <PageContainer scrollable={true}>
      {Contextdata.UserData && (
        <div>
          <div className="flex items-center justify-between space-y-2">
            <h2 className="text-2xl font-bold tracking-tight">
              {`Hi ${Contextdata.UserData.name}👋`}
            </h2>
          </div>
          <Separator className="mt-5" />
        </div>
      )}

      <div className="mt-7">
        <DbCounter />
      </div>

      <div className="mt-10">
        <h3>Latest Bookings</h3>
        <LatestBookings />
      </div>
    </PageContainer>
  );
}
