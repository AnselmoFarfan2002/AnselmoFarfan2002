"use client";

import ProjectCard from "@/components/cards/project-card";
import { projects } from "@/sections/home/projects/data";
import { Dialog, DialogContent, Typography } from "@mui/material";
import { useRouter } from "next/navigation";

export default function Modal({ params }) {
  const { id } = params;
  const project = projects[id];
  const router = useRouter();
  const onClose = () => router.back();

  return (
    <Dialog open={true} onClose={onClose}>
      <DialogContent>
        <ProjectCard project={project} pk={id} hideDesc={false} />
      </DialogContent>
    </Dialog>
  );
}
