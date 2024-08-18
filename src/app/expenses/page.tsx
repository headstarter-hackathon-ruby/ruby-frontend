"use client";
import Header from "@/components/ui/navbar";
import { useTheme } from "@/components/ui/ThemeContext";
import { useState } from "react";
import {
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";

type DataItem = {
  income: number;
  expense: number;
};

export default function Home() {
  const { theme } = useTheme();
  const [goal, setGoal] = useState<number | null>(null);
  const [goalInput, setGoalInput] = useState<number | null>(null);
  const [transactions, setTransactions] = useState<
    {
      month: string;
      type: "income" | "expense";
      amount: number;
    }[]
  >([]);
  const [futurePredictions, setFuturePredictions] = useState<
    { month: string; amount: number }[]
  >([]);
  const [transactionType, setTransactionType] = useState<string>("income");
  const [transactionAmount, setTransactionAmount] = useState<string>("");
  const [transactionMonth, setTransactionMonth] = useState<string>("January");

  const addTransaction = (
    month: string,
    type: "income" | "expense",
    amount: number
  ) => {
    setTransactions([...transactions, { month, type, amount }]);
  };

  const handleAddTransaction = () => {
    if (transactionType === "income" || transactionType === "expense") {
      const amountNumber = Number(transactionAmount);
      addTransaction(transactionMonth, transactionType, amountNumber);
      setTransactionAmount(""); // Reset the amount input
    } else {
      console.error("Invalid transaction type");
    }
  };

  const generatePredictions = () => {
    // Dummy prediction logic
    const predictions = [
      { month: "January", amount: 1000 },
      { month: "February", amount: 1200 },
      { month: "March", amount: 1100 },
      { month: "April", amount: 900 },
      { month: "May", amount: 800 },
      { month: "June", amount: 1000 },
      { month: "July", amount: 1500 },
      { month: "August", amount: 1300 },
      { month: "September", amount: 1400 },
      { month: "October", amount: 1200 },
      { month: "November", amount: 1100 },
      { month: "December", amount: 1000 },
    ];
    setFuturePredictions(predictions);
  };

  // Prepare combined data for income and expenses
  const combinedData = transactions.reduce((acc, transaction) => {
    const existing = acc.find((item) => item.month === transaction.month);
    if (existing) {
      existing[transaction.type] =
        (existing[transaction.type] || 0) + transaction.amount;
    } else {
      acc.push({
        month: transaction.month,
        [transaction.type]: transaction.amount,
      });
    }
    return acc;
  }, [] as { month: string; income?: number; expense?: number }[]);

  const totalIncome = combinedData.reduce(
    (acc, item) => acc + (item.income || 0),
    0
  );
  const totalExpense = combinedData.reduce(
    (acc, item) => acc + (item.expense || 0),
    0
  );
  const pieData = [
    { name: "Income", value: totalIncome },
    { name: "Expense", value: totalExpense },
  ];
  const COLORS = ["#63C6A0", "#FF6347"];

  return (
    <div
      className={`min-h-screen w-full p-4 ${
        theme === "dark"
          ? "bg-gray-900 text-white"
          : "bg-gray-100 text-gray-900"
      }`}
    >
      <Header />
      <div className="flex min-h-screen flex-col items-center justify-between p-6">
        <div className="flex flex-col w-full p-6 bg-white shadow-md rounded-lg items-center justify-between">
          <div className="flex w-full justify-between items-center">
            {!goal ? (
              <div className="flex flex-col items-center p-4 shadow-md rounded-lg">
                <h2 className="text-xl text-black font-semibold mb-2">
                  Set Your Financial Goal
                </h2>
                <div className="flex w-full items-center space-x-4">
                  <input
                    type="number"
                    value={goalInput ?? ""}
                    onChange={(e) => setGoalInput(Number(e.target.value))}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        const inputValue = (e.target as HTMLInputElement).value;
                        setGoal(Number(inputValue));
                      }
                    }}
                    placeholder="Enter your goal"
                    className="border border-gray-300 p-2 rounded w-full text-black"
                  />
                  <button
                    onClick={() => setGoal(goalInput)}
                    className="bg-blue-500 text-white p-2 rounded w-32"
                  >
                    Set Goal
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <h2 className="text-2xl text-black font-bold mb-2">
                  Your Financial Goal
                </h2>
                <p className="text-3xl text-black font-bold">${goal}</p>
              </div>
            )}

            <div className="flex flex-col p-4 bg-white shadow-md rounded-lg">
              <h2 className="text-xl text-black font-semibold mb-2">
                Add Transaction
              </h2>
              <div className="flex items-center space-x-4">
                <select
                  value={transactionType}
                  onChange={(e) => setTransactionType(e.target.value)}
                  className="border border-gray-300 p-2 rounded text-black"
                >
                  <option value="income">Income</option>
                  <option value="expense">Expense</option>
                </select>
                <input
                  type="number"
                  value={transactionAmount}
                  onChange={(e) => setTransactionAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="border border-gray-300 p-2 rounded text-black"
                />
                <button
                  onClick={handleAddTransaction}
                  className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                >
                  Add Transaction
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-6 p-4 bg-white shadow-md rounded-lg w-full">
          <h2 className="text-xl text-black text-center font-semibold mb-8">
            Expenses vs Income
          </h2>
          <div className="flex justify-between items-center mx-16">
            <BarChart width={650} height={300} data={combinedData}>
              <Bar
                dataKey="income"
                stackId="a"
                fill={COLORS[0]}
                name="Income"
                barSize={100}
              />
              <Bar
                dataKey="expense"
                stackId="a"
                fill={COLORS[1]}
                name="Expense"
                barSize={100}
              />
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis padding={{ top: 50 }} />
              <Tooltip cursor={{ fill: "transparent" }} />
              <Legend verticalAlign="top" height={36} />
            </BarChart>
            <PieChart width={300} height={300}>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                innerRadius={50}
                paddingAngle={5}
                fill="#8884d8"
                dataKey="value"
                label={({
                  cx,
                  cy,
                  midAngle,
                  innerRadius,
                  outerRadius,
                  percent,
                  index,
                }) => {
                  const RADIAN = Math.PI / 180;
                  const radius = 25 + innerRadius + (outerRadius - innerRadius);
                  const x = cx + radius * Math.cos(-midAngle * RADIAN);
                  const y = cy + radius * Math.sin(-midAngle * RADIAN);

                  return (
                    <text
                      x={x}
                      y={y}
                      fill="black"
                      textAnchor={x > cx ? "start" : "end"}
                      dominantBaseline="central"
                      fontSize={14} // Adjust font size as needed
                    >
                      {`${(percent * 100).toFixed(0)}%`}
                    </text>
                  );
                }}
              >
                {pieData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
            </PieChart>
          </div>
          <div className="text-center text-black">
            <p className="text-lg font-semibold">
              Total Income: ${totalIncome}
            </p>
            <p className="text-lg font-semibold">
              Total Expense: ${totalExpense}
            </p>
            <p className="text-lg font-semibold">
              Net Income: ${totalIncome - totalExpense}
            </p>
          </div>
        </div>

        <div className="flex flex-col mb-6 p-4 bg-white shadow-md rounded-lg w-full justify-center items-center">
          <h2 className="text-xl font-semibold mb-2">Future Predictions</h2>
          <button
            onClick={generatePredictions}
            className="bg-green-500 text-white p-2 rounded hover:bg-green-600 mb-4"
          >
            Generate Predictions
          </button>
          <BarChart width={1500} height={450} data={futurePredictions}>
            <Bar dataKey="amount" fill="#82ca9d" />
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis padding={{ top: 50 }} />
            <Tooltip cursor={{ fill: "transparent" }} />
            <Legend />
          </BarChart>
        </div>
      </div>
    </div>
  );
}
