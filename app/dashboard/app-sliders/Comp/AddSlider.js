'use client';
import React, { useState, useContext } from 'react';
import { useForm } from 'react-hook-form';
import CheckloginContext from '@/app/context/auth/CheckloginContext';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Uploadimg from '@/app/Comp/Uploadimg';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import axios from 'axios';

const AddSliderForm = () => {
  const Contextdata = useContext(CheckloginContext);
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const defaultValues = {
    screenUrl: null,
    Order: null,
    imageUrl: null,
    isActive: false
  };

  const form = useForm({ defaultValues });

  const validateForm = (data) => {
    const errors = {};

    if (!data.imageUrl) {
      errors.imageUrl = 'At least one image must be added.';
    }
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
        imageUrl: data.imageUrl,
        screenUrl: data.screenUrl,
        Order: data.Order,
        isActive: data.isActive
      };

      const token = Contextdata.JwtToken;

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/add-slider`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log(response.data);
      if (response.data.operation === true) {
        router.refresh();
        router.push(`/dashboard/app-sliders`);
        toast({
          variant: 'success',
          title: 'Slider created successfully!',
          description: 'Your Slider has been created successfully.'
        });
      } else {
        toast({
          variant: 'destructive',
          title: 'Unable to Create Slider!',
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

  const onImageUpload = (Filedata) => {
    if (Filedata && Filedata.postData && Filedata.postData.fileName) {
      form.setValue('imageUrl', Filedata.postData.fileName);
    }
  };

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-8"
        >
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
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
                        <SelectItem value="MyBookings">My Bookings</SelectItem>
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
            <FormField
              control={form.control}
              name="imageUrl"
              render={() => (
                <FormItem>
                  <FormLabel>Slider Image</FormLabel>
                  <Uploadimg
                    onImageUpload={onImageUpload}
                    Title={'Upload Slider Image'}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button disabled={loading} className="w-full md:w-auto" type="submit">
            Add Slider
          </Button>
        </form>
      </Form>
    </>
  );
};

export default AddSliderForm;
