'use client';

import React, {
  useState,
  useEffect,
  useContext,
  useRef,
  Suspense
} from 'react';
import CheckloginContext from '@/app/context/auth/CheckloginContext';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import Link from 'next/link';

import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/use-toast';
<Skeleton className="h-4 w-[250px]" />;
import { Badge } from '@/components/ui/badge';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

function MechList({ data, loadMoreData, hasMore, loading }) {
  const { toast } = useToast();
  const router = useRouter();
  const Contextdata = useContext(CheckloginContext);

  return (
    <ScrollArea className="h-[calc(80vh-120px)] rounded-md border">
      <div className="w-full overflow-x-auto">
        <Table className="relative min-w-[700px] md:min-w-full">
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item) => (
              <TableRow key={item._id}>
                <TableCell>
                  <Link
                    href={`/dashboard/mechanic/profile/${item.UserName}`}
                    className="flex space-x-2"
                  >
                    <div className="flex">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={''} alt={item.name} />
                        <AvatarFallback>
                          {item && item.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    <div>
                      <div>
                        <strong className="text-base">{item?.name}</strong>
                      </div>
                      <span className="text-[10px]">@{item?.UserName}</span>
                    </div>
                  </Link>
                </TableCell>
                <TableCell>
                  <div> {item.mobile}</div>
                  <div> {item.email}</div>
                </TableCell>
                <TableCell>{item.TimeStamp.date}</TableCell>
                <TableCell>{item.TimeStamp.time}</TableCell>
                <TableCell>
                  <Badge variant={item.isActive ? 'default' : 'destructive'}>
                    {item.isActive ? 'Active' : 'Deactivated'}
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
    <Suspense
      fallback={
        <div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
      }
    >
      <MechList {...props} />
    </Suspense>
  );
}
