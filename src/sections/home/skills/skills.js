"use client";

import { Card, CardContent, Grid, Typography } from "@mui/material";
import { skills } from "./data";
import { useCallback } from "react";

export default function Skills() {
  const onMouseOver = useCallback((e) => {
    document
      .querySelectorAll(".card-skill")
      .forEach((card) => (card.style.filter = "blur(5px)"));

    e.currentTarget.style.filter = "none";
  }, []);

  const onMouseOut = useCallback((e) => {
    document
      .querySelectorAll(".card-skill")
      .forEach((card) => (card.style.filter = "none"));
  }, []);

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
          Skills
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
      >
        {skills.map((skill, i) => (
          <Card
            key={"skill" + i}
            sx={{ width: "120px", height: "120px" }}
            className="card-skill"
            onMouseOver={onMouseOver}
            onMouseOut={onMouseOut}
          >
            <CardContent
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
                rowGap: 1.5,
              }}
            >
              {skill.icon}
              <Typography variant="body2" fontWeight={"bold"}>
                {skill.name}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Grid>
    </Grid>
  );
}
