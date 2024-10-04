'use client';
import React, { useState, useContext, useEffect } from 'react';
import CheckloginContext from '@/app/context/auth/CheckloginContext';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import axios from 'axios';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';

const AssignService = ({ Pdata, ReloadBooking }) => {
  const router = useRouter();
  const { toast } = useToast();
  const Contextdata = useContext(CheckloginContext);
  const [loading, setLoading] = useState(false);
  const [Step, setStep] = useState(1);
  const [Services, setServices] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formValues, setFormValues] = useState({});

  const defaultValues = {
    bookingDate: Pdata.OrderData.bookingDate,
    bookingTime: Pdata.OrderData.bookingTime
  };

  const form = useForm({
    defaultValues
  });

  const validateForm = (data) => {
    const errors = {};
    if (!data.bookingDate) {
      errors.bookingDate = 'Booking Date is required';
    }
    if (!data.bookingTime) {
      errors.bookingTime = 'Booking Time is required';
    }
    return errors;
  };

  const GetMechanicList = async () => {
    const payload = {
      ServiceSlug: Pdata.ServiceData.slug
    };
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/admin/service-mechanic`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${Contextdata.JwtToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (response.data.operation === true) {
      setServices(response.data.ListData);
    }
  };

  useEffect(() => {
    if (Contextdata.JwtToken) {
      GetMechanicList();
    }
    setLoading(false);
  }, [Contextdata.JwtToken]);

  const AssigntoMech = async (data) => {
    const confirmAction = window.confirm('Are you sure ?');

    if (!confirmAction) {
      return;
    }

    try {
      setLoading(true);
      const AssignData = {
        name: data.Mechanic.name,
        UserName: data.Mechanic.UserName
      };
      const payload = {
        AssignData: AssignData,
        OrderID: Pdata.OrderID,
        BookingDT: formValues // Use formValues instead of defaultValues
      };

      const token = Contextdata.JwtToken;

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/assign-service-mechanic`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.operation === true) {
        router.refresh();
        toast({
          variant: 'success',
          title: 'Service Assigned successfully!',
          description: 'New Service has been Assigned successfully.'
        });
        ReloadBooking();
      } else {
        toast({
          variant: 'destructive',
          title: 'Alert!',
          description: `${response.data.msg}`
        });
      }
    } catch (error) {
      console.error(error);
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

  const handleSubmit = (data) => {
    const errors = validateForm(data);
    if (Object.keys(errors).length > 0) {
      Object.keys(errors).forEach((field) => {
        form.setError(field, { message: errors[field] });
      });
      return;
    } else {
      setFormValues(data);
      setStep(2);
    }
  };

  return (
    <div>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">
            {Pdata.Assigned ? 'Change Machanic' : 'Assign Task'}
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {Pdata.Assigned ? 'Change Machanic' : 'Assign Task to Mechanic'}
            </DialogTitle>
            <DialogDescription>
              This action will be Assign a Mechanics to this Order ID :{' '}
              {Pdata.OrderID}
            </DialogDescription>
          </DialogHeader>
          <div className="flex h-72 flex-col gap-4 overflow-y-auto p-2 py-4">
            <div>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(handleSubmit)}
                  className="w-full space-y-2"
                >
                  <FormField
                    control={form.control}
                    name="bookingDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Service Date</FormLabel>
                        <FormControl>
                          <Input
                            type="date"
                            disabled={loading}
                            {...field}
                            onChange={(e) => {
                              field.onChange(e);
                              form.clearErrors('bookingDate');
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="bookingTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Service Time</FormLabel>
                        <FormControl>
                          <Input
                            type="time"
                            disabled={loading}
                            {...field}
                            onChange={(e) => {
                              field.onChange(e);
                              form.clearErrors('bookingTime');
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {Step == 1 && (
                    <div className="mt-5 flex">
                      <Button type="submit" disabled={loading}>
                        {loading ? 'Loading...' : 'Next'}
                      </Button>
                    </div>
                  )}
                </form>
              </Form>
            </div>

            {Step === 2 && (
              <div>
                <div className="flex flex-col gap-2">
                  <div className="text-sm">Select Service Machanic</div>
                  {Services.map((item, index) => (
                    <div
                      key={index}
                      className="flex h-auto cursor-pointer flex-row justify-between rounded border p-4"
                      onClick={() => AssigntoMech({ Mechanic: item.Mechanic })}
                    >
                      <div className="flex w-full flex-row justify-between">
                        <div className="flex gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage
                              src={''}
                              alt={item.Mechanic && item.Mechanic.name}
                            />
                            <AvatarFallback>
                              {item.Mechanic &&
                                item.Mechanic.name.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="text-sm"> {item.Mechanic.name}</div>
                            <div className="text-sm">
                              {' '}
                              {item.Mechanic.mobile}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div>
                        <Button variant="outline">Select</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AssignService;
