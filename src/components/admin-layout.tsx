import { ReactNode, FC } from "react"
import {Grid,ScrollArea,Box,Card} from "@radix-ui/themes";

import SideBar from "./ui/sidebar/side-bar";

type SlotProps = {
  children: ReactNode;
};

type AdminLayoutComponent = FC<SlotProps> & {
  Body: FC<SlotProps>;
};

const Root : FC<SlotProps>  = ({children}) => {
    return (
        <div className="h-screen bg-slate-100 text-gray-800">
            <Grid columns="1fr 4fr" gap="3"  width="auto" className="min-h-full">
                <div className="bg-slate-100">
                    <SideBar/>
                </div>
                <div>
                    {children}
                </div>
            </Grid>
        </div>
    )
}

const Body: FC<SlotProps> = ({ children }) => (
    <ScrollArea type="hover" scrollbars="vertical">

        <Box maxWidth="100%" py="3" pr="3" pl="4">
            {children}
        </Box>
    </ScrollArea>
);


export const AdminLayout = Object.assign(Root, {
  Body
}) as AdminLayoutComponent;

