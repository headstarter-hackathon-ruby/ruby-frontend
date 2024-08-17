"use client";

import React, { useState } from "react";
import { useTheme } from "@/components/ui/ThemeContext";
import { ToggleButton } from "@/components/ui/ToggleButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import { createClient } from "@/app/utils/supabase/client";
import { Camera, Mic, Send } from "lucide-react";

export default function Dashboard() {
  const { theme } = useTheme();
  const router = useRouter();
  const supabase = createClient();
  const [complaintText, setComplaintText] = useState("");

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/sign-in");
  };

  const handleComplaintSubmit = (text = complaintText) => {
    console.log("Submitting complaint:", text);
    // Here you would typically send the complaint to your backend
    setComplaintText(""); // Clear the input after submission
  };

  const defaultComplaints = [
    "Product not as described",
    "Late delivery",
    "Poor customer service",
    "Billing issue",
    "Defective product",
    "Cancellation problem"
  ];

  return (
    <div className={`min-h-screen w-full p-4 ${
      theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'
    }`}>
      <nav className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="flex items-center space-x-4">
          <ToggleButton />
          <Button onClick={handleSignOut}>Sign Out</Button>
        </div>
      </nav>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <Card className={theme === 'dark' ? 'bg-gray-800' : 'bg-white'}>
          <CardHeader>
            <CardTitle>Welcome</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Welcome to your dashboard. Here you can manage your account and submit complaints.</p>
          </CardContent>
        </Card>
        
        <Card className={theme === 'dark' ? 'bg-gray-800' : 'bg-white'}>
          <CardHeader>
            <CardTitle>Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Your complaint stats and metrics will be displayed here.</p>
          </CardContent>
        </Card>
        
        <Card className={theme === 'dark' ? 'bg-gray-800' : 'bg-white'}>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Your recent complaint activity will be shown here.</p>
          </CardContent>
        </Card>
      </div>

      <Card className={`mb-8 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
        <CardHeader>
          <CardTitle>Submit a Complaint</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Type your complaint here..."
            value={complaintText}
            onChange={(e) => setComplaintText(e.target.value)}
            className="mb-4"
          />
          <div className="flex space-x-2">
            <Button onClick={() => handleComplaintSubmit()}>
              <Send className="mr-2 h-4 w-4" /> Submit Text
            </Button>
            <Button>
              <Mic className="mr-2 h-4 w-4" /> Record Audio
            </Button>
            <Button>
              <Camera className="mr-2 h-4 w-4" /> Upload Image
            </Button>
          </div>
        </CardContent>
      </Card>

      <h2 className="text-xl font-semibold mb-4">Common Complaints</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {defaultComplaints.map((complaint, index) => (
          <Button
            key={index}
            variant="outline"
            className="h-auto py-4 px-6 text-left justify-start items-start"
            onClick={() => handleComplaintSubmit(complaint)}
          >
            {complaint}
          </Button>
        ))}
      </div>
    </div>
  );
}