import * as React from "react";
import { Link } from "react-router";

import {ScrollArea,Box} from "@radix-ui/themes";

import { SideBarItem } from "./side-bar-item";


import { House,CalendarFold} from "lucide-react";



const SideBar : React.FC = () => {

    return (

    <div className="w-full h-full bg-white border-r-1 border-gray-300" >

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
                <Link to="/dashboard/events">
                    <SideBarItem active>
                        <SideBarItem.Icon>
                            <CalendarFold size={18} strokeWidth={1.5}/>
                        </SideBarItem.Icon>
                        <SideBarItem.Label>
                            Events
                        </SideBarItem.Label>
                    </SideBarItem>
                </Link>

                
            </Box>
        </ScrollArea>

    </div>

    );
}; 



export default SideBar;