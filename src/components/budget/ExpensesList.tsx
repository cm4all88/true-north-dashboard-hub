import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useBudget } from "@/contexts/BudgetContext";

export default function ExpensesList(){
  const { expenses, projects, deleteExpense } = useBudget();
  const projectMap = new Map(projects.map(p=>[p.id,p] as const));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Expenses</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {expenses.slice(0,50).map(e=> (
            <div key={e.id} className="border rounded-md p-3 flex flex-col md:flex-row md:items-center gap-2">
              <div className="flex-1 text-sm">
                <div className="font-medium">{projectMap.get(e.projectId)?.jobNumber} — {projectMap.get(e.projectId)?.name}</div>
                <div className="text-muted-foreground">{e.date} • {e.category}</div>
              </div>
              <div className="text-sm">{typeof e.amount==='number'? `$${e.amount.toFixed(2)}` : (typeof e.hours==='number'? `${e.hours}h` : '')}</div>
              <div className="flex gap-2">
                <Button variant="destructive" size="sm" onClick={()=>deleteExpense(e.id)}>Delete</Button>
              </div>
            </div>
          ))}
          {expenses.length===0 && <div className="text-sm text-muted-foreground">No expenses yet.</div>}
        </div>
      </CardContent>
    </Card>
  )
}
