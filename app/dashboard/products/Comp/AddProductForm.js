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

const AddProductForm = () => {
  const Contextdata = useContext(CheckloginContext);
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const defaultValues = {
    name: null,
    description: null,
    price: null,
    imgUrl: null,
    isActive: false // Default value should be false
  };

  const form = useForm({ defaultValues });

  const validateForm = (data) => {
    const errors = {};
    if (!data.name) {
      errors.name = 'Product Name must be at least 3 characters';
    }
    if (!data.description) {
      errors.description = 'Product description must be at least 3 characters';
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

      const payload = {
        image: data.imgUrl,
        title: data.name,
        description: data.description,
        startFromPrice: data.price,
        isActive: data.isActive // This will be true or false
      };

      const token = Contextdata.JwtToken;

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/add-product`,
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
        router.push(`/dashboard/products`);
        toast({
          variant: 'success',
          title: 'Product created successfully!',
          description: 'Your product has been created successfully.'
        });
      } else {
        toast({
          variant: 'destructive',
          title: 'Unable to Create product!',
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
                      placeholder="Product name"
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
                      placeholder="Product description"
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
                  <FormLabel>Product Image</FormLabel>
                  <Uploadimg
                    onImageUpload={onImageUpload}
                    Title={'Upload Product Image'}
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
                  <FormLabel>Product Status</FormLabel>
                  <FormControl>
                    <Select
                      disabled={loading}
                      onValueChange={(value) => {
                        field.onChange(value === 'true'); // Sets true or false
                      }}
                      value={field.value ? 'true' : 'false'}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Product Status" />
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
            Create Product
          </Button>
        </form>
      </Form>
    </>
  );
};

export default AddProductForm;
