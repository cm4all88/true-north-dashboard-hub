import React, { useEffect } from "react";
import ProjectsList from "@/components/budget/ProjectsList";

export default function ProjectsPage(){
  useEffect(()=>{ document.title = "Projects - True North"; },[])
  return (
    <div className="max-w-6xl mx-auto p-4">
      <ProjectsList />
    </div>
  )
}
