import MaterialSVG from "@/assets/svg/material-svg";
import { Box, Typography } from "@mui/material";

export default function Footer() {
  return (
    <footer>
      <Box width={"100%"} sx={{ p: 5, textAlign: "center" }}>
        This site has been made with Next/React/Material
        <Typography sx={{ p: 1, flexGrow: 1 }} color={"white"}>
          <span style={{ fontWeight: "bold" }}>Anselmo</span>Farfan.
        </Typography>
      </Box>
    </footer>
  );
}
