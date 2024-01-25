import {
  Construction,
  GitHub,
  Home,
  LinkedIn,
  Phone,
  Widgets,
} from "@mui/icons-material";
import { AppBar, Button, IconButton, Toolbar, Typography } from "@mui/material";

export default function NavBar() {
  return (
    <AppBar sx={{ bgcolor: "transparent" }} position="absolute">
      <Toolbar>
        <Typography sx={{ p: 3, flexGrow: 1 }} color={"white"}>
          <span style={{ fontWeight: "bold" }}>Anselmo</span>Farfan
        </Typography>
        <>
          <Button color="light" startIcon={<Home />} title="Home" href="/">
            Home
          </Button>
          <Button
            color="light"
            startIcon={<Widgets />}
            title="Projects"
            href="/#projects"
          >
            Projects
          </Button>
          <Button
            color="light"
            startIcon={<Construction />}
            title="Skills"
            href="/#skills"
          >
            Skills
          </Button>
          <Button
            color="light"
            startIcon={<Phone />}
            title="Contact"
            href="mailto:anselmofarfan2002@gmail.com"
          >
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
      </Toolbar>
    </AppBar>
  );
}
