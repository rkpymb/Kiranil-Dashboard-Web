'use client';

import React, {
  useState,
  useEffect,
  useContext,
  useRef,
  Suspense
} from 'react';
import CheckloginContext from '@/app/context/auth/CheckloginContext';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';

import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/use-toast';
import axios from 'axios';
import { Badge } from '@/components/ui/badge';

function ProductEnqList({ data, loadMoreData, hasMore, loading }) {
  const { toast } = useToast();
  const router = useRouter();
  const Contextdata = useContext(CheckloginContext);
  const handleDelete = async (slug) => {
    const isConfirmed = window.confirm(
      'Are you sure you want to delete this product?'
    );

    if (isConfirmed) {
      try {
        const payload = {
          slug: slug
        };
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/admin/delete-product`,
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
            title: 'Product Deleted successfully!',
            description: 'Your product has been Deleted successfully.'
          });
        } else {
          toast({
            variant: 'destructive',
            title: 'Unable to Delete product!',
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
              <TableHead>Enquiry From</TableHead>
              <TableHead>Enquiry ID</TableHead>
              <TableHead>Message</TableHead>
              <TableHead>Date/Time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item) => (
              <TableRow key={item._id}>
                <TableCell>
                  <div>{item.UserData.name}</div>
                  <div>{item.UserData.mobile}</div>
                  <div>{item.UserData.email}</div>
                </TableCell>
                <TableCell>
                  <div>{item.Enqid}</div>
                </TableCell>
                <TableCell className="max-w-[200px] whitespace-normal md:max-w-none">
                  {item.Message}
                </TableCell>

                <TableCell>
                  {item.TimeStamp.date},{item.TimeStamp.time}
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
      <ProductEnqList {...props} />
    </Suspense>
  );
}
