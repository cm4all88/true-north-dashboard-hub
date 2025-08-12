import React, { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useBudget } from "@/contexts/BudgetContext";

export default function ArchivedProjectsPage(){
  const { projects, unarchiveProject } = useBudget();
  useEffect(()=>{ document.title = "Archived Projects - True North"; },[])

  return (
    <div className="max-w-6xl mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Archived Projects</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {projects.filter(p=>p.archived).map(p=> (
              <div key={p.id} className="border rounded-md p-4 flex items-center justify-between">
                <div className="font-medium">{p.jobNumber} — {p.name}</div>
                <Button onClick={()=>unarchiveProject(p.id)}>Unarchive</Button>
              </div>
            ))}
            {projects.filter(p=>p.archived).length===0 && (
              <div className="text-sm text-muted-foreground">No archived projects.</div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
