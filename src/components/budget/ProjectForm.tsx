import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { categories, } from "./BudgetDashboard";
import { Category, Project } from "@/contexts/BudgetContext";
import { useNavigate } from "react-router-dom";

const emptyBudgets: Project["budgets"] = categories.reduce((acc, c) => {
  acc[c as Category] = {};
  return acc;
}, {} as any);

export default function ProjectForm({ initial, onSubmit }: { initial?: Project; onSubmit: (p: Project) => void; }) {
  const [form, setForm] = useState<Project>(
    initial || {
      id: crypto.randomUUID(),
      jobNumber: "",
      name: "",
      startDate: new Date().toISOString().slice(0,10),
      endDate: "",
      archived: false,
      budgets: JSON.parse(JSON.stringify(emptyBudgets)),
    }
  );
  const nav = useNavigate();

  useEffect(()=>{ document.title = (initial?"Edit":"New")+" Project - True North"; },[initial])

  function setBudgetHours(cat: Category, hours: number) {
    setForm((f) => ({ ...f, budgets: { ...f.budgets, [cat]: { ...f.budgets[cat], hours } } }));
  }
  function setBudgetAmount(cat: Category, amount: number) {
    setForm((f) => ({ ...f, budgets: { ...f.budgets, [cat]: { ...f.budgets[cat], amount } } }));
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{initial ? "Edit Project" : "New Project"}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label>Job Number</Label>
            <Input value={form.jobNumber} onChange={(e)=>setForm({...form, jobNumber:e.target.value})} />
          </div>
          <div>
            <Label>Project Name</Label>
            <Input value={form.name} onChange={(e)=>setForm({...form, name:e.target.value})} />
          </div>
          <div>
            <Label>Start Date</Label>
            <Input type="date" value={form.startDate} onChange={(e)=>setForm({...form, startDate:e.target.value})} />
          </div>
          <div>
            <Label>End Date</Label>
            <Input type="date" value={form.endDate||""} onChange={(e)=>setForm({...form, endDate:e.target.value})} />
          </div>
        </div>

        <div className="border rounded-md p-4">
          <div className="font-medium mb-3">Budgeted Hours / Amounts</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {categories.map((c) => (
              <div key={c} className="grid grid-cols-2 gap-2 items-center">
                <Label>{c}</Label>
                {c === "Supplies" ? (
                  <Input type="number" step="0.01" placeholder="Budget Amount $" value={form.budgets.Supplies.amount||"" as any}
                    onChange={(e)=>setBudgetAmount("Supplies", parseFloat(e.target.value)||0)} />
                ) : (
                  <Input type="number" step="0.1" placeholder="Hours" value={form.budgets[c as Category].hours||"" as any}
                    onChange={(e)=>setBudgetHours(c as Category, parseFloat(e.target.value)||0)} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-2">
          <Button onClick={()=>{ onSubmit(form); nav(-1); }}>Save</Button>
          <Button variant="outline" onClick={()=>nav(-1)}>Cancel</Button>
        </div>
      </CardContent>
    </Card>
  );
}
