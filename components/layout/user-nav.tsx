'use client';
import React, { useState, useContext } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import CheckloginContext from '@/app/context/auth/CheckloginContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';

export function UserNav() {
  const Contextdata = useContext(CheckloginContext);
  const session = true;

  const handleLogout = () => {
    Contextdata.logout();
  };

  return (
    <div>
      {session ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src={''}
                  alt={Contextdata.UserData && Contextdata.UserData.name}
                />
                <AvatarFallback>
                  {Contextdata.UserData &&
                    Contextdata.UserData.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">
                  {Contextdata.UserData && Contextdata.UserData.name}
                </p>
                <p className="text-xs leading-none text-muted-foreground">
                  {Contextdata.UserData && Contextdata.UserData.Role}
                </p>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Button variant="ghost" className="h-8 w-8">
          Sign In
        </Button>
      )}
    </div>
  );
}
