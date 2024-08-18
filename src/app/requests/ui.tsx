"use client";

import Link from "next/link";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import Header from "@/components/ui/navbar";

interface Complaint {
  complaints: any[];
  fetchSimilarComplaints: (complaint: any) => Promise<any>;
  fetchSolution: (complaint: any) => Promise<any>;
  handleResolve: (complaint: any, solution: string | undefined) => Promise<any>;
}

export default function RequestsUI(props: Complaint) {
  const { complaints, fetchSimilarComplaints, fetchSolution, handleResolve } =
    props;

  const [selectedComplaint, setSelectedComplaint] = useState<any>(null);
  const [similarComplaints, setSimilarComplaints] = useState<any[]>([]);
  const [solution, setSolution] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [resolvedComplaints, setResolvedComplaints] = useState(
    complaints.filter((complaint) => complaint.resolved === "true")
  );
  const [unresolvedComplaints, setUnresolvedComplaints] = useState(
    complaints.filter((complaint) => complaint.resolved === "false")
  );

  const handleComplaintClick = async (complaint: any) => {
    try {
      setIsLoading(true);
      setSelectedComplaint(complaint);
      const response = await fetchSimilarComplaints(complaint.text);
      setSimilarComplaints(response);
      setIsDialogOpen(true);
    } catch (error) {
      console.error("Error fetching similar complaints:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSolutionClick = async () => {
    try {
      setIsLoading(true);
      const response = await fetchSolution(selectedComplaint.text);
      setSolution(response);
    } catch (error) {
      console.error("Error fetching solution:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setSolution(null);
  };

  const handleResolveClick = async () => {
    try {
      setIsLoading(true);
      await handleResolve(selectedComplaint, solution);

      const updatedComplaint = {
        ...selectedComplaint,
        resolved: selectedComplaint.resolved === "true" ? "false" : "true",
      };

      if (updatedComplaint.resolved === "true") {
        setResolvedComplaints((prev) => [...prev, updatedComplaint]);
        setUnresolvedComplaints((prev) =>
          prev.filter((complaint) => complaint.text !== updatedComplaint.text)
        );
      } else {
        setUnresolvedComplaints((prev) => [...prev, updatedComplaint]);
        setResolvedComplaints((prev) =>
          prev.filter((complaint) => complaint.text !== updatedComplaint.text)
        );
      }
      closeDialog();
    } catch (error) {
      console.error("Error resolving complaint:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderComplaintCard = (complaint: any) => (
    <Card
      className={`mb-4 hover:shadow-md transition-shadow cursor-pointer relative overflow-hidden bg-requestsBg  
      }`}
      onClick={() => handleComplaintClick(complaint)}
    >
      <div
        className={`absolute left-0 top-0 bottom-0 w-1 ${
          complaint.resolved === "true" ? "bg-green-500" : "bg-red-500"
        }`}
      />
      <CardHeader className="flex flex-row text-requestsFg items-center justify-between">
        <CardTitle className="text-lg">{complaint.summary}</CardTitle>
        {complaint.resolved === "true" ? (
          <CheckCircle className="h-5 w-5 text-green-500" />
        ) : (
          <XCircle className="h-5 w-5 text-red-500" />
        )}
      </CardHeader>
      <CardContent className="text-requestsFg2">
        <p>
          <strong>Product:</strong> {complaint.product}
        </p>
        <p>
          <strong>Subcategory:</strong> {complaint.subcategory}
        </p>
        <p>
          <strong>Text:</strong> {complaint.text}
        </p>
        {complaint.admin_text && complaint.admin_text.trim() !== "" && (
          <p>
            <strong>Admin Text:</strong> {complaint.admin_text}
          </p>
        )}
        <p className="text-sm mt-2">
          <strong>User ID:</strong> {complaint.userID}
        </p>
      </CardContent>
    </Card>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <Header />
      <h1 className="text-3xl font-bold text-center mt-16 mb-8">Requests</h1>

      <Tabs defaultValue="unresolved" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="unresolved">Unresolved Complaints</TabsTrigger>
          <TabsTrigger value="resolved">Resolved Complaints</TabsTrigger>
        </TabsList>
        <TabsContent value="unresolved">
          <ScrollArea className="h-[60vh] w-full rounded-md border p-4 shadow-inner">
            {unresolvedComplaints.map((complaint, index) =>
              renderComplaintCard(complaint)
            )}
          </ScrollArea>
        </TabsContent>
        <TabsContent value="resolved">
          <ScrollArea className="h-[60vh] w-full rounded-md border p-4 shadow-inner">
            {resolvedComplaints.map((complaint, index) =>
              renderComplaintCard(complaint)
            )}
          </ScrollArea>
        </TabsContent>
      </Tabs>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              Complaint Details
            </DialogTitle>
          </DialogHeader>
          {selectedComplaint && (
            <div className="mt-4">
              <h3 className="text-xl font-semibold mb-2">Selected Complaint</h3>
              {renderComplaintCard(selectedComplaint)}
            </div>
          )}
          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-2">Similar Complaints</h3>
            <ScrollArea className="h-[30vh] w-full rounded-md border p-4 shadow-inner">
              {similarComplaints.map((complaint, index) => (
                <Card key={index} className="mb-4">
                  <CardContent className="pt-4">
                    <p>
                      <strong>Product:</strong> {complaint.product}
                    </p>
                    <p>
                      <strong>Subcategory:</strong> {complaint.subcategory}
                    </p>
                    <p>
                      <strong>Text:</strong> {complaint.text}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </ScrollArea>
          </div>
          {solution && (
            <div className="mt-6">
              <h3 className="text-xl font-semibold mb-2">Solution</h3>
              <Card className="bg-green-100 dark:bg-green-900 shadow-md">
                <CardContent className="pt-4">
                  <p>{solution}</p>
                </CardContent>
              </Card>
            </div>
          )}
          <DialogFooter className="sm:justify-start mt-6">
            {solution && (
              <Button onClick={handleResolveClick} disabled={isLoading}>
                {selectedComplaint?.resolved === "true"
                  ? "Unresolve"
                  : "Resolve"}
              </Button>
            )}
            {selectedComplaint?.resolved !== "true" && !solution && (
              <Button onClick={handleSolutionClick} disabled={isLoading}>
                Generate Solution
              </Button>
            )}
            <Button variant="secondary" onClick={closeDialog}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-background text-foreground p-6 rounded-lg flex items-center shadow-xl">
            <Loader2 className="mr-3 h-6 w-6 animate-spin" />
            <span className="text-lg">Loading...</span>
          </div>
        </div>
      )}
    </div>
  );
}
