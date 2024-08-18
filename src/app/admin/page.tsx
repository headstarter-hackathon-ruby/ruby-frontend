"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { API_URL } from "../config";
import { Search, Filter } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Complaint {
  id: string;
  metadata: {
    product: string;
    sub_product: string;
    resolved: boolean;
    summary: string;
    admin_text: string;
  };
}

interface Category {
  [key: string]: number;
}

interface ResolutionStatus {
  resolved: number;
  unresolved: number;
  resolution_rate: number;
}

interface SimilarComplaint {
  id: string;
  summary: string;
  similarity_score: number;
}

const AdminDashboard: React.FC = () => {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [totalComplaints, setTotalComplaints] = useState<number>(0);
  const [categories, setCategories] = useState<Category>({});
  const [resolutionStatus, setResolutionStatus] = useState<ResolutionStatus>({
    resolved: 0,
    unresolved: 0,
    resolution_rate: 0,
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [complaintsPerPage] = useState<number>(10);
  const [tempAdminNotes, setTempAdminNotes] = useState<{
    [key: string]: string;
  }>({});
  const [similarComplaints, setSimilarComplaints] = useState<
    SimilarComplaint[]
  >([]);
  const [complaintTextForSimilar, setComplaintTextForSimilar] =
    useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [allComplaintsRes, categoriesRes, resolutionStatusRes] =
        await Promise.all([
          fetch(`${API_URL}complaints/all`),
          fetch(`${API_URL}complaints/categories`),
          fetch(`${API_URL}complaints/resolution_status`),
        ]);

      const allComplaintsData = await allComplaintsRes.json();
      const categoriesData = await categoriesRes.json();
      const resolutionStatusData = await resolutionStatusRes.json();

      setComplaints(allComplaintsData.complaints);
      setTotalComplaints(allComplaintsData.total_complaints);
      setCategories(categoriesData.categories);
      setResolutionStatus(resolutionStatusData);
    } catch (err) {
      setError("Failed to fetch data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleResolution = async (id: string, index: number) => {
    try {
      const res = await fetch(
        `${API_URL}complaints/resolution?id=${encodeURIComponent(id)}`
      );
      const data = await fetch(
        `${API_URL}complaints/current?id=${encodeURIComponent(id)}`
      );
      if (data.ok) {
        const jsonRes = await data.json();
        console.log(jsonRes.admin_text);
        const resolved = jsonRes.resolved;

        // Update the complaints state with the new admin note using the index
        setComplaints((prevComplaints) => {
          const updatedComplaints = [...prevComplaints];
          updatedComplaints[index] = {
            ...updatedComplaints[index],
            metadata: {
              ...updatedComplaints[index].metadata,
              resolved: resolved,
            },
          };
          return updatedComplaints;
        });
      } else {
        throw new Error("Failed to update resolution status");
      }
    } catch (error) {
      console.error("Error updating resolution status:", error);
      setError("Failed to update resolution status. Please try again.");
    }
  };

  const updateTempAdminNote = (id: string, note: string) => {
    setTempAdminNotes({ ...tempAdminNotes, [id]: note });
  };

  const submitAdminNoteUpdate = async (
    note: string,
    id: string,
    index: number
  ) => {
    if (tempAdminNotes[id]) {
      try {
        await fetch(
          `${API_URL}complaints/admin_message?note=${encodeURIComponent(
            note
          )}&id=${encodeURIComponent(id)}`
        );
        const data = await fetch(
          `${API_URL}complaints/current?id=${encodeURIComponent(id)}`
        );
        if (data.ok) {
          const jsonRes = await data.json();
          console.log(jsonRes.admin_text);
          const admin_text = jsonRes.admin_text;

          // Update the complaints state with the new admin note using the index
          setComplaints((prevComplaints) => {
            const updatedComplaints = [...prevComplaints];
            updatedComplaints[index] = {
              ...updatedComplaints[index],
              metadata: {
                ...updatedComplaints[index].metadata,
                admin_text: admin_text,
              },
            };
            return updatedComplaints;
          });

          // Clear the temporary admin note
          setTempAdminNotes((prevNotes) => {
            const newNotes = { ...prevNotes };
            delete newNotes[id];
            return newNotes;
          });
        } else {
          throw new Error("Failed to update admin note");
        }
      } catch (error) {
        console.error("Error updating admin note:", error);
        setError("Failed to update admin note. Please try again.");
      }
    }
  };

  const fetchSimilarComplaints = async () => {
    try {
      const response = await fetch(
        `${API_URL}complaints/similar?complaint=${encodeURIComponent(
          complaintTextForSimilar
        )}`
      );
      const data = await response.json();
      setSimilarComplaints(data.similar_complaints);
    } catch (err) {
      console.error("Error fetching similar complaints:", err);
      setError("Failed to fetch similar complaints. Please try again.");
    }
  };

  const pieChartData = [
    { name: "Resolved", value: resolutionStatus.resolved },
    { name: "Unresolved", value: resolutionStatus.unresolved },
  ];

  const COLORS = ["#4ade80", "#f87171"];

  const barChartData = Object.entries(categories).map(([category, count]) => ({
    category,
    count,
  }));

  // Filtering and searching
  const filteredComplaints = complaints.filter((complaint) => {
    const matchesSearch = complaint.metadata.summary
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "resolved" && complaint.metadata.resolved) ||
      (statusFilter === "unresolved" && !complaint.metadata.resolved);
    return matchesSearch && matchesStatus;
  });

  // Pagination
  const indexOfLastComplaint = currentPage * complaintsPerPage;
  const indexOfFirstComplaint = indexOfLastComplaint - complaintsPerPage;
  const currentComplaints = filteredComplaints.slice(
    indexOfFirstComplaint,
    indexOfLastComplaint
  );

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Total Complaints</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalComplaints}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Complaint Status</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {pieChartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Complaint Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
          <Search className="text-gray-400" />
          <Input
            placeholder="Search complaints..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-64"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Filter className="text-gray-400" />
          <Select
            value={statusFilter}
            onValueChange={(value: any) => setStatusFilter(value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
              <SelectItem value="unresolved">Unresolved</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Sub-category</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Summary</TableHead>
            <TableHead>Admin Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentComplaints.map((complaint) => (
            <TableRow
              key={complaint.id}
              // className={
              // }
            >
              <TableCell>{complaint.id}</TableCell>
              <TableCell>{complaint.metadata.product}</TableCell>
              <TableCell>{complaint.metadata.sub_product}</TableCell>
              <TableCell>
                <Badge
                  variant={
                    complaint.metadata.resolved ? "outline" : "destructive"
                  }
                  className={
                    complaint.metadata.resolved
                      ? "bg-green-100 text-green-800 hover:bg-green-100"
                      : ""
                  }
                >
                  {complaint.metadata.resolved ? "Resolved" : "Unresolved"}
                </Badge>
              </TableCell>
              <TableCell>{complaint.metadata.summary}</TableCell>
              <TableCell>
                <Button
                  onClick={() =>
                    toggleResolution(
                      complaint.id,
                      complaints.findIndex((c) => c.id === complaint.id)
                    )
                  }
                  variant={
                    complaint.metadata.resolved ? "destructive" : "default"
                  }
                  size="sm"
                >
                  {complaint.metadata.resolved
                    ? "Mark Unresolved"
                    : "Mark Resolved"}
                </Button>
                <div className="flex mt-2">
                  <Input
                    placeholder="Admin note"
                    value={tempAdminNotes[complaint.id] || ""}
                    onChange={(e) =>
                      updateTempAdminNote(complaint.id, e.target.value)
                    }
                    className="mr-2"
                  />
                  <Button
                    onClick={() =>
                      submitAdminNoteUpdate(
                        tempAdminNotes[complaint.id],
                        complaint.id,
                        complaints.findIndex((c) => c.id === complaint.id)
                      )
                    }
                    disabled={!tempAdminNotes[complaint.id]}
                    size="sm"
                  >
                    Submit Note
                  </Button>
                </div>
                {complaint.metadata.admin_text && (
                  <div className="mt-2 text-sm  p-2 rounded">
                    <strong>Note:</strong> {complaint.metadata.admin_text}
                  </div>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="mt-4 flex justify-between items-center">
        <Button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </Button>
        <span>
          Page {currentPage} of{" "}
          {Math.ceil(filteredComplaints.length / complaintsPerPage)}
        </span>
        <Button
          onClick={() => paginate(currentPage + 1)}
          disabled={
            currentPage ===
            Math.ceil(filteredComplaints.length / complaintsPerPage)
          }
        >
          Next
        </Button>
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Find Similar Complaints</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2">
            <Input
              placeholder="Enter complaint text"
              value={complaintTextForSimilar}
              onChange={(e) => setComplaintTextForSimilar(e.target.value)}
            />
            <Button
              onClick={fetchSimilarComplaints}
              disabled={!complaintTextForSimilar}
            >
              Find Similar
            </Button>
          </div>
          {similarComplaints.length > 0 && (
            <Table className="mt-4">
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Summary</TableHead>
                  <TableHead>Similarity Score</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {similarComplaints.map((complaint) => (
                  <TableRow key={complaint.id}>
                    <TableCell>{complaint.id}</TableCell>
                    <TableCell>{complaint.summary}</TableCell>
                    <TableCell>
                      {complaint.similarity_score.toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
