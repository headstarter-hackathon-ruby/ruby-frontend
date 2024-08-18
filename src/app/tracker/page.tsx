"use client";
import React, { useState, useEffect } from "react";
import { useTheme } from "@/components/ui/ThemeContext";
import Header from "@/components/ui/navbar";
import { API_URL } from "../config";
import { createClient } from "../utils/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  PieChart,
  Pie,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Trash2 } from "lucide-react";

interface Transaction {
  id?: number;
  transaction_id?: number;
  transaction_name: string;
  amount: number;
  date: string;
}

interface Prediction {
  date: string;
  predicted_balance: number;
  upper_balance: number;
  lower_balance: number;
}

export default function Tracker() {
  const [userEmail, setUserEmail] = useState<string>("");
  const [userId, setUserId] = useState<string>("");
  const [goalBudget, setGoalBudget] = useState<number | null>(null);
  const [editingGoal, setEditingGoal] = useState<boolean>(false);
  const [tempGoalBudget, setTempGoalBudget] = useState<string>("");
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const [newExpense, setNewExpense] = useState<Transaction>({
    transaction_id: 0,
    transaction_name: "",
    amount: 0,
    date: "",
  });

  const [newIncome, setNewIncome] = useState<Transaction>({
    id: 0,
    transaction_name: "",
    amount: 0,
    date: "",
  });

  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const { theme } = useTheme();
  const supabase = createClient();

  const CustomTooltip = ({
    active,
    payload,
    label,
  }: {
    active: boolean;
    payload: any[];
    label: string;
  }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="custom-tooltip rounded-lg bg-tooltipBg p-2">
          <p className="label text-tooltipFg">{`${
            data.name
          } : $${data.value.toFixed(2)}`}</p>
        </div>
      );
    }
    return null;
  };

  const PredictionTooltip = ({
    active,
    payload,
    label,
  }: {
    active: boolean;
    payload: any[];
    label: string;
  }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip rounded-lg bg-tooltipBg p-2">
          <p className="label text-tooltipFg">{`Date: ${label}`}</p>
          {payload.map((entry, index) => (
            <p
              key={index}
              className="text-tooltipFg"
              style={{ color: entry.color }}
            >
              {`${entry.name}: $${entry.value.toFixed(2)}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };
  useEffect(() => {
    console.log(transactions);
  }, [transactions]);

  useEffect(() => {
    async function getUserInfo() {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();
      if (error) {
        console.error("Error fetching user:", error);
      } else if (user) {
        setUserEmail(user.email || "");
        setUserId(user.id || "");
        fetchGoalBudget(user.id);
        fetchTransactions(user.id);
      }
    }

    getUserInfo();
  }, []);

  const fetchGoalBudget = async (userId: string) => {
    try {
      const response = await fetch(
        `${API_URL}get_financial_goals?user_id=${userId}`
      );
      const data = await response.json();
      if (data.length > 0) {
        setGoalBudget(data[0].goal_balance);
      }
    } catch (error) {
      console.error("Error fetching goal budget:", error);
    }
  };

  const fetchTransactions = async (userId: string) => {
    try {
      const response = await fetch(
        `${API_URL}get_transactions?user_id=${userId}`
      );
      const data = await response.json();
      setTransactions(data);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  const addTransaction = async () => {
    try {
      const response = await fetch(`${API_URL}add_transaction`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newExpense,
          amount: -Math.abs(newExpense.amount), // Ensure expense is negative
          user_id: userId,
        }),
      });
      if (response.ok) {
        fetchTransactions(userId);
        setNewExpense({
          transaction_id: 0,
          transaction_name: "",
          amount: 0,
          date: "",
        });
      }
    } catch (error) {
      console.error("Error adding transaction:", error);
    }
  };

  const addIncome = async () => {
    try {
      const response = await fetch(`${API_URL}add_transaction`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newIncome,
          amount: Math.abs(newIncome.amount), // Ensure expense is negative
          user_id: userId,
        }),
      });
      if (response.ok) {
        fetchTransactions(userId);
        setNewExpense({
          transaction_id: 0,
          transaction_name: "",
          amount: 0,
          date: "",
        });
      }
    } catch (error) {
      console.error("Error adding transaction:", error);
    }
  };
  const deleteTransaction = async (transactionId: number) => {
    try {
      console.log(transactionId);
      const response = await fetch(`${API_URL}delete_transaction`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          transaction_id: transactionId,
        }),
      });
      if (response.ok) {
        fetchTransactions(userId);
      }
    } catch (error) {
      console.error("Error deleting transaction:", error);
    }
  };

  const generatePredictions = async () => {
    try {
      const response = await fetch(
        `${API_URL}get_prediction?user_id=${userId}`
      );
      const data = await response.json();
      setPredictions(data);
    } catch (error) {
      console.error("Error generating predictions:", error);
    }
  };

  const setGoalBudgetHandler = async () => {
    if (tempGoalBudget === "") return;
    try {
      const response = await fetch(`${API_URL}add_financial_goal`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userId,
          date: new Date().toISOString().split("T")[0],
          current_balance: transactions.reduce((sum, t) => sum + t.amount, 0),
          goal_balance: parseFloat(tempGoalBudget),
        }),
      });
      if (response.ok) {
        setGoalBudget(parseFloat(tempGoalBudget));
        setEditingGoal(false);
        setTempGoalBudget("");
      }
    } catch (error) {
      console.error("Error setting goal budget:", error);
    }
  };

  const incomeData = transactions
    .filter((t) => t.amount > 0)
    .reduce<Record<string, number>>((acc, t) => {
      acc[t.transaction_name] = (acc[t.transaction_name] || 0) + t.amount;
      return acc;
    }, {});

  const expenseData = transactions
    .filter((t) => t.amount < 0)
    .reduce<Record<string, number>>((acc, t) => {
      acc[t.transaction_name] =
        (acc[t.transaction_name] || 0) + Math.abs(t.amount);
      return acc;
    }, {});

  const categoryData = transactions.reduce<Record<string, number>>((acc, t) => {
    acc[t.transaction_name] = (acc[t.transaction_name] || 0) + t.amount;
    return acc;
  }, {});

  const roundPredictions = (predictions: Prediction[]): Prediction[] => {
    return predictions.map((prediction) => ({
      ...prediction,
      predicted_balance: parseFloat(
        (Math.round(prediction.predicted_balance * 100) / 100).toFixed(2)
      ),
      upper_balance: parseFloat(
        (Math.round(prediction.upper_balance * 100) / 100).toFixed(2)
      ),
      lower_balance: parseFloat(
        (Math.round(prediction.lower_balance * 100) / 100).toFixed(2)
      ),
    }));
  };

  const roundedPredictions = roundPredictions(predictions);

  return (
    <div
      className={`min-h-screen  w-full p-4 ${
        theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-gray-900"
      }`}
    >
      <Header />
      <main className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">Financial Tracker</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Card className="col-span-1 md:col-span-2">
            <CardHeader>
              <CardTitle>Goal Budget</CardTitle>
            </CardHeader>
            <CardContent>
              {!editingGoal && goalBudget ? (
                <div className="flex justify-between items-center">
                  <p className="text-2xl font-semibold">
                    Current Goal:{" "}
                    <span className="text-green-500">${goalBudget}</span>
                  </p>
                  <Button onClick={() => setEditingGoal(true)}>
                    Edit Goal
                  </Button>
                </div>
              ) : (
                <div>
                  <Label htmlFor="goalBudget">Set your goal budget</Label>
                  <div className="flex items-center mt-2">
                    <Input
                      id="goalBudget"
                      type="number"
                      placeholder="Enter goal amount"
                      value={tempGoalBudget}
                      onChange={(e) => setTempGoalBudget(e.target.value)}
                      className="mr-2"
                    />
                    <Button onClick={setGoalBudgetHandler}>Save Goal</Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Add Expenses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="expenseName">Expense Name</Label>
                  <Input
                    id="expenseName"
                    placeholder="Enter expense name"
                    value={newExpense.transaction_name}
                    onChange={(e) =>
                      setNewExpense({
                        ...newExpense,
                        transaction_name: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="expenseAmount">Amount</Label>
                  <Input
                    id="expenseAmount"
                    type="number"
                    placeholder="Enter amount"
                    value={newExpense.amount || ""}
                    onChange={(e) =>
                      setNewExpense({
                        ...newExpense,
                        amount: Number(e.target.value),
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="expenseDate">Date</Label>
                  <Input
                    id="expenseDate"
                    type="date"
                    value={newExpense.date}
                    onChange={(e) =>
                      setNewExpense({
                        ...newExpense,
                        date: e.target.value,
                      })
                    }
                  />
                </div>
                <Button onClick={addTransaction} className="w-full">
                  Add Expense
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Add Income</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="incomeName">Income Name</Label>
                  <Input
                    id="incomeName"
                    placeholder="Enter income name"
                    value={newIncome.transaction_name}
                    onChange={(e) =>
                      setNewIncome({
                        ...newIncome,
                        transaction_name: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="incomeAmount">Amount</Label>
                  <Input
                    id="incomeAmount"
                    type="number"
                    placeholder="Enter amount"
                    value={newIncome.amount || ""}
                    onChange={(e) =>
                      setNewIncome({
                        ...newIncome,
                        amount: Number(e.target.value),
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="incomeDate">Date</Label>
                  <Input
                    id="incomeDate"
                    type="date"
                    value={newIncome.date}
                    onChange={(e) =>
                      setNewIncome({
                        ...newIncome,
                        date: e.target.value,
                      })
                    }
                  />
                </div>
                <Button onClick={addIncome} className="w-full">
                  Add Income
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="col-span-1 md:col-span-2 mb-6">
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((t, i) => (
                    <TableRow key={i}>
                      <TableCell>
                        {new Date(t.date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{t.transaction_name}</TableCell>
                      <TableCell
                        className={
                          t.amount >= 0 ? "text-green-500" : "text-red-500"
                        }
                      >
                        ${Math.abs(t.amount).toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteTransaction(t.transaction_id!)}
                        >
                          <Trash2 className="text-red-500" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        <Separator className="my-8" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle>Income Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={Object.entries(incomeData).map(([name, value]) => ({
                      name,
                      value,
                    }))}
                    dataKey="value"
                    nameKey="name"
                    fill="#4CAF50"
                    label
                  />
                  <Tooltip
                    content={({ active, payload, label }) => (
                      <CustomTooltip
                        active={active || false}
                        payload={payload || []}
                        label={label}
                      />
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Expense Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={Object.entries(expenseData).map(([name, value]) => ({
                      name,
                      value,
                    }))}
                    dataKey="value"
                    nameKey="name"
                    fill="#FF5733"
                    label
                  />
                  <Tooltip
                    content={({ active, payload, label }) => (
                      <CustomTooltip
                        active={active || false}
                        payload={payload || []}
                        label={label}
                      />
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Balance Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={transactions.map((t) => ({
                  date: new Date(t.date),
                  amount: t.amount,
                }))}
              >
                <XAxis dataKey="date" />
                <YAxis />
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip
                  content={({ active, payload, label }) => (
                    <CustomTooltip
                      active={active || false}
                      payload={payload || []}
                      label={label}
                    />
                  )}
                />
                <Legend />
                <Line type="monotone" dataKey="amount" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Category Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={Object.entries(categoryData).map(([name, value]) => ({
                  name,
                  income: value > 0 ? value : 0,
                  expense: value < 0 ? Math.abs(value) : 0,
                }))}
              >
                <XAxis dataKey="name" />
                <YAxis />
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      const value = data.income || -data.expense;
                      return (
                        <div className="custom-tooltip rounded-lg bg-tooltipBg p-2 ">
                          <p className="label text-tooltipFg">{`${
                            data.name
                          } : $${Math.abs(value).toFixed(2)}`}</p>
                          <p className="desc text-tooltipFg">
                            {value >= 0 ? "Income" : "Expense"}
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend />
                <Bar dataKey="income" name="Income" fill="#82ca9d" />
                <Bar dataKey="expense" name="Expense" fill="#FF5733" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Goal Progress</CardTitle>
          </CardHeader>
          <CardContent>
            {goalBudget ? (
              <div>
                <progress
                  value={transactions.reduce((sum, t) => sum + t.amount, 0)}
                  max={goalBudget}
                  className="w-full h-4 rounded-full overflow-hidden"
                />
                <p className="mt-2 text-center">
                  $
                  {transactions
                    .reduce((sum, t) => sum + t.amount, 0)
                    .toFixed(2)}{" "}
                  / ${goalBudget}
                </p>
              </div>
            ) : (
              <Alert>
                <AlertTitle>No Goal Set</AlertTitle>
                <AlertDescription>
                  Set a goal budget to track your progress.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Financial Predictions</CardTitle>
          </CardHeader>
          <CardContent>
            <Button onClick={generatePredictions} className="mb-4">
              Generate Predictions
            </Button>
            {roundedPredictions.length > 0 && (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={roundedPredictions}>
                  <XAxis dataKey="date" />
                  <YAxis />
                  <CartesianGrid strokeDasharray="3 3" />
                  <Tooltip
                    content={({ active, payload, label }) => (
                      <PredictionTooltip
                        active={active || false}
                        payload={payload || []}
                        label={label}
                      />
                    )}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="predicted_balance"
                    stroke="#8884d8"
                  />
                  <Line
                    type="monotone"
                    dataKey="upper_balance"
                    stroke="#82ca9d"
                    strokeDasharray="3 3"
                  />
                  <Line
                    type="monotone"
                    dataKey="lower_balance"
                    stroke="#ffc658"
                    strokeDasharray="3 3"
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
