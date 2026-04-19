import { ReactNode, FC } from "react";
import {Flex, Text} from "@radix-ui/themes";
import clsx from "clsx";

type SlotProps = {
  children: ReactNode;
};

type RootProps =  {
  children: ReactNode;
  active?: boolean;
};

type SideBarItemComponent = FC<RootProps> & {
  Icon: FC<SlotProps>;
  Label: FC<SlotProps>;
};

const Root: FC<RootProps> = ({ children, active = false}) => (
  <Flex 
    gap="3" 
    align="center" 
    py="2" 
    px="3"
    mb="2"
    className={clsx(
      "rounded-md transition cursor-pointer select-none hover:bg-gray-200",
      active && "bg-white shadow-sm hover:bg-white"
    )}

    
  >
    {children}
  </Flex>
);


const Icon: FC<SlotProps> = ({ children }) => (
  <span className="flex items-center">{children}</span>
);

const Label: FC<SlotProps> = ({ children }) => (
  <Text weight="medium">{children}</Text>
);

export const SideBarItem = Object.assign(Root, {
  Icon,
  Label,
}) as SideBarItemComponent;