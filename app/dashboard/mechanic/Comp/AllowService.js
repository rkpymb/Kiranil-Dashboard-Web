'use client';
import React, { useState, useContext, useEffect } from 'react';
import CheckloginContext from '@/app/context/auth/CheckloginContext';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/use-toast';

import axios from 'axios';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';

const AllowService = ({ Pdata, fetchMechanic }) => {
  const router = useRouter();
  const { toast } = useToast();
  const Contextdata = useContext(CheckloginContext);
  const [loading, setLoading] = useState(false);
  const [Services, setServices] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const GetServiceList = async () => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/open/services-list`,
      {
        method: 'GET'
      }
    );
    const data = await res.json();
    if (data.operation == true) {
      console.log(data);
      setServices(data.ListData);
    }
  };

  useEffect(() => {
    if (Contextdata.JwtToken) {
      GetServiceList();
    }
    setLoading(false);
  }, [Contextdata.JwtToken]);

  const AllowServiceNew = async (data) => {
    console.log(data);

    const confirmAction = window.confirm(
      'Are you sure you want to allow this service?'
    );

    if (!confirmAction) {
      return;
    }

    try {
      setLoading(true);
      const payload = {
        ServiceSlug: data.slug,
        ServiceTitle: data.title,
        UserName: Pdata.UserName
      };

      const token = Contextdata.JwtToken;

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/allow-service-mechanic`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const operation = response.data.operation; // Ensure this is the correct path

      if (operation === true) {
        router.refresh();

        toast({
          variant: 'success',
          title: 'Service Allowed successfully!',
          description: 'New Service has been Allowed successfully.'
        });
        fetchMechanic();
      } else {
        toast({
          variant: 'destructive',
          title: 'Alert!',
          description: `${response.data.msg}`
        });
      }
    } catch (error) {
      console.error(error); // Log the error for debugging
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description:
          error.response?.data?.msg || 'There was a problem with your request.'
      });
    } finally {
      setLoading(false);
      closeDialog();
    }
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
  };

  return (
    <div>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">Allow Service</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Allow Service</DialogTitle>
            <DialogDescription>
              Add a Service to {Pdata.name}'s profile
            </DialogDescription>
          </DialogHeader>
          <div className="grid h-72 gap-4 overflow-y-auto py-4">
            {Services.map((item, index) => (
              <div
                key={index}
                className="cursor-pointer rounded border p-2 text-sm"
                onClick={() => AllowServiceNew(item)}
              >
                {item.title}
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AllowService;
