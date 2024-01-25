import { GitHub, Pageview, Search } from "@mui/icons-material";
import {
  Box,
  Button,
  Chip,
  Grid,
  IconButton,
  Paper,
  Typography,
} from "@mui/material";
import Link from "next/link";

export default function ProjectCard({
  project,
  xs = 12,
  md = 6,
  pk,
  hideDesc = true,
}) {
  const { photos = [], description, url, github, name, tools = [] } = project;
  const mainPhoto = photos[0];

  return (
    <Grid item xs={xs} md={md}>
      <Box
        className="container-card-project"
        sx={{
          position: "relative",
        }}
      >
        <img
          src={mainPhoto}
          style={{ width: "100%", position: "relative" }}
          loading="lazy"
        />
        <Paper
          className="container-text-project"
          sx={{
            ...(hideDesc
              ? {
                  position: {
                    md: "absolute",
                  },
                  opacity: {
                    md: 0,
                  },
                }
              : {}),
            p: 3,
            zIndex: 2,
            transition: "opacity 0.3s ease",
            bottom: 0,
          }}
        >
          <Typography variant="h6">{name}</Typography>
          {description}
          <Box sx={{ display: "flex", mt: 1, gap: 1, flexWrap: "wrap" }}>
            {tools.map((tool, i) => (
              <Chip
                key={name + tool + i}
                label={tool}
                color="info"
                className="tool-tag"
              />
            ))}
          </Box>
          <Box sx={{ width: "100%", textAlign: "end", mt: 2 }}>
            {hideDesc && (
              <Link href={"/projects/" + pk}>
                <IconButton color="light">
                  <Search />
                </IconButton>
              </Link>
            )}

            <Button
              disabled={!github}
              endIcon={<GitHub />}
              color="secondary"
              href={github}
              target="_blank"
            >
              Repository
            </Button>
            <Button
              endIcon={<Pageview />}
              disabled={!url}
              href={url}
              target="_blank"
            >
              See more
            </Button>
          </Box>
        </Paper>
      </Box>
    </Grid>
  );
}
