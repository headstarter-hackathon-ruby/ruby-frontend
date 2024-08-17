import react from "react";
import { Pinecone } from "@pinecone-database/pinecone";
import RequestsUI from "./ui";
import { createClient } from "../utils/supabase/server";

const fetchComplaints = async (userId: string) => {};

export default function RequestsPage() {
  const complaints = fetchComplaints();
  return <RequestsUI complaints={complaints} />;
}
