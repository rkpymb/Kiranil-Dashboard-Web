'use client';
import { useEffect, useState, useRef, useContext } from 'react';
import CheckloginContext from '@/app/context/auth/CheckloginContext';
import axios from 'axios';
import { Breadcrumbs } from '@/components/breadcrumbs';
import PageContainer from '@/components/layout/page-container';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import ServiceList from './Comp/ServiceList';
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
  { title: 'Services', link: '/dashboard/services' }
];

export default function Page({ searchParams }) {
  const router = useRouter();
  const Contextdata = useContext(CheckloginContext);
  const [services, setservices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [AllData, setAllData] = useState(0);

  // Use useRef to persist page number across re-renders
  const page = useRef(1);
  const limit = 6;

  const fetchservices = async (pageNumber = page.current) => {
    setLoading(true);
    try {
      const token = Contextdata.JwtToken;

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/service-list`,
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

        setservices((prevservices) => [
          ...prevservices,
          ...response.data.ListData
        ]);

        page.current += 1;

        if (response.data.ListData.length < limit) {
          setHasMore(false);
        }
      }
    } catch (error) {
      console.error('Error fetching service list:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (Contextdata.JwtToken) {
      fetchservices();
    }
  }, [router.query, Contextdata.JwtToken]);

  if (loading && services.length === 0) {
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
      fetchservices();
    }
  };

  return (
    <PageContainer>
      <div className="space-y-4">
        <Breadcrumbs items={breadcrumbItems} />
        <div className="flex items-start justify-between">
          <Heading
            title={`Services (${AllData})`}
            description={`Manage all Services`}
          />
          <Link
            href={'/dashboard/services/add-new'}
            className={cn(buttonVariants({ variant: 'default' }))}
          >
            <Plus className="mr-2 h-4 w-4" /> Add New
          </Link>
        </div>
      </div>

      <div className="mt-2">
        <ServiceList
          data={services}
          loadMoreData={loadMoreData}
          hasMore={hasMore}
          loading={loading}
        />
      </div>
      <div className="flex w-full flex-row items-center justify-between  gap-2 p-2 ">
        <div className="flex-1 text-sm text-muted-foreground">
          {services.length} of {AllData} Loaded
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
