import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpIcon, ArrowDownIcon } from "lucide-react";

const data = [
  { name: "Jan", value: 400 },
  { name: "Feb", value: 300 },
  { name: "Mar", value: 600 },
  { name: "Apr", value: 800 },
  { name: "May", value: 500 },
  { name: "Jun", value: 700 },
];

const lineData = [
  { name: "Mon", users: 120, sales: 900 },
  { name: "Tue", users: 150, sales: 1200 },
  { name: "Wed", users: 180, sales: 1100 },
  { name: "Thu", users: 190, sales: 1300 },
  { name: "Fri", users: 160, sales: 1500 },
  { name: "Sat", users: 200, sales: 1800 },
  { name: "Sun", users: 140, sales: 1000 },
];

const MetricCard = ({
  title,
  value,
  percentage,
}: {
  title: any;
  value: any;
  percentage: number;
}) => {
  const isPositive = percentage >= 0;
  const textColorClass = isPositive ? "text-green-600" : "text-red-600";
  const Arrow = isPositive ? ArrowUpIcon : ArrowDownIcon;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className={`text-xs flex items-center ${textColorClass}`}>
          <Arrow className="w-3 h-3 mr-1" />
          {Math.abs(percentage).toFixed(1)}% from last month
        </p>
      </CardContent>
    </Card>
  );
};

export default function AdminDashboard() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <MetricCard
          title="Total Revenue"
          value="$45,231.89"
          percentage={20.1}
        />
        <MetricCard title="New Customers" value="+2350" percentage={180.1} />
        <MetricCard title="Active Users" value="12,234" percentage={19} />
        <MetricCard title="Sales" value="2,345" percentage={-7} />
      </div>

      {/* You can add your charts here */}
    </div>
  );
}
