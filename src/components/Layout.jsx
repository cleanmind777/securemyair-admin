import { Outlet } from "react-router-dom";
import { Box, createTheme, useMediaQuery } from "@mui/material";
import MobileDrawer from "./MobileDrawer";
import MiniDrawer from "./MiniDrawer";
let theme = createTheme()
const Layout = () => {
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    return (
      <>
        <Box sx={{ p: 1, pl: { xs: 1, sm: 9 }, mt: { xs: 7, sm: 0 } }}>
          {isMobile ? <MobileDrawer /> : <MiniDrawer />}
          <Outlet/>
        </Box>
      </>
    );
};

export default Layout;


