'use client';
import { Suspense, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import axios from 'axios';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import Cookies from 'js-cookie';

const formSchema = z.object({
  mobile: z
    .string()
    .length(10, { message: 'Mobile number must be exactly 10 digits' }),
  PassKey: z.string().optional()
});

function LoginForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl');
  const [loading, setLoading] = useState(false);
  const [showPassKey, setShowPassKey] = useState(false);
  const defaultValues = {
    mobile: '',
    PassKey: ''
  };

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/mechanic/login-auth`,
        data
      );

      if (response.data.operation == true) {
        Cookies.set('token', response.data.token, { expires: 7 });
        Cookies.set('userData', JSON.stringify(response.data.UserData), {
          expires: 7
        });
        alert('Login Succesfull!');
        window.location.href = `/mechanic`;
      } else {
        alert('Login failed!');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('An error occurred while logging in.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-2"
        >
          <FormField
            control={form.control}
            name="mobile"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mobile Number</FormLabel>
                <FormControl>
                  <Input
                    type="tel"
                    placeholder="Enter your mobile number..."
                    disabled={loading}
                    maxLength={10}
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      form.clearErrors('mobile');
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="PassKey"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showPassKey ? 'text' : 'password'}
                      placeholder="Enter your Password..."
                      disabled={loading}
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        form.clearErrors('PassKey');
                      }}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 flex items-center pr-3"
                      onClick={() => setShowPassKey((prev) => !prev)}
                    >
                      {showPassKey ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div style={{ height: '15px' }}></div>
          <div>
            <Button disabled={loading} className="ml-auto w-full" type="submit">
              Proceed to Login
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
}

export default function UserAuthPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}
