'use client';
import { useEffect, useState, useRef, useContext } from 'react';
import CheckloginContext from '@/app/context/auth/CheckloginContext';
import axios from 'axios';
import { Breadcrumbs } from '@/components/breadcrumbs';
import PageContainer from '@/components/layout/page-container';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import ProductEnqList from './Comp/ProductEnqList';
import { buttonVariants } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Skeleton } from '@/components/ui/skeleton';

import { cn } from '@/lib/utils';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { LuLoader2, LuCheckCheck } from 'react-icons/lu';

import { ChevronRightIcon } from 'lucide-react';

const breadcrumbItems = [
  { title: 'Dashboard', link: '/dashboard' },
  { title: 'Product Enquiry ', link: '/dashboard/product-enquiry' }
];

export default function Page({ searchParams }) {
  const router = useRouter();
  const Contextdata = useContext(CheckloginContext);
  const [Products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [AllData, setAllData] = useState(0);

  // Use useRef to persist page number across re-renders
  const page = useRef(1);
  const limit = 6;

  const fetchProducts = async (pageNumber = page.current) => {
    setLoading(true);
    try {
      const token = Contextdata.JwtToken;

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/product-enquiry-list`,
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

        setProducts((prevProducts) => [
          ...prevProducts,
          ...response.data.ListData
        ]);

        page.current += 1;

        if (response.data.ListData.length < limit) {
          setHasMore(false);
        }
      }
    } catch (error) {
      console.error('Error fetching product list:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (Contextdata.JwtToken) {
      fetchProducts();
    }
  }, [router.query, Contextdata.JwtToken]);

  if (loading && Products.length === 0) {
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
      fetchProducts();
    }
  };

  return (
    <PageContainer>
      <div className="space-y-4">
        <Breadcrumbs items={breadcrumbItems} />
        <div className="flex items-start justify-between">
          <Heading
            title={`Product Enquiry (${AllData})`}
            description={`Manage all Product Enquiry`}
          />
        </div>
      </div>
      <div className="mt-2">
        <ProductEnqList
          data={Products}
          loadMoreData={loadMoreData}
          hasMore={hasMore}
          loading={loading}
        />
      </div>

      <div className="flex w-full flex-row items-center justify-between  gap-2 p-2 ">
        <div className="flex-1 text-sm text-muted-foreground">
          {Products.length} of {AllData} Loaded
        </div>

        <div className="flex items-center">
          <Button
            aria-label="Go to next page"
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={hasMore ? loadMoreData : null}
            disabled={loading}
          >
            {!loading ? (
              <div>
                {hasMore ? (
                  <ChevronRightIcon className="h-4 w-4" aria-hidden="true" />
                ) : (
                  <LuCheckCheck className="h-4 w-4" aria-hidden="true" />
                )}
              </div>
            ) : (
              <LuLoader2 className="animate-spin" />
            )}
          </Button>
        </div>
      </div>
    </PageContainer>
  );
}
