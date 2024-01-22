import { Box, Button, Container, Grid, Typography } from "@mui/material";

export default function Cover() {
  return (
    <Grid
      container
      component={"section"}
      id="cover"
      sx={{
        flexDirection: "row-reverse",
        width: "100%",
      }}
      spacing={3}
    >
      <Grid
        item
        md={4}
        sx={{ display: "grid", alignContent: "center", justifyItems: "center" }}
      >
        <img
          src="https://avatars.githubusercontent.com/u/116023956?v=4"
          alt="Anselmo's profile picture on github"
          style={{ width: "100%", aspectRatio: "1/1" }}
          width={300}
        />
      </Grid>
      <Grid item md={8}>
        <Typography
          variant="h2"
          className="gradient"
          sx={{
            fontSize: {
              xs: "3em",
              sm: "3.5em",
            },
          }}
        >
          Hello, I'm Anselmo
        </Typography>
        <Typography
          variant="h3"
          sx={{
            fontSize: {
              xs: "2.5em",
              md: "3em",
            },
          }}
        >
          Full Stack Developer
        </Typography>
        <Typography variant="body" component={"p"} sx={{ my: 4 }}>
          I think of problems as solutions and make them real trought coding.{" "}
          <span style={{ fontWeight: "bold" }}>BTW</span>: Remember to view this
          site with an smile, otherwise you might get a bad impression 😉.
          (Trust me, we both don't want it)
        </Typography>

        <Box
          sx={{
            display: "flex",
            flexDirection: {
              sm: "row",
              xs: "column",
            },
            maxWidth: {
              md: "400px",
            },
            gap: 2,
          }}
        >
          <Button
            fullWidth
            variant="contained"
            sx={{ borderRadius: 10 }}
            href="mailto:anselmofarfan2002@gmail.com"
          >
            Get in touch
          </Button>
          <Button
            fullWidth
            variant="outlined"
            color="light"
            sx={{ borderRadius: 10 }}
            href="#projects"
          >
            View ALL Works
          </Button>
        </Box>
      </Grid>
    </Grid>
  );
}
