"use client";

import { useSession, signOut } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Bell, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function AdminHeader() {
  const { data: session } = useSession();

  return (
    <div className="sticky top-0 z-40 flex h-20 shrink-0 items-center gap-x-4 bg-white/80 backdrop-blur-md border-b border-white/20 px-4 shadow-lg sm:gap-x-6 sm:px-6 lg:px-8">
      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
        <div className="relative flex flex-1 items-center">
          <Search className="pointer-events-none absolute inset-y-0 left-0 h-full w-5 text-slate-400 ml-4" />
          <Input
            type="search"
            placeholder="Search products, orders, customers..."
            className="pl-12 pr-4 py-3 w-full max-w-lg bg-white/70 border-white/30 focus:bg-white/90 transition-all duration-200 rounded-xl shadow-sm"
          />
        </div>
        <div className="flex items-center gap-x-4 lg:gap-x-6">
          <Button
            variant="ghost"
            size="sm"
            className="relative h-10 w-10 rounded-xl bg-white/70 hover:bg-white/90 border border-white/30 shadow-sm transition-all duration-200"
          >
            <Bell className="h-5 w-5 text-slate-600" />
            <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-gradient-to-r from-red-500 to-pink-500 text-xs text-white flex items-center justify-center font-semibold shadow-lg">
              3
            </span>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-10 w-10 rounded-xl bg-white/70 hover:bg-white/90 border border-white/30 shadow-sm transition-all duration-200"
              >
                <Avatar className="h-8 w-8 ring-2 ring-white/50">
                  <AvatarImage
                    src={session?.user?.image || ""}
                    alt={session?.user?.name || ""}
                  />
                  <AvatarFallback className="bg-gradient-to-r from-purple-500 to-blue-500 text-white text-sm font-semibold">
                    {session?.user?.name?.charAt(0) || "A"}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-64 bg-white/95 backdrop-blur-md border border-white/30 shadow-xl rounded-2xl"
              align="end"
              forceMount
            >
              <DropdownMenuLabel className="font-normal p-4">
                <div className="flex flex-col space-y-2">
                  <p className="text-sm font-semibold leading-none text-slate-900">
                    {session?.user?.name}
                  </p>
                  <p className="text-xs leading-none text-slate-500">
                    {session?.user?.email}
                  </p>
                  <div className="flex items-center space-x-2 mt-2">
                    <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                    <span className="text-xs text-green-600 font-medium">
                      Online
                    </span>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-slate-200" />
              <DropdownMenuItem
                className="cursor-pointer p-3 hover:bg-slate-50 transition-colors duration-200"
                onSelect={() => signOut({ callbackUrl: "/" })}
              >
                <span className="text-sm font-medium">Sign out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
