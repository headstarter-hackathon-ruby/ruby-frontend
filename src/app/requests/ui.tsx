import { createClient } from "@/app/utils/supabase/client";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Pinecone } from "@pinecone-database/pinecone";

export default function RequestsUI() {
  const [complaints, setComplaints] = useState<
    {
      admin_text: string;
      product: string;
      resolved: string;
      subcategory: string;
      summary: string;
      text: string;
      userID: string;
    }[]
  >([]);
  const [userId, setUserId] = useState("");

  const router = useRouter();
  const supabase = createClient();
  const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY! });

  useEffect(() => {
    async function getUserInfo() {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();
      if (error) {
        console.error("Error fetching user:", error);
      } else if (user) {
        setUserId(user.id || "");
      }
    }

    getUserInfo();
  });

  useEffect(() => {
    async function fetchComplaints() {
      const index = pc.index("complaints");

      const queryResponse = await index.namespace("rag_complaints").query({
        vector: Array(1536).fill(0),
        topK: 10000,
        includeMetadata: true,
        filter: {
          genre: { $eq: userId },
        },
      });

      for (const match of queryResponse.matches) {
        if (match.metadata) {
          const complaint = {
            admin_text: match.metadata.admin_text.toString(),
            product: match.metadata.product.toString(),
            resolved: match.metadata.resolved.toString(),
            subcategory: match.metadata.subcategory.toString(),
            summary: match.metadata.summary.toString(),
            text: match.metadata.text.toString(),
            userID: match.metadata.userID.toString(),
          };
          setComplaints((complaints) => [...complaints, complaint]);
        }
      }
    }

    fetchComplaints();
  }, []);

  const resolvedComplaints = complaints.filter(
    (complaint) => complaint.resolved === "true"
  );
  const unresolvedComplaints = complaints.filter(
    (complaint) => complaint.resolved === "false"
  );

  return (
    <div>
      <h1>Requests</h1>
      <div>
        <h2>Unresolved Complaints</h2>
        {unresolvedComplaints.map((complaint, index) => (
          <div key={index}>
            <p>{complaint.summary}</p>
          </div>
        ))}
      </div>
      <div>
        <h2>Resolved Complaints</h2>
        {resolvedComplaints.map((complaint, index) => (
          <div key={index}>
            <p>{complaint.summary}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
