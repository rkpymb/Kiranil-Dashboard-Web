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
import { LuArrowRight } from 'react-icons/lu';

const AcceptBooking = ({ Pdata, ReloadBooking }) => {
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

  const AssigntoMech = async (data) => {
    const confirmAction = window.confirm('Are you sure ?');

    if (!confirmAction) {
      return;
    }

    try {
      setLoading(true);

      const payload = {
        OrderID: Pdata.OrderID,
        BookingDT: formValues
      };

      const token = Contextdata.JwtToken;

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/mechanic/accept-service-booking`,
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
        window.location.reload();
      } else {
        toast({
          variant: 'destructive',
          title: 'Alert!',
          description: `${response.data.msg}`
        });
        if (response.data.Assigned === true) {
          alert(`${response.data.msg}`);
          window.location.reload();
        }
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
      AssigntoMech(data);
    }
  };

  return (
    <div>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button className="w-full" variant="default">
            Accept Booking <LuArrowRight className="ml-5" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Accept This Booking</DialogTitle>
            <DialogDescription>Order ID : {Pdata.OrderID}</DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="w-full space-y-2"
            >
              <div className="flex flex-col gap-4 p-2 py-4">
                <div>
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
                </div>
              </div>

              <DialogFooter className="w-full  p-2">
                <Button type="submit" className="w-full" variant="default">
                  Confirm & Accept <LuArrowRight className="ml-5" />
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AcceptBooking;
