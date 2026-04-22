import { ReactNode, FC } from "react"
import {Grid,ScrollArea,Box,Card} from "@radix-ui/themes";
import AdminNavBar from "./admin-navbar";

import SideBar from "./ui/sidebar/side-bar";

type SlotProps = {
  children: ReactNode;
};

type AdminLayoutComponent = FC<SlotProps> & {
  Body: FC<SlotProps>;
};

const Root : FC<SlotProps>  = ({children}) => {
    return (
        <div className=" h-full  text-gray-800">
            <AdminNavBar/>
            <Grid columns="1fr 4fr" gap="0"  width="auto" className="h-full">
                <div className="">
                    <SideBar/>
                </div>
                <div className="bg-slate-100">
                    {children}
                </div>
            </Grid>
        </div>
    )
}

const Body: FC<SlotProps> = ({ children }) => (
    <ScrollArea type="hover" scrollbars="vertical" className="h-full">

        <Box maxWidth="100%" py="6" pr="4" pl="6">
            {children}
        </Box>
    </ScrollArea>
);


export const AdminLayout = Object.assign(Root, {
  Body
}) as AdminLayoutComponent;

