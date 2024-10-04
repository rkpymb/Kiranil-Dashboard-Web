'use client';
import React, { useState, useContext, useEffect } from 'react';
import CheckloginContext from '@/app/context/auth/CheckloginContext';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/use-toast';

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

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

const BookingOrderStatus = ({ Pdata, ReloadBooking }) => {
  const router = useRouter();
  const { toast } = useToast();
  const Contextdata = useContext(CheckloginContext);
  const [loading, setLoading] = useState(false);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formValues, setFormValues] = useState({});
  const [TotalAmt, setTotalAmt] = useState(0);
  const [orderStatus, setOrderStatus] = useState(null);
  const defaultValues = {
    PaymentStatus: null,
    OrderStatus: null,
    Price: Pdata.PaymentData.Price,
    Discount: Pdata.PaymentData.Discount,
    Total: Pdata.PaymentData.Price - Pdata.PaymentData.Discount,
    PriceText: '',
    Mode: Pdata.PaymentData.Mode
  };

  const form = useForm({
    defaultValues
  });

  // Update TotalAmt based on Price and Discount
  useEffect(() => {
    setTotalAmt(form.watch('Price') - form.watch('Discount'));
  }, [form.watch('Price'), form.watch('Discount')]);

  useEffect(() => {
    setTotalAmt(Pdata.PaymentData.Price - Pdata.PaymentData.Discount);
  }, [Pdata]);

  const validateForm = (data) => {
    const errors = {};
    if (!data.OrderStatus) {
      errors.OrderStatus = 'Order Status is required';
    }
    if (orderStatus === '3' && !data.PaymentStatus) {
      errors.PaymentStatus = 'Payment Status is required';
    }
    return errors;
  };

  const UpdateOrder = async (data) => {
    const confirmAction = window.confirm('Are you sure?');

    if (!confirmAction) {
      return;
    }

    try {
      setLoading(true);

      const payload = {
        OrderID: Pdata.OrderID,
        OrderStatus: data.OrderStatus,
        PaymentStatus: data.PaymentStatus,
        Price: data.Price,
        Discount: data.Discount,
        Mode: data.Mode
      };

      const token = Contextdata.JwtToken;

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/mechanic/update-service-bookings-order`,
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
        return true;
      } else {
        toast({
          variant: 'destructive',
          title: 'Alert!',
          description: `${response.data.msg}`
        });
        return false;
      }
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description:
          error.response?.data?.msg || 'There was a problem with your request.'
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
  };

  const handleSubmit = async (data) => {
    const errors = validateForm(data);
    if (Object.keys(errors).length > 0) {
      Object.keys(errors).forEach((field) => {
        form.setError(field, { message: errors[field] });
      });
      return;
    } else {
      setFormValues(data);
      const success = await UpdateOrder(data);
      if (success) {
        closeDialog();
      }
    }
  };

  return (
    <div>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">Edit</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Order</DialogTitle>
            <DialogDescription>
              This action will update Order and Payment Status for Order ID :{' '}
              {Pdata.OrderID}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="w-full space-y-2"
            >
              <div className="flex h-72 flex-col gap-4 overflow-y-auto p-4">
                <div className="flex flex-col gap-4">
                  {/* Step 1: Select Order Status */}
                  <FormField
                    control={form.control}
                    name="OrderStatus"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Order Status</FormLabel>
                        <FormControl>
                          <Select
                            disabled={loading}
                            onValueChange={(value) => {
                              field.onChange(value);
                              setOrderStatus(value);
                              if (value === '3') {
                                form.setValue('OrderStatus', '3');
                              }
                            }}
                            value={field.value}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select Order Status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="3">Complete Order</SelectItem>
                              <SelectItem value="0">Cancel Order</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Step 2: Display Payment Status and other fields if Complete Order is selected */}
                  {orderStatus === '3' && (
                    <div className="flex flex-col gap-4">
                      <FormField
                        control={form.control}
                        name="PaymentStatus"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Payment Status</FormLabel>
                            <FormControl>
                              <Select
                                disabled={loading}
                                onValueChange={field.onChange}
                                value={field.value}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select Payment Status" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="true">Paid</SelectItem>
                                  <SelectItem value="false">Dues</SelectItem>
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="Price"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Price</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                disabled={loading}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="Discount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Discount</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                disabled={loading}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="Mode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Payment Mode</FormLabel>
                            <FormControl>
                              <Select
                                disabled={loading}
                                onValueChange={field.onChange}
                                value={field.value}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select Payment Status" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Online">Online</SelectItem>
                                  <SelectItem value="Cash">Cash</SelectItem>
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}
                </div>
              </div>
              {orderStatus && (
                <DialogFooter>
                  <div className="flex w-full flex-row items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-xs"> Total</span>
                      <span className="text-lg"> ₹ {TotalAmt}</span>
                    </div>
                    <Button type="submit" disabled={loading}>
                      Save changes
                    </Button>
                  </div>
                </DialogFooter>
              )}
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BookingOrderStatus;
