"use client";

import { Grid, Typography, createTheme, useMediaQuery } from "@mui/material";
import { projects } from "./data";
import ProjectCard from "@/components/cards/project-card";

export default function Projects() {
  const theme = createTheme();
  const sm = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <>
      <Grid
        container
        component={"section"}
        id="projects"
        spacing={3}
        sx={{
          width: "100%",
        }}
      >
        <Grid
          item
          xs={12}
          sx={{ ...(sm ? { p: "0 0 0 24px !important" } : {}) }}
        >
          <Typography variant="h3" className="gradient">
            Projects
          </Typography>
          <Typography variant="body2" sx={{ maxWidth: "700px" }}>
            Some projects that I've done, some of these don't have a github url
            because the code is private (belong to the organization) or don't
            have a website url to visit (maybe is not deployed)
          </Typography>
        </Grid>

        {!sm && (
          <Grid item xs={12}>
            <Grid container spacing={3} justifyContent={"center"}>
              {projects.map((project, i) => (
                <ProjectCard key={"project" + i} project={project} />
              ))}
            </Grid>
          </Grid>
        )}
      </Grid>

      {sm && (
        <>
          <Grid item xs={12}>
            <Grid container spacing={3} justifyContent={"center"}>
              {projects.map((project, i) => (
                <ProjectCard key={"project" + i} project={project} />
              ))}
            </Grid>
          </Grid>
          <br />
          <br />
          <br />
        </>
      )}
    </>
  );
}
