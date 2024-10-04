'use client';
import React from 'react';
import { useState, useEffect } from 'react';
import { ReloadIcon } from '@radix-ui/react-icons';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
const Page = () => {
  const router = useRouter();

  const CheckLogin = async () => {
    const token = Cookies.get('token');
    const userDataCookie = Cookies.get('userData');

    if (!token && userDataCookie) {
      setUserLogin(false);
      ChangeAlertData('User is not logged in', 'warning');
    } else {
      const UserData = JSON.parse(userDataCookie);
      const Role = UserData.Role;
      if (Role == 'Mechanic') {
        router.push(`/mechanic`);
      }
      if (Role == 'Admin') {
        router.push(`/dashboard`);
      }
      if (!Role) {
        router.push(`/`);
      }
    }
  };

  useEffect(() => {
    CheckLogin();
  }, []);

  return (
    <div className="m-auto flex h-screen w-full flex-col items-center justify-center">
      <img src="/logoapp.png" width="100px" alt="logo" />
      <ReloadIcon className="m-8 h-10 w-8 animate-spin" />
    </div>
  );
};

export default Page;
