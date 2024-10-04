'use client';
import React, {
  useState,
  useEffect,
  useContext,
  useRef,
  Suspense
} from 'react';
import PageContainer from '@/components/layout/page-container';
import MechanicTab from '../../Comp/MechanicTab';

import Link from 'next/link';
import { Heading } from '@/components/ui/heading';
import CheckloginContext from '@/app/context/auth/CheckloginContext';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

import { Skeleton } from '@/components/ui/skeleton';

export default function Page({ params }) {
  const slug = params.slug;
  const [Pdata, setPdata] = useState(null);
  const Contextdata = useContext(CheckloginContext);

  const getServiceData = async ({ slug }) => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/admin/mechanic-data`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${Contextdata.JwtToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ UserName: slug })
      }
    );
    const data = await res.json();
    if (data.operation == true) {
      setPdata(data.DataRes);
    }
  };

  useEffect(() => {
    if (Contextdata.JwtToken) {
      getServiceData({ slug });
    }
  }, [Contextdata.JwtToken]);

  return (
    <div>
      {Pdata ? (
        <PageContainer scrollable={true}>
          <div className="flex-1 space-y-4 p-2 md:p-8 ">
            <div
              href={`/dashboard/user/profile/${Pdata.UserName}`}
              className="flex items-center space-x-2"
            >
              <div className="flex">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={''} alt={Pdata.name} />
                  <AvatarFallback>
                    {Pdata.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </div>
              <div>
                <Heading title={Pdata?.name} description={Pdata?.UserName} />
              </div>
            </div>
            <div style={{ height: '10px' }}></div>
            <div>
              <MechanicTab Pdata={Pdata} />
            </div>
          </div>
        </PageContainer>
      ) : (
        <PageContainer>
          <div className="flex flex-row items-center space-x-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[1002]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </div>
        </PageContainer>
      )}
    </div>
  );
}
