'use client';
import React, {
  useState,
  useEffect,
  useContext,
  useRef,
  Suspense
} from 'react';
import PageContainer from '@/components/layout/page-container';
import EditProductForm from '../../Comp/EditProductForm';

import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';

import { Skeleton } from '@/components/ui/skeleton';

export default function Page({ params }) {
  const slug = params.slug;
  const [Pdata, setPdata] = useState(null);

  const getProductData = async ({ slug }) => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/admin/product-data`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ slug: slug })
      }
    );
    const data = await res.json();
    if (data.operation == true) {
      setPdata(data.DataRes);
    }
  };

  useEffect(() => {
    getProductData({ slug });
  }, []);

  return (
    <div>
      {Pdata ? (
        <PageContainer scrollable={true}>
          <div className="flex-1 space-y-4 p-2 md:p-8">
            <div className="flex items-start justify-between">
              <Heading title={`Edit Product`} description={Pdata.title} />
            </div>
            <Separator />

            <EditProductForm Pdata={Pdata} />
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
