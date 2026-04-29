import React from "react";
import { Flex } from "@radix-ui/themes";
import { ChevronsDown } from "lucide-react";

type RootProps = {
  children: React.ReactNode;
};

const ButtonAlt: React.FC<RootProps> = ({ children }) => {
  return (
    <Flex
      className="group/buttonhero font-user text-2xl font-black  border-3 border-orange-300 hover:border-orange-200 hover:text-orange-100 rounded-full ps-10 pe-1.5 py-1   cursor-pointer transition duration-500"
      align="center"
    >
      {children}
    </Flex>
  );
};

export default ButtonAlt;
