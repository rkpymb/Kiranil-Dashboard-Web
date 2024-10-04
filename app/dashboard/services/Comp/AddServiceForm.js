'use client';
import React, { useState, useEffect, useContext } from 'react';
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

const AddServiceForm = () => {
  const Contextdata = useContext(CheckloginContext);
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const defaultValues = {
    name: null,
    description: null,
    price: null,
    imgUrl: null,
    isActive: false // Ensure default is false
  };

  const form = useForm({ defaultValues });

  const validateForm = (data) => {
    const errors = {};
    if (!data.name) {
      errors.name = 'Service Name must be at least 3 characters';
    }
    if (!data.description) {
      errors.description = 'Service description must be at least 3 characters';
    }
    if (!data.price) {
      errors.price = 'Price must be a valid number';
    }
    if (!data.imgUrl) {
      errors.imgUrl = 'At least one image must be added.';
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

      // Ensure isActive is always a boolean
      const payload = {
        image: data.imgUrl,
        title: data.name,
        description: data.description,
        startFromPrice: data.price,
        isActive: data.isActive === 'true' ? true : false // Explicitly set false if not true
      };

      const token = Contextdata.JwtToken;

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/add-service`,
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
        router.push(`/dashboard/services`);
        toast({
          variant: 'success',
          title: 'Service created successfully!',
          description: 'Your Service has been created successfully.'
        });
      } else {
        toast({
          variant: 'destructive',
          title: 'Unable to Create Service!',
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
      form.setValue('imgUrl', Filedata.postData.fileName);
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
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Service name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Service description"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input type="number" disabled={loading} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="imgUrl"
              render={() => (
                <FormItem>
                  <FormLabel>Service Image</FormLabel>
                  <Uploadimg
                    onImageUpload={onImageUpload}
                    Title={'Upload Service Image'}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Service Status</FormLabel>
                  <FormControl>
                    <Select
                      disabled={loading}
                      onValueChange={(value) => {
                        field.onChange(value); // Keep as string to maintain selected value
                      }}
                      value={field.value ? 'true' : 'false'}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Service Status" />
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
          <Button disabled={loading} className="w-full md:w-auto" type="submit">
            Create Service
          </Button>
        </form>
      </Form>
    </>
  );
};

export default AddServiceForm;
