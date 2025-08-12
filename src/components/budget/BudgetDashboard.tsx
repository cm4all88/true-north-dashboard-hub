import React, { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useBudget, Category, RATES } from "@/contexts/BudgetContext";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const categories: Category[] = [
  "PartyChief",
  "Chainman",
  "CAD",
  "ProjectSurveyor",
  "Principal",
  "Admin",
  "Crew",
  "Supplies",
];

function formatCurrency(n: number) {
  return n.toLocaleString(undefined, { style: "currency", currency: "USD" });
}

export default function BudgetDashboard() {
  const { projects, getProjectActuals } = useBudget();
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedProjectId && projects.length) {
      setSelectedProjectId(projects[0].id);
    }
    document.title = "Budget Dashboard - True North";
  }, [projects, selectedProjectId]);

  const selectedProject = useMemo(() => projects.find((p) => p.id === selectedProjectId) || null, [projects, selectedProjectId]);

  const { byCategory, totals } = useMemo(() => {
    if (!selectedProject) return { byCategory: {} as any, totals: { hours: 0, cost: 0 } };
    return getProjectActuals(selectedProject.id);
  }, [selectedProject, getProjectActuals]);

  const chartData = useMemo(() => {
    if (!selectedProject) return [] as any[];
    return categories.map((c) => {
      // Budgeted cost
      let budgetCost = 0;
      const b = selectedProject.budgets[c];
      if (c === "Supplies") {
        budgetCost = b?.amount || 0;
      } else if (c !== "Crew") {
        const rate = RATES[c as Exclude<Category, "Supplies" | "Crew">];
        budgetCost = (b?.hours || 0) * rate;
      } else {
        // Crew budget derived from PC + Chainman
        const pc = selectedProject.budgets.PartyChief?.hours || 0;
        const ch = selectedProject.budgets.Chainman?.hours || 0;
        const pcCost = pc * RATES.PartyChief;
        const chCost = ch * RATES.Chainman;
        budgetCost = pcCost + chCost;
      }

      const actual = byCategory[c] || { hours: 0, cost: 0 };
      return {
        category: c,
        Budget: Math.round(budgetCost * 100) / 100,
        Actual: Math.round(actual.cost * 100) / 100,
      };
    });
  }, [selectedProject, byCategory]);

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Budget Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="w-full md:w-80">
              <Select value={selectedProjectId || undefined} onValueChange={(v) => setSelectedProjectId(v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a project" />
                </SelectTrigger>
                <SelectContent>
                  {projects.filter(p=>!p.archived).map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.jobNumber} — {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {selectedProject && (
              <div className="text-sm text-muted-foreground">
                {selectedProject.startDate} — {selectedProject.endDate || "Ongoing"}
              </div>
            )}
          </div>
          {selectedProject ? (
            <div className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Total Budget (Cost)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {formatCurrency(
                      categories.reduce((sum, c) => {
                        const b = selectedProject.budgets[c];
                        if (!b) return sum;
                        if (c === "Supplies") return sum + (b.amount || 0);
                        if (c === "Crew") {
                          const pc = selectedProject.budgets.PartyChief?.hours || 0;
                          const ch = selectedProject.budgets.Chainman?.hours || 0;
                          return sum + pc * RATES.PartyChief + ch * RATES.Chainman;
                        }
                        const r = RATES[c as Exclude<Category, "Supplies" | "Crew">];
                        return sum + (b.hours || 0) * r;
                      }, 0)
                    )}
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Actual Cost to Date</CardTitle>
                  </CardHeader>
                  <CardContent>{formatCurrency(totals.cost)}</CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Remaining</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {formatCurrency(
                      categories.reduce((sum, c) => sum + (chartData.find((d) => d.category === c)?.Budget || 0), 0) - totals.cost
                    )}
                  </CardContent>
                </Card>
              </div>

              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <XAxis dataKey="category" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="Budget" fill="hsl(var(--primary))" />
                    <Bar dataKey="Actual" fill="hsl(var(--muted-foreground))" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          ) : (
            <div className="text-sm text-muted-foreground mt-4">Create a project to see dashboard.</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
