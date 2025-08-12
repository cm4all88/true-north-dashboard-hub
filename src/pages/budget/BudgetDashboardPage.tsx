import React, { useEffect } from "react";
import BudgetDashboard from "@/components/budget/BudgetDashboard";

export default function BudgetDashboardPage(){
  useEffect(()=>{ document.title = "Budget Dashboard - True North"; },[])
  return (
    <div className="max-w-6xl mx-auto p-4">
      <BudgetDashboard />
    </div>
  )
}
