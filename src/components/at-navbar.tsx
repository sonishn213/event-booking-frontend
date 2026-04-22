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
} from "@radix-ui/themes";
import { Bell, FerrisWheel } from "lucide-react";

const LogoSide: React.FC = () => {
  return (
    <Box pt="3">
      <Flex gap="2" justify="between" align="center">
        <Flex gap="2" align="center">
          <FerrisWheel />
          <Heading>Eventz</Heading>
        </Flex>
      </Flex>
    </Box>
  );
};

const AttendeeNavBar: React.FC = () => {
  return (
    <div>
      <LogoSide />
    </div>
  );
};

export default AttendeeNavBar;
