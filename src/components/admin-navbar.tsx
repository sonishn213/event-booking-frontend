import { useAuth } from "react-oidc-context";
import { Avatar, AvatarFallback } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { LogOut } from "lucide-react";
import {
  Box,
  Flex,
  IconButton,
  Separator,
  Card,
  Text,
  Heading,
  Grid,
} from "@radix-ui/themes";

import { Bell, FerrisWheel } from "lucide-react";
import React from "react";

const Profile: React.FC = () => {
  const { user, signoutRedirect } = useAuth();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="focus-visible:outline-0 cursor-pointer">
        <Avatar className="h-8 w-8">
          <AvatarFallback className="bg-gray-300">
            {user?.profile?.preferred_username?.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end">
        <DropdownMenuLabel className="font-normal">
          <p className="text-sm font-medium">
            {user?.profile?.preferred_username}
          </p>
          <p className="text-sm text-gray-400">{user?.profile?.email}</p>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="hover:bg-gray-800 cursor-pointer"
          onClick={() => signoutRedirect()}
        >
          <LogOut color="red" />
          <Text color="red">Log Out</Text>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const LogoSide: React.FC = () => {
  return (
    <Box pt="3" px="4">
      <Flex gap="2" justify="between" align="center">
        <Flex gap="2" align="center">
          <FerrisWheel />
          <Heading>Eventz</Heading>
        </Flex>
      </Flex>
    </Box>
  );
};

const Notification: React.FC = () => {
  return (
    <div className="cursor-pointer">
      <IconButton variant="ghost" radius="full" color="gray" className="pb-0  ">
        <Bell size="20" strokeWidth="2" />
      </IconButton>
    </div>
  );
};

const AdminNavBar = () => {
  return (
    <header className="bg-white">
      <Grid
        columns="1fr 4fr"
        gap="0"
        width="auto"
        className="border-b-1  border-gray-300"
      >
        <div className="border-r-1 border-gray-300 pb-3">
          <LogoSide />
        </div>
        <div>
          <Flex gap="6" align="center" justify="end" pt="3" px="4">
            <Notification />
            <Profile />
          </Flex>
        </div>
      </Grid>
      {/* 
            <div className="px-3">
                <Separator mt="3" mb="0" size="4" />
            </div> */}
    </header>
  );
};

export default AdminNavBar;
