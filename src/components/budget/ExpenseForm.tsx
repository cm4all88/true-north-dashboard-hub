import React, { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useBudget, Category, RATES } from "@/contexts/BudgetContext";

const selectableCategories: Exclude<Category, "Crew">[] = [
  "PartyChief",
  "Chainman",
  "CAD",
  "ProjectSurveyor",
  "Principal",
  "Admin",
  "Supplies",
];

export default function ExpenseForm(){
  const { projects, addExpense } = useBudget();
  const [projectId, setProjectId] = useState<string>("");
  const [category, setCategory] = useState<Exclude<Category, "Crew">>("PartyChief");
  const [date, setDate] = useState<string>(new Date().toISOString().slice(0,10));
  const [hours, setHours] = useState<number | undefined>(undefined);
  const [amount, setAmount] = useState<number | undefined>(undefined);
  const [note, setNote] = useState<string>("");

  useEffect(()=>{ document.title = "Expenses - True North" },[])

  const rate = useMemo(()=> (category==='Supplies'? undefined : RATES[category as Exclude<Category,'Supplies'|'Crew'>]),[category]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Expense</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label>Project</Label>
            <Select value={projectId} onValueChange={setProjectId}>
              <SelectTrigger>
                <SelectValue placeholder="Select project" />
              </SelectTrigger>
              <SelectContent>
                {projects.filter(p=>!p.archived).map(p=> (
                  <SelectItem key={p.id} value={p.id}>{p.jobNumber} — {p.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Category</Label>
            <Select value={category} onValueChange={(v)=>setCategory(v as any)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {selectableCategories.map(c=> (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Date</Label>
            <Input type="date" value={date} onChange={(e)=>setDate(e.target.value)} />
          </div>
        </div>
        {category === 'Supplies' ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Amount ($)</Label>
              <Input type="number" step="0.01" value={amount ?? ''} onChange={(e)=>setAmount(parseFloat(e.target.value)||0)} />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Hours</Label>
              <Input type="number" step="0.1" value={hours ?? ''} onChange={(e)=>setHours(parseFloat(e.target.value)||0)} />
            </div>
            <div>
              <Label>Override Amount ($)</Label>
              <Input type="number" step="0.01" value={amount ?? ''} onChange={(e)=>setAmount(parseFloat(e.target.value)||0)} />
            </div>
            <div className="self-end text-sm text-muted-foreground">
              Rate: {rate ? `$${rate.toFixed(2)}/hr` : '—'}
            </div>
          </div>
        )}
        <div>
          <Label>Note</Label>
          <Input value={note} onChange={(e)=>setNote(e.target.value)} placeholder="Optional" />
        </div>
        <div>
          <Button onClick={()=>{
            if(!projectId){ alert('Select a project'); return; }
            addExpense({ id: crypto.randomUUID(), projectId, category, date, hours, amount, note });
            setHours(undefined); setAmount(undefined); setNote("");
            alert('Expense added');
          }}>Add Expense</Button>
        </div>
      </CardContent>
    </Card>
  )
}
