import React from "react";
import { Pinecone } from "@pinecone-database/pinecone";
import RequestsUI from "./ui";
import { API_URL } from "../config";
import { createClient } from "../utils/supabase/server";
const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY! });

const fetchComplaints = async (userId: string) => {
  const index = pc.index("complaints");

  const queryResponse = await index.namespace("rag_complaints").query({
    vector: Array(1536).fill(0),
    topK: 50,
    includeMetadata: true,
    filter: {
      userID: { $eq: userId },
    },
  });

  const complaints = queryResponse.matches
    .map((match) => {
      if (match.metadata) {
        return {
          pinecodeID: match.id,
          admin_text: match.metadata.admin_text.toString(),
          product: match.metadata.product.toString(),
          resolved: match.metadata.resolved.toString(),
          subcategory: match.metadata.subcategory.toString(),
          summary: match.metadata.summary.toString(),
          text: match.metadata.text.toString(),
          userID: match.metadata.userID.toString(),
        };
      }
      return null;
    })
    .filter((complaint) => complaint !== null);

  return complaints;
};

const fetchSimilarComplaints = async (complaint: string) => {
  "use server";
  const response = await fetch(
    `${API_URL}complaints/similar?complaint=${encodeURIComponent(complaint)}`
  );

  if (response.ok) {
    const similarComplaints = await response.json();
    return similarComplaints;
  } else {
    console.error("Error fetching similar complaints:", response.statusText);
    return [];
  }
};

const fetchSolution = async (complaint: string) => {
  "use server";
  const response = await fetch(
    `${API_URL}complaints/solutions?complaint=${encodeURIComponent(complaint)}`
  );

  if (response.ok) {
    const json = await response.json();
    return json.solution;
  } else {
    console.error("Error fetching solution:", response.statusText);
    return null;
  }
};

const handleResolve = async (complaint: any, solution: string | undefined) => {
  "use server";
  const index = pc.index("complaints");
  const prevResolved = complaint.resolved === "true";
  console.log(prevResolved);
  console.log(complaint.pinecodeID);
  try {
    if (prevResolved) {
      // Mark as unresolved
      await index.namespace("rag_complaints").update({
        id: complaint.pinecodeID,
        metadata: {
          resolved: false,
          admin_text: " ",
        },
      });
    } else {
      // Mark as resolved with solution
      await index.namespace("rag_complaints").update({
        id: complaint.pinecodeID,
        metadata: {
          resolved: true,
          admin_text: solution,
        },
      });
    }
    await fetchComplaints(complaint.userID);
  } catch (error) {
    console.error("Error resolving complaint:", error);
  }
};

export default async function RequestsPage() {
  const supabase = createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error) {
    return <div>Error fetching user: {error.message}</div>;
  }

  const user = data.user;

  if (user) {
    const userId = user.id || "";
    const complaints = await fetchComplaints(userId);
    console.log(complaints);
    return (
      <RequestsUI
        complaints={complaints}
        fetchSimilarComplaints={fetchSimilarComplaints}
        fetchSolution={fetchSolution}
        handleResolve={handleResolve}
      />
    );
  }

  return <div>No user found</div>;
}
