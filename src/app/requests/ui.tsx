"use client";
import { useState } from "react";

interface Complaint {
  complaints: any[];
  fetchSimilarComplaints: (complaint: any) => any;
  fetchSolution: (complaint: any) => any;
  handleResolve: (complaint: any, solution: string | undefined) => any;
}

export default function RequestsUI(props: Complaint) {
  const complaints = props.complaints;
  const fetchSimilarComplaints = props.fetchSimilarComplaints;
  const fetchSolution = props.fetchSolution;
  const handleResolve = props.handleResolve;

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
        setResolvedComplaints([...resolvedComplaints, updatedComplaint]);
        setUnresolvedComplaints(
          unresolvedComplaints.filter(
            (complaint) => complaint.id !== updatedComplaint.id
          )
        );
      } else {
        setUnresolvedComplaints([...unresolvedComplaints, updatedComplaint]);
        setResolvedComplaints(
          resolvedComplaints.filter(
            (complaint) => complaint.id !== updatedComplaint.id
          )
        );
      }

      closeDialog();
    } catch (error) {
      console.error("Error resolving complaint:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto">
      <h1 className="text-center text-2xl font-bold mb-4">Requests</h1>
      <div className="flex justify-between">
        <div className="w-1/2 p-4 mr-2">
          <h2 className="text-xl text-center font-semibold mb-2">
            Unresolved Complaints
          </h2>
          {unresolvedComplaints.map((complaint, index) => (
            <div
              key={index}
              className="mb-2 p-2 border rounded bg-white text-black"
              onClick={() => handleComplaintClick(complaint)}
            >
              <p className="mb-2">
                <strong>Summary:</strong> {complaint.summary}
              </p>
              <p className="mb-2">
                <strong>Product:</strong> {complaint.product}
              </p>
              <p className="mb-2">
                <strong>Subcategory:</strong> {complaint.subcategory}
              </p>
              <p className="mb-4">
                <strong>Text:</strong> {complaint.text}
              </p>
              <p className="text-sm">
                <strong>User ID:</strong> {complaint.userID}
              </p>
            </div>
          ))}
        </div>
        <div className="w-1/2 p-4 ml-2">
          <h2 className="text-xl text-center font-semibold mb-2">
            Resolved Complaints
          </h2>
          {resolvedComplaints.map((complaint, index) => (
            <div
              key={index}
              className="mb-2 p-2 border rounded bg-white text-black"
              onClick={() => handleComplaintClick(complaint)}
            >
              <p>
                <strong>Summary:</strong> {complaint.summary}
              </p>
              <p>
                <strong>Product:</strong> {complaint.product}
              </p>
              <p>
                <strong>Subcategory:</strong> {complaint.subcategory}
              </p>
              <p>
                <strong>Text:</strong> {complaint.text}
              </p>
              {complaint.admin_text.trim() !== "" && (
                <p>
                  <strong>Admin Text:</strong> {complaint.admin_text}
                </p>
              )}
              <p>
                <strong>User ID:</strong> {complaint.userID}
              </p>
            </div>
          ))}
        </div>
      </div>

      {isDialogOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 overflow-y-auto py-8">
          <div className="bg-white p-4 rounded shadow-lg w-1/3 text-black max-h-full overflow-y-auto">
            <h2 className="text-xl font-semibold mb-2">Similar Complaints</h2>
            {similarComplaints.map((complaint, index) => (
              <div key={index} className="mb-2 p-2 border rounded bg-gray-100">
                <p>
                  <strong>Product:</strong> {complaint.product}
                </p>
                <p>
                  <strong>Subcategory:</strong> {complaint.subcategory}
                </p>
                <p>
                  <strong>Text:</strong> {complaint.text}
                </p>
              </div>
            ))}

            {solution && (
              <div className="mt-4 p-2 border rounded bg-green-100">
                <h3 className="text-lg font-semibold">Solution</h3>
                <p>{solution}</p>
              </div>
            )}
            <div className="mt-4 flex justify-between">
              {solution && (
                <button
                  className="mr-2 p-2 bg-green-500 text-white rounded"
                  onClick={handleResolveClick}
                >
                  Resolve
                </button>
              )}
              {selectedComplaint.resolved === "true" && (
                <button
                  className="mr-2 p-2 bg-yellow-500 text-white rounded"
                  onClick={handleResolveClick}
                >
                  Unresolve
                </button>
              )}
              {selectedComplaint.resolved !== "true" && !solution && (
                <button
                  className="p-2 bg-blue-500 text-white rounded"
                  onClick={handleSolutionClick}
                >
                  Generate Solution
                </button>
              )}
              <button
                className="p-2 bg-red-500 text-white rounded"
                onClick={closeDialog}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50 text-white">
          <h1>Loading...</h1>
        </div>
      )}
    </div>
  );
}
