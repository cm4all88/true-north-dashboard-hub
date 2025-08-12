import React from "react";
import { useParams } from "react-router-dom";
import ProjectForm from "@/components/budget/ProjectForm";
import { useBudget, Project } from "@/contexts/BudgetContext";

export default function EditProjectPage(){
  const { id } = useParams();
  const { projects, updateProject } = useBudget();
  const project = projects.find(p=>p.id===id);

  if(!project){
    return <div className="max-w-4xl mx-auto p-4 text-sm text-muted-foreground">Project not found.</div>
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <ProjectForm initial={project} onSubmit={(p: Project)=>updateProject(p)} />
    </div>
  )
}
