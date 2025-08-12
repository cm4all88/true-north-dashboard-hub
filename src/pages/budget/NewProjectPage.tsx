import React from "react";
import ProjectForm from "@/components/budget/ProjectForm";
import { useBudget, Project } from "@/contexts/BudgetContext";

export default function NewProjectPage(){
  const { addProject } = useBudget();
  return (
    <div className="max-w-4xl mx-auto p-4">
      <ProjectForm onSubmit={(p: Project)=>addProject(p)} />
    </div>
  )
}
