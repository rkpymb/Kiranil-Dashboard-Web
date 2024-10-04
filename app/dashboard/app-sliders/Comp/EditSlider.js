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
  DialogTitle
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

const EditSlider = ({ Pdata, DialogStatus, setDialogStatus }) => {
  const router = useRouter();
  const { toast } = useToast();
  const Contextdata = useContext(CheckloginContext);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (Pdata) {
      form.reset({
        screenUrl: Pdata.screenUrl,
        Order: Pdata.Order,
        isActive: Pdata.isActive
      });
    }
  }, [Pdata]);

  const defaultValues = {
    screenUrl: Pdata?.screenUrl || null,
    Order: Pdata?.Order || null,
    isActive: Pdata?.isActive || false
  };

  const form = useForm({
    defaultValues
  });

  const validateForm = (data) => {
    const errors = {};

    return errors;
  };

  const onSubmit = async (data) => {
    const errors = validateForm(data);
    if (Object.keys(errors).length > 0) {
      Object.keys(errors).forEach((field) => {
        form.setError(field, { message: errors[field] });
      });
      return;
    }

    try {
      setLoading(true);

      const payload = {
        _id: Pdata._id,
        imageUrl: data.imageUrl,
        screenUrl: data.screenUrl,
        Order: data.Order,
        isActive: data.isActive
      };

      const token = Contextdata.JwtToken;

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/edit-slider`,
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
        window.location.reload();
        toast({
          variant: 'success',
          title: 'Slider updated successfully!',
          description: 'Your Slider has been updated successfully.'
        });
        setDialogStatus(false);
      } else {
        toast({
          variant: 'destructive',
          title: 'Unable to Update Slider!',
          description: `${response.data.msg}`
        });
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: 'There was a problem with your request.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Dialog open={DialogStatus} onOpenChange={setDialogStatus}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit App Slider</DialogTitle>
            <DialogDescription>
              This action will update Slider Order and Redirect Screen
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-full space-y-8"
            >
              <div className="grid grid-cols-1 gap-5 md:grid-cols-1">
                <FormField
                  control={form.control}
                  name="screenUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Select Screen</FormLabel>
                      <FormControl>
                        <Select
                          disabled={loading}
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select Slider Status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Products">Products</SelectItem>
                            <SelectItem value="Services">Services</SelectItem>
                            <SelectItem value="MyBookings">
                              My Bookings
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="Order"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Slider Order (optional)</FormLabel>
                      <FormControl>
                        <Input
                          type="Number"
                          disabled={loading}
                          placeholder="Slider Order in Number"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="isActive"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Slider Status</FormLabel>
                      <FormControl>
                        <Select
                          disabled={loading}
                          onValueChange={(value) => {
                            field.onChange(value === 'true'); // Sets true or false
                          }}
                          value={field.value ? 'true' : 'false'}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select Slider Status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="true">Public</SelectItem>
                            <SelectItem value="false">Private</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button
                disabled={loading}
                className="w-full md:w-auto"
                type="submit"
              >
                Update Slider
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EditSlider;
