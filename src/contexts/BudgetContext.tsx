import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

export type Category =
  | "PartyChief"
  | "Chainman"
  | "CAD"
  | "ProjectSurveyor"
  | "Principal"
  | "Admin"
  | "Supplies"
  | "Crew"; // calculated (PartyChief + Chainman)

export const RATES: Record<Exclude<Category, "Supplies" | "Crew">, number> = {
  PartyChief: 152.25,
  Chainman: 110.25,
  CAD: 155,
  ProjectSurveyor: 185,
  Principal: 215,
  Admin: 120,
};

export interface BudgetEntry {
  hours?: number; // budgeted hours for rate-based categories
  amount?: number; // for Supplies budget amount
}

export interface Project {
  id: string;
  jobNumber: string;
  name: string;
  startDate?: string; // ISO date
  endDate?: string; // ISO date
  archived?: boolean;
  budgets: Record<Category, BudgetEntry>;
}

export interface Expense {
  id: string;
  projectId: string;
  category: Exclude<Category, "Crew">; // Crew is calculated, not directly entered
  date: string; // ISO date
  hours?: number; // for rate-based categories
  amount?: number; // for Supplies or manual cost overrides
  note?: string;
}

interface BudgetState {
  projects: Project[];
  expenses: Expense[];
}

interface BudgetContextValue extends BudgetState {
  addProject: (p: Project) => void;
  updateProject: (p: Project) => void;
  archiveProject: (id: string) => void;
  unarchiveProject: (id: string) => void;
  addExpense: (e: Expense) => void;
  updateExpense: (e: Expense) => void;
  deleteExpense: (id: string) => void;
  getProjectActuals: (projectId: string) => {
    byCategory: Record<Category, { hours: number; cost: number }>;
    totals: { hours: number; cost: number };
  };
}

const BudgetContext = createContext<BudgetContextValue | undefined>(undefined);

const PROJECTS_KEY = "tnls_budget_projects";
const EXPENSES_KEY = "tnls_budget_expenses";

export const BudgetProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);

  // Load from localStorage
  useEffect(() => {
    try {
      const p = localStorage.getItem(PROJECTS_KEY);
      const e = localStorage.getItem(EXPENSES_KEY);
      if (p) setProjects(JSON.parse(p));
      if (e) setExpenses(JSON.parse(e));
    } catch {}
  }, []);

  // Persist
  useEffect(() => {
    localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
  }, [projects]);
  useEffect(() => {
    localStorage.setItem(EXPENSES_KEY, JSON.stringify(expenses));
  }, [expenses]);

  const addProject = (p: Project) => setProjects((prev) => [...prev, p]);
  const updateProject = (p: Project) => setProjects((prev) => prev.map((x) => (x.id === p.id ? p : x)));
  const archiveProject = (id: string) => setProjects((prev) => prev.map((x) => (x.id === id ? { ...x, archived: true } : x)));
  const unarchiveProject = (id: string) => setProjects((prev) => prev.map((x) => (x.id === id ? { ...x, archived: false } : x)));

  const addExpense = (e: Expense) => setExpenses((prev) => [e, ...prev]);
  const updateExpense = (e: Expense) => setExpenses((prev) => prev.map((x) => (x.id === e.id ? e : x)));
  const deleteExpense = (id: string) => setExpenses((prev) => prev.filter((x) => x.id !== id));

  function categoryRate(cat: Category): number | undefined {
    if (cat === "Supplies" || cat === "Crew") return undefined;
    return RATES[cat as Exclude<Category, "Supplies" | "Crew">];
  }

  const getProjectActuals: BudgetContextValue["getProjectActuals"] = (projectId) => {
    const related = expenses.filter((e) => e.projectId === projectId);

    const base: Record<Category, { hours: number; cost: number }> = {
      PartyChief: { hours: 0, cost: 0 },
      Chainman: { hours: 0, cost: 0 },
      CAD: { hours: 0, cost: 0 },
      ProjectSurveyor: { hours: 0, cost: 0 },
      Principal: { hours: 0, cost: 0 },
      Admin: { hours: 0, cost: 0 },
      Supplies: { hours: 0, cost: 0 },
      Crew: { hours: 0, cost: 0 },
    };

    for (const e of related) {
      const r = categoryRate(e.category as Category);
      if (e.category === "Supplies") {
        const amt = e.amount || 0;
        base.Supplies.cost += amt;
      } else if (typeof r === "number") {
        const hrs = e.hours || 0;
        const override = e.amount; // allow manual cost override if provided
        const cost = typeof override === "number" ? override : hrs * r;
        base[e.category as Category].hours += hrs;
        base[e.category as Category].cost += cost;
      }
    }

    // Crew = PartyChief + Chainman
    base.Crew.hours = base.PartyChief.hours + base.Chainman.hours;
    base.Crew.cost = base.PartyChief.cost + base.Chainman.cost;

    const totals = Object.values(base).reduce(
      (acc, v) => ({ hours: acc.hours + v.hours, cost: acc.cost + v.cost }),
      { hours: 0, cost: 0 }
    );

    return { byCategory: base, totals };
  };

  const value = useMemo(
    () => ({
      projects,
      expenses,
      addProject,
      updateProject,
      archiveProject,
      unarchiveProject,
      addExpense,
      updateExpense,
      deleteExpense,
      getProjectActuals,
    }),
    [projects, expenses]
  );

  return <BudgetContext.Provider value={value}>{children}</BudgetContext.Provider>;
};

export const useBudget = () => {
  const ctx = useContext(BudgetContext);
  if (!ctx) throw new Error("useBudget must be used within BudgetProvider");
  return ctx;
};
