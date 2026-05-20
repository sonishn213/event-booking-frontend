import React from "react";
import {
  Box,
  Flex,
  IconButton,
  Separator,
  Card,
  Text,
  Heading,
  Grid,
  Avatar,
  Popover,
  Button,
  Dialog,
} from "@radix-ui/themes";
import {
  ArrowDown,
  Bell,
  BookKey,
  ChevronDown,
  FerrisWheel,
  LogOut,
  Menu,
  SquareArrowOutUpRight,
  Ticket,
  TicketCheck,
} from "lucide-react";
import { Link } from "react-router";
import { useAuth } from "react-oidc-context";
import { useRoles } from "@/hooks/use-roles";

const LogoSide: React.FC = () => {
  return (
    <Link to="/">
      <Flex gap="2" align="center">
        <FerrisWheel />
        <Heading>Eventz</Heading>
      </Flex>
    </Link>
  );
};

const Profile: React.FC = () => {
  const { signoutRedirect, user } = useAuth();
  const { isOrganizer, isStaff } = useRoles();
  return (
    <Popover.Root>
      <Popover.Trigger>
        <Flex align="center" gap="1" className="cursor-pointer">
          <Avatar
            // src="https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?&w=256&h=256&q=70&crop=focalpoint&fp-x=0.5&fp-y=0.3&fp-z=1&fit=crop"
            fallback={
              user?.profile?.preferred_username?.slice(0, 2).toUpperCase() ||
              "A"
            }
            color={isOrganizer ? "indigo" : "orange"}
            className={`border ${
              isOrganizer ? "border-indigo-200" : "border-orange-200"
            }`}
          />
          <ChevronDown size="14" />
        </Flex>
      </Popover.Trigger>
      <Popover.Content width="240px" size="1">
        <p className="text-sm font-medium">{user?.profile?.name}</p>
        <p className="text-sm text-gray-400">{user?.profile?.email}</p>

        <Separator size="4" my="2" />
        <Link to="/dashboard/tickets">
          <Flex
            gap="3"
            align="center"
            className="hover:bg-gray-100 cursor-pointer px-2 py-1 rounded-md"
          >
            <Ticket size="16" />
            <Text size="3">Your tickets</Text>
          </Flex>
        </Link>

        {isStaff && (
          <Link to="/dashboard/staff/organizers">
            <Flex
              gap="3"
              align="center"
              className="hover:bg-gray-100 cursor-pointer px-2 py-1 rounded-md"
            >
              <TicketCheck size="16" />
              <Text size="3">Validate ticket</Text>
            </Flex>
          </Link>
        )}
        {isOrganizer && (
          <Link to="/dashboard">
            <Flex
              gap="3"
              align="center"
              className="hover:bg-gray-100 cursor-pointer px-2 py-1 rounded-md"
            >
              <BookKey size="16" />
              <Text size="3">Dashboard</Text>
            </Flex>
          </Link>
        )}

        <Flex
          gap="3"
          align="center"
          className="hover:bg-gray-100 cursor-pointer px-2 py-1 rounded-md"
          onClick={() => signoutRedirect()}
        >
          <LogOut size="16" color="red" />
          <Text color="red" size="3">
            Log out
          </Text>
        </Flex>

        {!isOrganizer && (
          <>
            <Separator size="4" my="2" />
            <Link to="/become-organizer">
              <div className="mt-4 cursor-pointer">
                <div className="bg-gradient-to-r from-[#084887]  to-[#084887]/70 rounded-md px-2 py-1">
                  <h5 className="text-md font-bold text-white flex items-center gap-2 mb-2">
                    Become an Organizer <SquareArrowOutUpRight size="16" />
                  </h5>
                  <p className="text-sm text-white">
                    Unlock the feature to host events and sell tickets
                  </p>
                </div>
              </div>
            </Link>
          </>
        )}
      </Popover.Content>
    </Popover.Root>
  );
};

const AttendeeNavBar: React.FC = () => {
  const { isAuthenticated, signinRedirect } = useAuth();

  return (
    <div>
      <Box pt="3" pb="3" px="2">
        <Flex gap="2" justify="between" align="center">
          <LogoSide />

          <Flex gap="9" align="center">
            <div className="hidden lg:block">
              <Flex gap="6" className="uppercase" align="center">
                <Link to="/">Home</Link>
                <Link to="/events">Events</Link>
                <Link to="/about">About us</Link>
                <Link to="/contact">Contact</Link>
              </Flex>
            </div>
            <Flex align="center" gap="2">
              <div>
                {isAuthenticated ? (
                  <Profile />
                ) : (
                  <div
                    className="cursor-pointer"
                    onClick={() => signinRedirect()}
                  >
                    <div className="font-user border-2 border-orange-500 py-2 px-6 rounded-full tracking-wider  hover:bg-orange-400">
                      Log In
                    </div>
                  </div>
                )}
              </div>
              <div className="lg:hidden">
                <Dialog.Root>
                  <Dialog.Trigger>
                    <Menu />
                  </Dialog.Trigger>
                  <Dialog.Content>
                    <div className="text-center">
                      <div className="pb-2">
                        <Link to="/">Home</Link>
                      </div>
                      <div className="py-2">
                        <Link to="/events">Events</Link>
                      </div>
                      <div className="py-2">
                        <Link to="/about">About us</Link>
                      </div>
                      <div className="pt-2">
                        <Link to="/contact">Contact</Link>
                      </div>
                    </div>
                  </Dialog.Content>
                </Dialog.Root>
              </div>
            </Flex>
          </Flex>
        </Flex>
      </Box>
    </div>
  );
};

export default AttendeeNavBar;
