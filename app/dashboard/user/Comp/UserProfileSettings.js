'use client';
import React, { useState, useContext } from 'react';
import { useForm } from 'react-hook-form';
import CheckloginContext from '@/app/context/auth/CheckloginContext';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
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

const UserProfileSettings = ({ Pdata }) => {
  const Contextdata = useContext(CheckloginContext);
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const defaultValues = {
    name: Pdata.UserData.name,
    email: Pdata.UserData.email,
    address: Pdata.UserData.address,
    mobile: Pdata.mobile,
    isActive: Pdata.isActive
  };

  const form = useForm({ defaultValues });

  const validateForm = (data) => {
    const errors = {};
    if (!data.name || data.name.length < 3) {
      errors.name = 'Name must be at least 3 characters';
    }
    if (!data.email || !/\S+@\S+\.\S+/.test(data.email)) {
      errors.email = 'Email must be a valid email address';
    }
    if (!data.address) {
      errors.address = 'Address is required';
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
        name: data.name,
        email: data.email,
        address: data.address,
        isActive: data.isActive,
        UserName: Pdata.UserName
      };

      const token = Contextdata.JwtToken;

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/update-user-profile`,
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
          title: 'Profile Updated successfully!',
          description: 'Profile has been updated successfully.'
        });
      } else {
        toast({
          variant: 'destructive',
          title: 'Unable to Update Profile!',
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
      <div className="m-2 text-sm  text-gray-500">
        <span>Edit Profile</span>
      </div>
      <div className="mt-5 rounded-lg border p-4 shadow-md">
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
                        placeholder="Enter your name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        disabled={loading}
                        placeholder="Enter your email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input
                        disabled={loading}
                        placeholder="Enter your address"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="mobile"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mobile Number</FormLabel>
                    <FormControl>
                      <Input type="tel" disabled={true} value={field.value} />
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
                    <FormLabel>Profile Status</FormLabel>
                    <FormControl>
                      <Select
                        disabled={loading}
                        onValueChange={(value) => {
                          field.onChange(value === 'true');
                        }}
                        value={field.value ? 'true' : 'false'}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Profile Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="true">Active</SelectItem>
                          <SelectItem value="false">Deactive</SelectItem>
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
              Update Profile
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default UserProfileSettings;
