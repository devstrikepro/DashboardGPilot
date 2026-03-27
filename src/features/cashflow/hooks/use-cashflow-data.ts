"use client";

import { useState, useEffect } from "react";

export interface Transaction {
  id: number;
  type: "deposit" | "withdraw";
  amount: number;
  status: "completed" | "pending" | "failed";
  date: string;
  method: string;
}

export interface FlowItem {
  title: string;
  value: string;
  subtitle: string;
  icon: any;
  iconBg: string;
  iconColorKey: string;
  valueColorKey: string;
}

export function useCashflowData() {
  const [loading, setLoading] = useState(true);
  
  // Mock data moved here for now as per "ไม่่ต้อง" (no automatic mapping yet)
  const transactions: Transaction[] = [
    { id: 1, type: "deposit", amount: 5000, status: "completed", date: "Dec 15, 2024", method: "Bank Transfer" },
    { id: 2, type: "withdraw", amount: 2500, status: "completed", date: "Dec 12, 2024", method: "Wire Transfer" },
    { id: 3, type: "deposit", amount: 3000, status: "completed", date: "Dec 08, 2024", method: "Credit Card" },
    { id: 4, type: "withdraw", amount: 1500, status: "pending", date: "Dec 05, 2024", method: "Wire Transfer" },
    { id: 5, type: "deposit", amount: 10000, status: "completed", date: "Dec 01, 2024", method: "Bank Transfer" },
    { id: 6, type: "deposit", amount: 2000, status: "failed", date: "Nov 28, 2024", method: "Credit Card" },
  ];

  const balanceData = [
    { date: "Week 1", balance: 28500 },
    { date: "Week 2", balance: 29200 },
    { date: "Week 3", balance: 30100 },
    { date: "Week 4", balance: 29800 },
    { date: "Week 5", balance: 31500 },
    { date: "Week 6", balance: 32200 },
    { date: "Week 7", balance: 31800 },
    { date: "Week 8", balance: 33500 },
    { date: "Week 9", balance: 34200 },
    { date: "Week 10", balance: 33800 },
    { date: "Week 11", balance: 35100 },
    { date: "Week 12", balance: 35842 },
  ];

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  return {
    loading,
    transactions,
    balanceData,
    currentBalance: 35842.5,
    balanceChange: 7342.5,
    balanceChangePercent: 25.8,
  };
}
