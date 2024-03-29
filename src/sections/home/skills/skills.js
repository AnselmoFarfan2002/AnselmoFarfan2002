"use client";

import { Card, CardContent, Grid, Typography } from "@mui/material";
import { skills } from "./data";
import { useCallback } from "react";
import SkillCard from "@/components/cards/skill-card";

export default function Skills() {
  const onMouseOver = useCallback((e) => {
    document
      .querySelectorAll("#skills .card-skill")
      .forEach((card) => (card.style.filter = "blur(5px)"));

    e.currentTarget.style.filter = "none";
  }, []);

  const onMouseOut = useCallback((e) => {
    document
      .querySelectorAll(".card-skill")
      .forEach((card) => (card.style.filter = "none"));
  }, []);

  const trackClick = useCallback(({ name }) => {
    window.rudderanalytics.page();
    window.rudderanalytics.track("skill-click", {
      name,
    });
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
          Some skills that I{"'"}ve been collecting during all these years.
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
          <SkillCard
            key={"skill" + i}
            icon={skill.icon}
            name={skill.name}
            cardProps={{
              onMouseOver,
              onMouseOut,
              onClick: () => trackClick(skill),
            }}
          />
        ))}
      </Grid>
    </Grid>
  );
}
