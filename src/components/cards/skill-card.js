"use client";

import { Card, CardContent, Grid, Typography } from "@mui/material";

export default function SkillCard({ icon, name, cardProps = {} }) {
  return (
    <Card
      sx={{ width: "120px", height: "120px" }}
      className="card-skill"
      {...cardProps}
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
        {icon}
        <Typography variant="body2" fontWeight={"bold"}>
          {name}
        </Typography>
      </CardContent>
    </Card>
  );
}
