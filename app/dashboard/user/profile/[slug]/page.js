'use client';
import React, {
  useState,
  useEffect,
  useContext,
  useRef,
  Suspense
} from 'react';
import PageContainer from '@/components/layout/page-container';
import UserTab from '../../Comp/UserTab';
import { Skeleton } from '@/components/ui/skeleton';

import { Heading } from '@/components/ui/heading';
import CheckloginContext from '@/app/context/auth/CheckloginContext';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function Page({ params }) {
  const slug = params.slug;
  const Contextdata = useContext(CheckloginContext);
  const [Pdata, setPdata] = useState(null);

  const getServiceData = async ({ slug }) => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/admin/user-data`,
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
                  <AvatarImage
                    src={''}
                    alt={Pdata.UserData && Pdata.UserData.name}
                  />
                  <AvatarFallback>
                    {Pdata.UserData &&
                      Pdata.UserData.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </div>
              <div>
                <Heading
                  title={Pdata?.UserData.name}
                  description={Pdata?.UserName}
                />
              </div>
            </div>
            <div style={{ height: '10px' }}></div>
            <div>
              <UserTab Pdata={Pdata} />
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
