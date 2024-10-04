'use client';

import React, { useState, useEffect, useContext, Suspense } from 'react';
import CheckloginContext from '@/app/context/auth/CheckloginContext';
import CardItem from '../Comp/CardItem';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/use-toast';
import axios from 'axios';

function Products({ data, loadMoreData, hasMore, loading }) {
  const { toast } = useToast();
  const router = useRouter();
  const Contextdata = useContext(CheckloginContext);

  const badgeVariants = {
    awaiting: 'outline',
    assigned: 'secondary',
    Completed: 'default',
    Cancelled: 'destructive'
  };

  return (
    <div>
      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {data.map((item, index) => {
          const latestUpdate = item.OrderUpdates[item.OrderUpdates.length - 1];
          const statusText = latestUpdate
            ? latestUpdate.StatusText
            : 'no updates';
          const badgeVariant = badgeVariants[statusText];
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
    </div>
  );
}

export default function EmployeeTable(props) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Products {...props} />
    </Suspense>
  );
}
