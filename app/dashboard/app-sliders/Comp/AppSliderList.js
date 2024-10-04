'use client';

import React, { useState, useContext, useRef, Suspense } from 'react';
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
import EditSlider from '../Comp/EditSlider';

function AppSliders({ data, loadMoreData, hasMore }) {
  const { toast } = useToast();
  const router = useRouter();
  const Contextdata = useContext(CheckloginContext);
  const [Pdata, setPdata] = useState(null);
  const [loading, setLoading] = useState(false);
  const [DialogStatus, setDialogStatus] = useState(false);

  const handleDelete = async (_id) => {
    const isConfirmed = window.confirm(
      'Are you sure you want to delete this App Slider?'
    );

    if (isConfirmed) {
      try {
        const payload = {
          _id: _id
        };
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/admin/delete-slider`,
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
            title: 'AppSlider Deleted successfully!',
            description: 'Your App Slider has been Deleted successfully.'
          });
        } else {
          toast({
            variant: 'destructive',
            title: 'Unable to Delete App Slider!',
            description: `Something went wrong`
          });
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleEdit = async (data) => {
    setPdata(data);
    setDialogStatus(true);
  };

  return (
    <ScrollArea className="h-[calc(80vh-120px)] rounded-md border">
      <div className="w-full overflow-x-auto">
        <Table className="relative min-w-[700px] md:min-w-full">
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Screen</TableHead>
              <TableHead>Order</TableHead>
              <TableHead>Date/Time</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item) => (
              <TableRow key={item._id}>
                <TableCell>
                  <Image
                    src={`${process.env.NEXT_PUBLIC_API_URL}/images/${item.imageUrl}`}
                    alt={item.slug}
                    width={150}
                    height={150}
                    className="rounded object-cover"
                  />
                </TableCell>
                <TableCell>{item.screenUrl}</TableCell>
                <TableCell>{item.Order}</TableCell>
                <TableCell>
                  {item.TimeStamp.date},{item.TimeStamp.time}
                </TableCell>
                <TableCell>
                  <Badge variant={item.isActive ? 'default' : 'destructive'}>
                    {item.isActive ? 'Public' : 'Private'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap items-center gap-1">
                    <Trash
                      className="mr-2 h-4 w-4 cursor-pointer"
                      onClick={() => handleDelete(item._id)}
                    />
                    <Edit
                      className="mr-2 h-4 w-4 cursor-pointer"
                      onClick={() => handleEdit(item)}
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <EditSlider
        Pdata={Pdata}
        DialogStatus={DialogStatus}
        setDialogStatus={setDialogStatus}
      />
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}

export default function EmployeeTable(props) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AppSliders {...props} />
    </Suspense>
  );
}
