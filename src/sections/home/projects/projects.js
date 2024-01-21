import { Grid, Typography } from "@mui/material";

export default function Projects() {
  return (
    <Grid
      container
      component={"section"}
      id="skills"
      spacing={3}
      sx={{
        width: "100%",
      }}
    >
      <Grid item xs={12}>
        <Typography variant="h3" className="gradient">
          Projects
        </Typography>
        <Typography variant="body2">
          Some skills that I've been collecting during all these years.
        </Typography>
      </Grid>
      <Grid
        item
        xs={12}
        sx={{
          display: "flex",
          gap: 3,
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      ></Grid>
    </Grid>
  );
}
