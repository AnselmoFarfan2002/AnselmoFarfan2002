import ProjectCard from "@/components/cards/project-card";
import { projects } from "@/sections/home/projects/data";
import { Grid, Paper, Typography } from "@mui/material";

export const metadata = {
  title: "Projects | Anselmo Farfan",
};

export default function Page({ params }) {
  const { id } = params;
  if (id >= projects.length) return null;

  const project = projects[id];

  return (
    <Grid container justifyContent={"center"} component={"section"}>
      <ProjectCard project={project} pk={id} hideDesc={false} />
    </Grid>
  );
}
