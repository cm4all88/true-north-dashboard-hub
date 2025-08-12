import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useBudget, RATES, Category } from "@/contexts/BudgetContext";
import { useNavigate } from "react-router-dom";

function currency(n: number){return n.toLocaleString(undefined,{style:"currency",currency:"USD"})}

export default function ProjectsList(){
  const { projects, archiveProject, unarchiveProject, getProjectActuals } = useBudget();
  const nav = useNavigate();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Projects</CardTitle>
          <Button onClick={()=>nav('/projects/new')}>New Project</Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {projects.filter(p=>!p.archived).map(p=>{
            const actuals = getProjectActuals(p.id);
            const budgetCost = Object.entries(p.budgets).reduce((sum,[cat, b])=>{
              if(cat==='Supplies') return sum + ((b as any).amount||0);
              if(cat==='Crew'){
                const pc = p.budgets.PartyChief?.hours||0; const ch=p.budgets.Chainman?.hours||0;
                return sum + pc*RATES.PartyChief + ch*RATES.Chainman;
              }
              const r = RATES[cat as Exclude<Category,'Supplies'|'Crew'>];
              return sum + ((b as any).hours||0)*r;
            },0);
            return (
              <div key={p.id} className="border rounded-md p-4 flex flex-col md:flex-row md:items-center gap-3">
                <div className="flex-1">
                  <div className="font-medium">{p.jobNumber} — {p.name}</div>
                  <div className="text-sm text-muted-foreground">{p.startDate} • {p.endDate||'Ongoing'}</div>
                </div>
                <div className="text-sm">
                  <div>Budget: {currency(budgetCost)}</div>
                  <div>Actual: {currency(actuals.totals.cost)}</div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={()=>nav(`/projects/edit/${p.id}`)}>Edit</Button>
                  <Button variant="secondary" onClick={()=>nav('/budget')}>Dashboard</Button>
                  <Button variant="destructive" onClick={()=>archiveProject(p.id)}>Archive</Button>
                </div>
              </div>
            )
          })}
          {projects.filter(p=>!p.archived).length===0 && (
            <div className="text-sm text-muted-foreground">No active projects. Create one to get started.</div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
