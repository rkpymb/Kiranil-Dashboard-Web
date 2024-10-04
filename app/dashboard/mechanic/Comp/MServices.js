'use client';

import React, {
  useState,
  useEffect,
  useContext,
  useRef,
  Suspense
} from 'react';
import CheckloginContext from '@/app/context/auth/CheckloginContext';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Eye, Trash } from 'lucide-react';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/use-toast';
import axios from 'axios';
import { Badge } from '@/components/ui/badge';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import AllowService from '../Comp/AllowService';

function MainDataServicesBookingList({ Pdata }) {
  const { toast } = useToast();
  const router = useRouter();
  const Contextdata = useContext(CheckloginContext);

  const [MainData, setMainData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMechanic = async () => {
    setLoading(true);
    try {
      const token = Contextdata.JwtToken;
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/mechanic-allowed-services`,
        {
          UserName: Pdata.UserName
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data.operation) {
        const Ldata = response.data.ListData;
        setMainData(Ldata);
      }
    } catch (error) {
      console.error('Error fetching service list:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (Contextdata.JwtToken) {
      fetchMechanic();
    }
  }, [router.query, Contextdata.JwtToken]);

  const handleDelete = async (slug) => {
    const isConfirmed = window.confirm('Are you sure ?');

    if (isConfirmed) {
      try {
        const payload = {
          slug: slug,
          UserName: Pdata.UserName
        };
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/admin/delete-mechanic-allowed-service`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${Contextdata.JwtToken}`,
              'Content-Type': 'application/json'
            }
          }
        );

        if (response.data.operation === true) {
          fetchMechanic();
          toast({
            variant: 'success',
            title: 'Deleted successfully!',
            description: 'Service Removed from mechanic profile.'
          });
        } else {
          toast({
            variant: 'destructive',
            title: 'Unable to Delete !',
            description: `Something went wrong`
          });
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  if (loading && MainData.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {MainData.length > 0 ? (
        <div>
          <div className="flex flex-row justify-between ">
            <div className="m-2 text-sm  text-gray-500">
              <span>Allowed ({MainData.length})</span>
            </div>
            <div>
              <AllowService Pdata={Pdata} fetchMechanic={fetchMechanic} />
            </div>
          </div>
          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {MainData.map((item, index) => {
              return (
                <div
                  key={index}
                  className="cursor-pointer rounded-md border p-4 shadow-md"
                >
                  <div className="mb-2 flex justify-between space-x-2">
                    <div>
                      <div className="text-sm">{item.title}</div>
                    </div>
                    <div>
                      <Trash
                        className="mr-2 h-4 w-4 cursor-pointer"
                        onClick={() => handleDelete(item.slug)}
                      />
                    </div>
                  </div>

                  <div className="mt-2 text-xs  text-gray-500">
                    <div>
                      Date : {item.TimeStamp.date} {item.TimeStamp.time}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center border p-10">
          <div className="m-5 text-sm  text-gray-500">
            <span>
              Not any Services Allowed to {Pdata.name}'s profile yet !
            </span>
          </div>
          <div>
            <AllowService Pdata={Pdata} />
          </div>
        </div>
      )}

      <ScrollBar orientation="horizontal" />
    </div>
  );
}

export default function EmployeeTable(props) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MainDataServicesBookingList {...props} />
    </Suspense>
  );
}
