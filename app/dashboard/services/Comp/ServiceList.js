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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Edit, Trash } from 'lucide-react';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/use-toast';
import axios from 'axios';
import { Badge } from '@/components/ui/badge';

function ServiceList({ data, loadMoreData, hasMore, loading }) {
  const { toast } = useToast();
  const router = useRouter();
  const Contextdata = useContext(CheckloginContext);
  const handleDelete = async (slug) => {
    const isConfirmed = window.confirm(
      'Are you sure you want to delete this service?'
    );

    if (isConfirmed) {
      try {
        const payload = {
          slug: slug
        };
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/admin/delete-service`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${Contextdata.JwtToken}`,
              'Content-Type': 'application/json'
            }
          }
        );

        if (response.data.operation === true) {
          window.location.reload();
          toast({
            variant: 'success',
            title: 'service Deleted successfully!',
            description: 'Your service has been Deleted successfully.'
          });
        } else {
          toast({
            variant: 'destructive',
            title: 'Unable to Delete service!',
            description: `Something went wrong`
          });
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <ScrollArea className="h-[calc(80vh-120px)] rounded-md border">
      <div className="w-full overflow-x-auto">
        <Table className="relative min-w-[700px] md:min-w-full">
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Start Price</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item) => (
              <TableRow key={item._id}>
                <TableCell>
                  <Image
                    src={`${process.env.NEXT_PUBLIC_API_URL}/images/${item.image}`}
                    alt={item.slug}
                    width={150}
                    height={150}
                    className="rounded object-cover"
                  />
                </TableCell>
                <TableCell>
                  <div>
                    <strong>{item.title}</strong>
                  </div>
                  <div className="mt-5 flex items-center gap-1">
                    <Link href={`/dashboard/services/edit/${item.slug}`}>
                      <Edit className="mr-2 h-4 w-4 cursor-pointer" />
                    </Link>
                    <Trash
                      className="mr-2 h-4 w-4 cursor-pointer"
                      onClick={() => handleDelete(item.slug)} // Call handleDelete with slug
                    />
                  </div>
                </TableCell>
                <TableCell className="max-w-[200px] whitespace-normal md:max-w-none">
                  {item.description}
                </TableCell>
                <TableCell>₹ {item.startFromPrice}</TableCell>
                <TableCell>{item.TimeStamp.date}</TableCell>
                <TableCell>{item.TimeStamp.time}</TableCell>
                <TableCell>
                  <Badge variant={item.isActive ? 'default' : 'destructive'}>
                    {item.isActive ? 'Public' : 'Private'}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}

export default function EmployeeTable(props) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ServiceList {...props} />
    </Suspense>
  );
}
