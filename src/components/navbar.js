"use client";

import {
  GitHub,
  Home,
  LinkedIn,
  PersonSearch,
  Phone,
  Widgets,
} from "@mui/icons-material";
import {
  AppBar,
  Button,
  IconButton,
  Toolbar,
  Typography,
  createTheme,
  useMediaQuery,
} from "@mui/material";

export default function NavBar() {
  const theme = createTheme({});
  const screenXS = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <AppBar sx={{ bgcolor: "transparent" }} position="absolute">
      <Toolbar>
        <Typography sx={{ p: 3, flexGrow: 1 }}>
          <span style={{ fontWeight: "bold" }}>Anselmo</span>Farfan
        </Typography>
        {!screenXS && (
          <>
            <Button color="light" startIcon={<Home />} title="Home">
              Home
            </Button>
            <Button color="light" startIcon={<PersonSearch />} title="About">
              About
            </Button>
            <Button color="light" startIcon={<Widgets />} title="Projects">
              Projects
            </Button>
            <Button color="light" startIcon={<Phone />} title="Contact">
              Contact
            </Button>
            <IconButton
              title="LinkedIn"
              href="https://www.linkedin.com/in/anselmo-c%C3%A9sar-farfan-pajuelo-7b9b6724b/"
            >
              <LinkedIn color="light" />
            </IconButton>
            <IconButton
              title="GitHub"
              href="https://github.com/AnselmoFarfan2002"
            >
              <GitHub color="light" />
            </IconButton>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
}
