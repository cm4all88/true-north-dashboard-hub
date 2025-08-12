import React, { useEffect } from "react";
import ExpenseForm from "@/components/budget/ExpenseForm";
import ExpensesList from "@/components/budget/ExpensesList";

export default function ExpensesPage(){
  useEffect(()=>{ document.title = "Expenses - True North"; },[])
  return (
    <div className="max-w-6xl mx-auto p-4 grid gap-6">
      <ExpenseForm />
      <ExpensesList />
    </div>
  )
}
