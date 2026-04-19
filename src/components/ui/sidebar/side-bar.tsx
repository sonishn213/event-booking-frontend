import * as React from "react";

import {ScrollArea,Box,Flex,Heading,IconButton,Separator} from "@radix-ui/themes";

import { SideBarItem } from "./side-bar-item";


import { House,CalendarFold,Bell,FerrisWheel } from "lucide-react";

const SideBar : React.FC = () => {
    return (

    <div>
        <header>
            <Box pt="3" px="4">
                <Flex gap="2" justify="between" align="center">
                    <Flex gap="2" align="center">
                        <FerrisWheel />
                        <Heading>Eventz</Heading>
                    </Flex>
                    <div className="cursor-pointer">
                        <IconButton variant="ghost" radius="full" color="gray">
                            <Bell size="20" strokeWidth="2"/>
                        </IconButton>
                    </div>
                </Flex>
            </Box>
            
        </header>
            <div className="px-3">
                <Separator mt="3" mb="0" size="4" />
            </div>
        <ScrollArea type="hover" scrollbars="vertical">

            <Box maxWidth="100%" py="3" px="4">
                <SideBarItem >
                    <SideBarItem.Icon>
                        <House size={18} strokeWidth={1.5} />
                    </SideBarItem.Icon>
                    <SideBarItem.Label>
                        Dashboard
                    </SideBarItem.Label>
                </SideBarItem>

                <SideBarItem active>
                    <SideBarItem.Icon>
                        <CalendarFold size={18} strokeWidth={1.5}/>
                    </SideBarItem.Icon>
                    <SideBarItem.Label>
                        Events
                    </SideBarItem.Label>
                </SideBarItem>
            </Box>
        </ScrollArea>
    </div>

    );
}; 



export default SideBar;